/*
 * Modello indipendente per impasti pizza e relativo programma.
 *
 * Idea: la crescita dell'impasto è proporzionale a lievito × attività(T) × tempo.
 * La temperatura dell'impasto viene simulata minuto per minuto (si avvicina a
 * quella dell'ambiente o del frigo con una costante di tempo), quindi il
 * raffreddamento in frigo e il riscaldamento fuori frigo entrano nel calcolo.
 * Il programma viene costruito cercando le durate delle fasi che portano
 * l'impasto ai traguardi di crescita (+30% prima del frigo / a fine puntata,
 * +70–80% all'infornata) esattamente all'orario richiesto.
 *
 * Dosi, costanti e testi sono propri; i traguardi di volume e i tempi tipici
 * sono pratica comune. Nessuna formula proviene da DoughMetry.
 */
(function (root) {
  'use strict';

  const H = 3600e3;
  const STEP = 1 / 60; // passo di simulazione: 1 minuto

  /** Crescita (unità = lievito% × ore equivalenti a 22 °C). */
  const GROWTH = { bulkRoom: 0.35, preCold: 0.45, end: 1.1 };

  /*
   * Range per stile (slider):
   *  - Napoletana classica: disciplinare AVPN 2024, panetti 200–280 g in base al diametro;
   *    per la 30–33 cm si usa 260–280. Idratazione tradizionale bassa (STG: 50–55%,
   *    pratica attuale 58–65%; DoughMetry la fissa a 60%).
   *  - Contemporanea: regolamento del Campionato mondiale 65–78%, in pratica fino a 80%;
   *    panetti 260–270 da regolamento, 280–300 in pratica.
   *  - Pizza classica (la tonda da pizzeria del resto d'Italia): 250 ± 10 g, 60–65%.
   *  - Teglia romana: con farine molto forti (manitoba) e pieghe si arriva all'80% anche
   *    con planetaria o a mano: qui il limite è la farina, non la macchina (machineMax).
   */
  const STYLES = {
    classic: {
      desc: 'Quella del disciplinare: cornicione alto e soffice, centro sottile e morbido che si piega a libretto. Solo farina, acqua, sale e lievito, cotta 60–90 secondi a 430–480 °C.',
      label: 'Napoletana classica', tagline: 'Cornicione alto', hydration: 60, hydrationRange: [58, 65], salt: 3.0, oil: 0, ball: 270, ballRange: [260, 280],
      fdt: [24, 26], roomWindow: [6, 24], fridgeWindow: [12, 72],
    },
    contemporary: {
      desc: 'Più acqua e maturazioni lunghe: cornicione molto gonfio, alveolato e leggero, centro morbido. Vuole una farina forte e più attenzione in impasto.',
      label: 'Napoletana contemporanea', tagline: 'Cornicione gonfio e alveolato', hydration: 72, hydrationRange: [65, 80], salt: 2.8, oil: 0, ball: 280, ballRange: [260, 300],
      fdt: [23, 25], roomWindow: [6, 24], fridgeWindow: [12, 72],
    },
    roman: {
      desc: 'Sottilissima e scrocchiarella, quasi senza cornicione: poca acqua e olio nell’impasto, si stende col mattarello e cuoce più a lungo finché è croccante.',
      label: 'Tonda romana', tagline: 'Scrocchiarella', hydration: 56, hydrationRange: [50, 60], salt: 2.5, oil: 4, ball: 180, ballRange: [160, 200],
      fdt: [22, 26], roomWindow: [6, 12], fridgeWindow: [12, 48],
    },
    standard: {
      desc: 'La tonda da pizzeria del resto d’Italia: più bassa e uniforme della napoletana, un filo d’olio nell’impasto, cottura più lunga e ben dorata. Va bene anche nel forno di casa.',
      label: 'Pizza classica', tagline: 'Bassa e dorata', hydration: 63, hydrationRange: [60, 65], salt: 3.0, oil: 4, ball: 250, ballRange: [240, 260],
      fdt: [25, 28], roomWindow: [5, 12], fridgeWindow: [12, 72],
    },
    teglia: {
      desc: 'Alta, croccante sotto e piena di bolle dentro: impasto molto idratato con pieghe, steso con le dita nella teglia unta e cotto nel forno di casa.',
      label: 'Teglia romana', tagline: 'Alta, in teglia', hydration: 78, hydrationRange: [70, 85], salt: 2.4, oil: 2.5, ball: null, ballRange: null,
      // la struttura si fa con bassinage e pieghe, non con la sola macchina
      machineMax: { spiral: 85, planetary: 85, hand: 85 },
      fdt: [18, 22], roomWindow: [4, 12], fridgeWindow: [18, 48],
    },
  };

  const MACHINES = {
    spiral:    { label: 'Spirale',    maxHydration: 80, heating: 9 },
    planetary: { label: 'Planetaria', maxHydration: 72, heating: 7 },
    hand:      { label: 'A mano',     maxHydration: 70, heating: 3 },
  };

  /**
   * Farine preimpostate: W a metà della forchetta dichiarata da rivenditori/distributori
   * (Nuvola 270–290, Pizzeria 260–280, Saccorosso = Cuoco 300–320).
   */
  // Per aggiungere una farina basta una riga qui: compare nel menu raggruppata per marca.
  const FLOURS = {
    nuvola:     { brand: 'Caputo', name: 'Nuvola', label: 'Caputo Nuvola', w: 280 },
    pizzeria:   { brand: 'Caputo', name: 'Pizzeria', label: 'Caputo Pizzeria', w: 270 },
    saccorosso: { brand: 'Caputo', name: 'Saccorosso', label: 'Caputo Saccorosso', w: 310 },
  };

  /**
   * Idratazione massima che la farina regge, stimata dal W con una retta (minimi quadrati)
   * sui punti medi delle fasce comuni: W<170 ≈ 50%, 180–260 ≈ 55–65%, 250–310 ≈ 65–75%, ~350 ≈ 75–80%.
   * La retta stimata (30 + 0,1375·W) è alzata di 3 punti: con impastamento curato e
   * bassinage le farine reggono un po' più dei valori medi da tabella.
   * Se c'è l'assorbimento da scheda tecnica, vale quello.
   */
  const flourMaxHydration = (w, absorption) => absorption > 0 ? absorption : Math.floor(33 + 0.1375 * w);

  /** Limite dell'idratazione: il più basso tra stile, impastatrice e farina. */
  function hydrationLimit({ style, machine, w, absorption, flourLabel }) {
    const st = STYLES[style], mc = MACHINES[machine];
    const limits = [
      { max: st.hydrationRange[1], by: `limite dello stile ${st.label}` },
      { max: st.machineMax?.[machine] ?? mc.maxHydration,
        by: machine === 'hand' ? 'limite dell’impasto a mano' : `limite della ${mc.label.toLowerCase()}` },
    ];
    if (w > 0 || absorption > 0) limits.push({
      max: flourMaxHydration(w, absorption),
      by: `limite della farina ${flourLabel ? flourLabel + ' ' : ''}` + (absorption > 0 ? `(assorbimento ${absorption}%)` : `W${w}`),
    });
    const lim = limits.reduce((a, b) => (b.max < a.max ? b : a));
    return { ...lim, min: st.hydrationRange[0], tooWeak: lim.max < st.hydrationRange[0] };
  }

  /** Cottura tipica per stile (il forno non cambia dosi né tempi, solo questo testo). */
  const BAKE = {
    classic:      { cue: 'Forno per pizza 430–480 °C, 60–90 secondi', steps: ['Ruota la pizza a metà cottura verso la fiamma o la resistenza.', 'Nel forno di casa: massima temperatura con pietra o acciaio preriscaldati 45 minuti, 5–7 minuti; il cornicione resterà più basso.'] },
    contemporary: { cue: 'Forno per pizza 400–450 °C, 60–90 secondi', steps: ['Ruota la pizza a metà cottura.', 'Nel forno di casa: massima temperatura con pietra o acciaio preriscaldati 45 minuti, 5–7 minuti.'] },
    roman:        { cue: 'Forno 320–380 °C, 2–3 minuti, pizza sottile e croccante', steps: ['Nel forno di casa: massima temperatura con pietra preriscaldata, 6–8 minuti.'] },
    standard:     { cue: 'Forno per pizza 320–380 °C, 2–4 minuti', steps: ['Nel forno di casa: massima temperatura (250–280 °C) con pietra o acciaio preriscaldati 45 minuti, 6–8 minuti.'] },
    teglia:       { cue: 'Forno di casa 250–280 °C, base 10–12 minuti sul fondo, poi condimenti', steps: ['Le ultime fasi sul ripiano medio, finché il fondo è dorato e croccante.'] },
  };

  const YEAST_TYPES = {
    fresh: { label: 'Lievito di birra fresco', short: 'Fresco', factor: 1 },
    ady:   { label: 'Lievito secco attivo', short: 'Secco attivo', factor: 1 / 2 },
    idy:   { label: 'Lievito secco istantaneo', short: 'Secco istantaneo', factor: 1 / 3 },
  };

  // Costante termica dei panetti (ore). Cassetta o mono-porzione cambiano i tempi di
  // pochi minuti su 24–48 h, quindi non è più un'opzione.
  const BALL_TAU = 2;

  /** A cosa serve ogni ingrediente, in termini tecnici. `extra` = non sempre presente (olio). */
  const INGREDIENTS = {
    flour: { label: 'Farina', role: 'Struttura e nutrimento',
      detail: 'Dà l’ossatura. Le proteine (glutine) formano la maglia elastica che trattiene i gas della lievitazione; gli amidi nutrono il lievito e, in cottura, danno colore e croccantezza. Il valore W misura quanta acqua regge la farina e per quanto tempo: più è alto, più lunga può essere la maturazione.' },
    water: { label: 'Acqua', role: 'Idratazione della maglia',
      detail: 'Attiva il glutine e scioglie sale e lievito. Più acqua (idratazione alta) = impasto più estensibile, alveoli più grandi e crosta più leggera, ma gestione più difficile e forno più caldo necessario. La sua temperatura è la leva principale per centrare la temperatura finale dell’impasto.' },
    salt: { label: 'Sale', role: 'Gusto, forza, freno',
      detail: 'Oltre al gusto: rafforza il glutine (impasto più tenace e meno appiccicoso), trattiene umidità e rallenta un po’ il lievito, rendendo la lievitazione più regolare. Dosaggio tipico 2–3% sulla farina; molto oltre, frena troppo la crescita.' },
    yeast: { label: 'Lievito', role: 'Il motore della lievitazione',
      detail: 'I saccaromiceti mangiano gli zuccheri e producono anidride carbonica (volume) più etanolo e acidi (aroma). La quantità si bilancia con tempo e temperatura: più tempo o più freddo → meno lievito. È la variabile che questo calcolatore adatta al tuo programma.' },
    oil: { label: 'Olio', role: 'Morbidezza e doratura', extra: true,
      detail: 'Grasso “extra”: riveste i filamenti di glutine rendendo l’impasto più estensibile e la mollica più soffice, trattiene l’umidità (la pizza resta morbida più a lungo) e favorisce doratura e croccantezza nei forni meno caldi. Tipico della pizza classica, della tonda romana e della teglia, che cuociono a temperature più basse; assente nella napoletana, che cuoce rovente e vuole una maglia “asciutta”. Si aggiunge a fine impasto, quando il glutine è già formato, per non ostacolarne lo sviluppo.' },
  };

  /** Perché esiste ogni fase del programma, in termini tecnici. */
  const PHASE_WHY = {
    mix: 'Sviluppo del glutine: mescolando, le proteine si legano in una rete elastica che intrappolerà i gas. La temperatura di fine impasto decide la velocità di tutto ciò che segue.',
    bulk: 'Puntata (lievitazione in massa): prima lievitazione a massa unica. Il lievito parte, il glutine si distende e si rinforza, iniziano gli aromi. Dà forza e struttura prima di dividere.',
    ball: 'Staglio e formatura: si divide e si dà tensione ai panetti. La pirlatura crea una superficie liscia e tesa che tratterrà i gas dell’ultima lievitazione.',
    preCold: 'Avvio prima del freddo: una breve ripartenza a temperatura ambiente perché il lievito sia già attivo quando i panetti entrano in frigo.',
    cold: 'Maturazione a freddo (retardation): al freddo il lievito quasi si ferma, ma gli enzimi continuano a scomporre amidi e proteine. Risultato: più aroma, più digeribilità, panetti più facili da stendere e finestra d’uso più lunga, senza che il volume esploda.',
    out: 'Appretto (lievitazione finale): i panetti tornano in temperatura e fanno l’ultima crescita, fino a +70–80%. Diventano morbidi e distesi, pronti da stendere.',
    proof: 'Appretto (lievitazione finale): ultima crescita dei panetti fino a +70–80%, morbidi e distesi, pronti da stendere.',
    bake: 'Cottura: il gas si espande (spinta in forno), l’acqua evapora, il glutine coagula e gli zuccheri caramellano (reazione di Maillard) dando crosta e colore. Più alto è il forno, più spinta e cornicione.',
  };

  const TRAY_DENSITY = 0.6;   // g di impasto per cm² di teglia
  const BULK_TAU = 3.5;       // ore: massa intera in contenitore
  const TEGLIA_TAU = 2.2;     // ore: porzione stesa in teglia
  const OUT_TARGET_TEMP = 18; // °C: panetto pronto da stendere
  const MIN_OUT = 2;          // ore minime fuori frigo
  const PRE_COLD_H = 2;       // ore a temperatura ambiente prima del frigo (dopo la puntata)
  const OUT_H = 4;            // ore fuori frigo prima di infornare
  const YEAST_MIN = 0.02, YEAST_MAX = 3;

  /**
   * Attività relativa del lievito rispetto a 22 °C. Q10 ≈ 2,7 sopra i 12 °C; sotto rallenta
   * più in fretta ma non si ferma: a 4 °C circa 9% (crescita lenta ma reale in 48–72 h di frigo).
   * Costanti tarate sul Calcolapizza della Confraternita della Pizza (scarto medio ~10% sul lievito).
   */
  function activity(t) {
    if (t >= 32) return Math.exp(0.10 * 10);
    if (t >= 12) return Math.exp(0.10 * (t - 22));
    return Math.exp(0.10 * -10) * Math.exp(0.18 * (t - 12));
  }

  const round = (x, d = 0) => { const p = 10 ** d; return Math.round(x * p) / p; };
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

  /* ---------- simulazione ---------- */

  function sim(temp) { return { t: 0, temp, eq: 0 }; }
  function copy(s) { return { ...s }; }

  /** Avanza di `hours` in un ambiente a `env` °C con costante di tempo `tau`. */
  function run(s, env, tau, hours) {
    let left = hours;
    while (left > 1e-9) {
      const dt = Math.min(STEP, left);
      const next = env + (s.temp - env) * Math.exp(-dt / tau);
      s.eq += dt * activity((s.temp + next) / 2);
      s.temp = next; s.t += dt; left -= dt;
    }
    return s;
  }

  /** Avanza finché lievito × eq raggiunge `target`; restituisce le ore impiegate (o Infinity). */
  function runUntil(s, env, tau, yeast, target, maxHours) {
    const start = s.t;
    while (yeast * s.eq < target) {
      if (s.t - start >= maxHours) return Infinity;
      run(s, env, tau, STEP);
    }
    return s.t - start;
  }

  /** Tempo perché un panetto passi da `from` a `to` °C in un ambiente a `env`. */
  function warmTime(from, to, env, tau) {
    if (env <= to) return Infinity;
    return Math.max(0, -tau * Math.log((env - to) / (env - from)));
  }

  function bisect(f, lo, hi, iterations = 40) {
    let flo = f(lo);
    for (let i = 0; i < iterations; i++) {
      const mid = (lo + hi) / 2, fm = f(mid);
      if ((fm > 0) === (flo > 0)) { lo = mid; flo = fm; } else hi = mid;
    }
    return (lo + hi) / 2;
  }

  /* ---------- impastamento ---------- */

  function mixPlan(p) {
    const contemporary = p.style === 'contemporary' || p.style === 'teglia';
    const oil = p.oil > 0;
    if (p.machine === 'spiral') {
      const steps = [
        `Versa ${contemporary ? 'circa il 90% dell’acqua' : 'tutta l’acqua'}, sciogli il lievito e aggiungi la farina. Prima velocità.`,
        'Dopo 3–4 minuti, quando la farina è assorbita, aggiungi il sale.',
        contemporary
          ? 'Continua in prima fino a 10–12 minuti, poi aggiungi a filo l’acqua rimasta (bassinage) solo quando l’impasto è incordato.'
          : 'Continua in prima fino a circa 10 minuti complessivi.',
        oil ? 'Aggiungi l’olio a filo, a impasto già formato.' : null,
        'Chiudi con 2–3 minuti in seconda velocità: impasto liscio, che si stacca dalla vasca.',
      ];
      return { minutes: contemporary ? 18 : oil ? 15 : 13, steps };
    }
    if (p.machine === 'planetary') {
      // La planetaria non incorda di continuo come la spirale: si lavora a tratti, con pause
      // coperte e brevi riprese ("start & stop"). Più acqua → un ciclo in più.
      // Tempi: ~5 min preparazione, 7 + 10 di pausa + 7 + 3 di lavorazione, poi 10 min per ciclo
      // (≈ 52 min fino al 65%, ≈ 62 min oltre; DoughMetry riserva 65 min con 3 cicli).
      const cycles = p.hydration > 65 ? 3 : 2;
      // oltre quanto la planetaria regge da sola (teglia con farine forti) l'acqua entra a
      // poco a poco (bassinage) e la struttura si completa con le pieghe
      const beyond = p.hydration > MACHINES.planetary.maxHydration;
      const steps = [
        `Gancio a velocità bassa: acqua e lievito, poi la farina in 2–3 volte, tenendo da parte ${beyond ? 'circa il 15%' : 'un 5%'} dell’acqua. Circa 7 minuti, finché la farina è assorbita.`,
        'Ferma, copri la ciotola e lascia riposare 10 minuti: la farina si idrata e il glutine inizia a formarsi da solo.',
        beyond
          ? 'Riparti a velocità bassa, aggiungi il sale, poi l’acqua tenuta da parte in 3–4 volte (bassinage): la porzione successiva solo quando l’impasto si è di nuovo staccato dalla ciotola. Circa 10 minuti.'
          : 'Riparti a velocità bassa, aggiungi il sale e poi l’acqua tenuta da parte un cucchiaio alla volta, aspettando che venga assorbita. Circa 7 minuti.',
        oil ? 'Aggiungi l’olio a filo, a impasto già formato.' : null,
        'Alza alla velocità media per 2–3 minuti, finché l’impasto si raccoglie sul gancio.',
        `Start & stop, ${cycles} cicli: ciotola coperta 10 minuti, poi 5–10 secondi alla velocità più alta consentita per gli impasti, solo per raccogliere la massa sul gancio. Se la macchina fatica o l’impasto si scalda, fermati.`,
        beyond ? 'Trasferisci in un contenitore unto: nella prima ora fai 3 serie di pieghe (coil fold) a 20 minuti di distanza, con le mani bagnate. Sono loro a dare la struttura che la macchina da sola non riesce a dare.' : null,
      ];
      return { minutes: 32 + cycles * 10 + (beyond ? 3 : 0), steps };
    }
    const steps = [
      'Sciogli il lievito nell’acqua, aggiungi metà farina e mescola fino a una pastella.',
      'Aggiungi il sale, poi il resto della farina poco alla volta.',
      oil ? 'Incorpora l’olio quando l’impasto è già compatto.' : null,
      'Lavora sul piano 10–12 minuti, con 10 minuti di riposo coperto a metà.',
      p.hydration >= 64 ? 'Durante la puntata fai 2–3 giri di pieghe a 20 minuti di distanza.' : 'Chiudi a palla: superficie liscia e tesa.',
    ];
    return { minutes: 30, steps };
  }

  /* ---------- quantità ---------- */

  /**
   * "Dividi tutto in panetti uguali": quanti panetti fare con tutto l'impasto
   * (farina + acqua + sale + olio + lievito). Tra i numeri che danno un peso dentro il
   * range dello stile sceglie quello più vicino al peso tipico; se nessuno ci sta
   * (impasto troppo poco), il più vicino al range. Es. 1,5 kg Nuvola al 60% → 2447 g → 9 × 272 g.
   */
  function splitCount(dough, style) {
    const st = STYLES[style], [lo, hi] = st.ballRange;
    const n0 = Math.max(1, Math.round(dough / st.ball));
    let best = n0, bestScore = Infinity;
    for (let n = Math.max(1, n0 - 2); n <= n0 + 2; n++) {
      const b = dough / n, out = b < lo ? lo - b : b > hi ? b - hi : 0;
      const score = out * 1000 + Math.abs(b - st.ball);
      if (score < bestScore) { bestScore = score; best = n; }
    }
    return best;
  }

  /** Divisione in parti uguali per l'interfaccia (il lievito pesa meno di un grammo per panetto). */
  function equalSplit(p) {
    const q = quantities({ ...p, quantityBasis: 'flour', division: 'equal', yeastType: 'fresh' }, 0.15);
    const [lo, hi] = STYLES[p.style].ballRange;
    return { count: q.count, ball: q.ball, dough: q.dough, inRange: q.ball >= lo && q.ball <= hi };
  }

  function quantities(p, yeastFreshPct) {
    const h = p.hydration / 100, s = p.salt / 100, o = p.oil / 100;
    const y = yeastFreshPct * YEAST_TYPES[p.yeastType].factor / 100;
    const ratio = 1 + h + s + o + y;
    let flour, count = p.count, ball = p.ball, dough;
    if (p.style === 'teglia') {
      dough = p.trayWidth * p.trayLength * TRAY_DENSITY * (p.trays || 1);
      flour = dough / ratio; count = p.trays || 1; ball = dough / count;
    } else if (p.quantityBasis === 'flour') {
      flour = p.flourKg * 1000; dough = flour * ratio;
      if (p.division === 'equal') { count = splitCount(dough, p.style); ball = dough / count; }
      else { count = Math.floor(dough / p.ball); ball = p.ball; }
    } else {
      dough = p.count * p.ball; flour = dough / ratio;
    }
    return {
      flour, water: flour * h, salt: flour * s, oil: flour * o, yeast: flour * y, dough, count, ball,
      leftover: p.quantityBasis === 'flour' && p.division !== 'equal' ? dough - count * ball : 0,
    };
  }

  /**
   * Bilancio termico (calore specifico farina ≈ 0,4 di quello dell'acqua).
   * L'acqua è quella che usi davvero (`p.waterTemp`): da qui esce la temperatura
   * dell'impasto, su cui poi si dimensiona il lievito. Restituisce:
   *  - use:   temperatura dell'acqua;
   *  - dough: temperatura d'impasto che risulta;
   *  - ideal: acqua che centrerebbe il target dello stile;
   *  - iceTip: grammi di ghiaccio tritato (al posto di altrettanta acqua) per scendere
   *    al target, solo se l'impasto verrebbe più caldo del range dello stile.
   */
  function water(p, q, target, maxDough) {
    const cf = 0.4, heating = MACHINES[p.machine].heating + (p.machine === 'hand' ? (p.room - target) * 0.15 : 0);
    const ideal = ((target - heating) * (q.flour * cf + q.water) - q.flour * cf * p.flourTemp) / q.water;
    const use = clamp(p.waterTemp, 0, 45);
    const dough = (use * q.water + p.flourTemp * q.flour * cf) / (q.flour * cf + q.water) + heating;
    // il ghiaccio assorbe anche il calore latente di fusione (≈ 80 cal/g)
    const iceTip = dough > maxDough && ideal < use ? clamp(q.water * (use - ideal) / (use + 80), 0, q.water * 0.6) : 0;
    return { use, dough, ideal, iceTip };
  }

  /* ---------- programma ---------- */

  function planRoom(p, fdt, yeast) {
    const mix = mixPlan(p).minutes / 60;
    const total = p.hours;
    const s = run(sim(fdt), fdt, 1e9, mix);
    const bulkSim = copy(s);
    let bulk = runUntil(bulkSim, p.room, BULK_TAU, yeast, GROWTH.bulkRoom, total - mix);
    bulk = clamp(bulk, Math.min(1, total - mix), Math.max(1, (total - mix) * 0.7));
    run(s, p.room, BULK_TAU, bulk);
    const tauBalls = p.style === 'teglia' ? TEGLIA_TAU : BALL_TAU;
    const proofSim = copy(s);
    const proofNeeded = runUntil(proofSim, p.room, tauBalls, yeast, GROWTH.end, 96);
    const proof = total - mix - bulk;
    run(s, p.room, tauBalls, Math.max(0, proof));
    return {
      phases: [
        { id: 'mix', hours: mix, temp: fdt },
        { id: 'bulk', hours: bulk, temp: s.temp, growth: GROWTH.bulkRoom },
        { id: 'ball', hours: 0 },
        { id: 'proof', hours: proof, growth: GROWTH.end },
        { id: 'bake', hours: 0 },
      ],
      readyAfter: mix + bulk + proofNeeded,
      finalGrowth: yeast * s.eq,
    };
  }

  /** Programma con frigo per un dato lievito. `outHours` = tempo fuori frigo. */
  /** `preColdHours`: durata fissa prima del frigo; se assente, finché la crescita arriva a GROWTH.preCold. */
  function fridgeRun(p, fdt, yeast, outHours, preColdHours) {
    const teglia = p.style === 'teglia';
    const mix = mixPlan(p).minutes / 60;
    const bulk = teglia ? 0.5 : p.style === 'roman' ? 0.5 : 1;
    const tauBalls = teglia ? TEGLIA_TAU : BALL_TAU;
    const s = run(sim(fdt), fdt, 1e9, mix);
    run(s, p.room, BULK_TAU, bulk);
    const preColdTau = teglia ? BULK_TAU : tauBalls;
    const preCold = preColdHours != null ? (run(s, p.room, preColdTau, preColdHours), preColdHours)
      : runUntil(s, p.room, preColdTau, yeast, GROWTH.preCold, 12);
    const preColdGrowth = yeast * s.eq;
    const cold = p.hours - mix - bulk - preCold - outHours;
    if (!(cold >= 0)) return { mix, bulk, preCold, cold, out: outHours, growth: Infinity, tempAtCold: s.temp };
    const tempAtCold = s.temp;
    run(s, p.fridgeTemp, teglia ? BULK_TAU : tauBalls + 0.6, cold);
    const tempOutOfFridge = s.temp;
    run(s, p.room, tauBalls, outHours);
    return { mix, bulk, preCold, preColdGrowth, cold, out: outHours, growth: yeast * s.eq, tempAtCold, tempOutOfFridge, tempAtBake: s.temp };
  }

  function planFridge(p, fdt, fixedYeast) {
    const tauBalls = p.style === 'teglia' ? TEGLIA_TAU : BALL_TAU;
    const minOut = Math.max(MIN_OUT, warmTime(p.fridgeTemp, OUT_TARGET_TEMP, p.room, tauBalls));
    const notes = [];

    // Programma "a tempi fissi": PRE_COLD_H prima del frigo e OUT_H fuori frigo; il lievito si
    // dimensiona perché la crescita arrivi al traguardo esattamente all'infornata. Così più ore di
    // frigo → meno lievito (come nelle tabelle classiche), con tempi fuori frigo sempre ragionevoli.
    if (fixedYeast == null) {
      const out = Math.max(minOut, OUT_H);
      const fits = fridgeRun(p, fdt, YEAST_MAX, out, PRE_COLD_H).cold >= 0;
      if (fits) {
        const g = y => fridgeRun(p, fdt, y, out, PRE_COLD_H).growth - GROWTH.end;
        const yeast = g(YEAST_MAX) < 0 ? YEAST_MAX : g(YEAST_MIN) > 0 ? YEAST_MIN : bisect(g, YEAST_MIN, YEAST_MAX, 40);
        const r = fridgeRun(p, fdt, yeast, out, PRE_COLD_H);
        return { yeast, phases: fridgePhases(p, fdt, r), notes, finalGrowth: r.growth, minOut };
      }
    }

    // Lievito già pesato (temperatura misurata) o tempo troppo corto per i tempi fissi:
    // si parte dal lievito che porta a +30% in circa 3,5 ore e si adattano le durate.
    let yeast = fixedYeast;
    if (yeast == null) {
      const ref = run(sim(fdt), p.room, BALL_TAU, 3.5);
      yeast = clamp(GROWTH.preCold / ref.eq, YEAST_MIN, YEAST_MAX);
    }

    const outFor = y => {
      const maxOut = p.hours;
      const g = o => fridgeRun(p, fdt, y, o).growth - GROWTH.end;
      if (g(minOut) >= 0) return minOut;            // già pronto con il minimo fuori frigo
      if (!(fridgeRun(p, fdt, y, 0).cold >= 0)) return null;
      // cerca la durata fuori frigo che porta esattamente al traguardo
      let hi = minOut;
      while (hi < maxOut && !(g(hi) >= 0) && fridgeRun(p, fdt, y, hi).cold >= 0) hi += 0.5;
      if (!(fridgeRun(p, fdt, y, hi).cold >= 0) || !(g(hi) >= 0)) return null;
      return bisect(g, minOut, hi, 30);
    };

    let out = outFor(yeast);
    if (fixedYeast == null) {
      if (out === minOut && fridgeRun(p, fdt, yeast, minOut).growth > GROWTH.end * 1.02) {
        // troppo lievito per un frigo così lungo: riduci finché la crescita torna giusta
        yeast = bisect(y => fridgeRun(p, fdt, y, minOut).growth - GROWTH.end, YEAST_MIN, yeast, 30);
        out = minOut;
      } else if (out == null) {
        // tempo troppo corto: aumenta il lievito finché il programma ci sta
        let y = yeast;
        while (y < YEAST_MAX && outFor(y) == null) y *= 1.25;
        yeast = Math.min(y, YEAST_MAX); out = outFor(yeast) ?? minOut;
        notes.push('Tempo stretto per il frigo: ho aumentato il lievito.');
      }
    } else if (out == null) out = minOut;

    const r = fridgeRun(p, fdt, yeast, out);
    return { yeast, phases: fridgePhases(p, fdt, r), notes, finalGrowth: r.growth, minOut };
  }

  function fridgePhases(p, fdt, r) {
    const teglia = p.style === 'teglia';
    return [
      { id: 'mix', hours: r.mix, temp: fdt },
      { id: 'bulk', hours: r.bulk },
      ...(teglia ? [] : [{ id: 'ball', hours: 0 }]),
      { id: 'preCold', hours: r.preCold, growth: r.preColdGrowth },
      { id: 'cold', hours: Math.max(0, r.cold), temp: r.tempOutOfFridge },
      ...(teglia ? [{ id: 'ball', hours: 0 }] : []),
      { id: 'out', hours: r.out, temp: r.tempAtBake, growth: GROWTH.end },
      { id: 'bake', hours: 0 },
    ];
  }

  /* ---------- testi delle fasi ---------- */

  function phaseText(p, ph, ctx) {
    const st = STYLES[p.style], teglia = p.style === 'teglia', growthPct = g => Math.round(g / GROWTH.end * 75 / 5) * 5;
    const fmt = x => round(x, 1).toLocaleString('it-IT');
    const build = () => { switch (ph.id) {
      case 'mix': return {
        title: 'Impasta', cue: `Impasto liscio, circa ${fmt(ph.temp)} °C a fine lavorazione`,
        steps: ctx.mix.steps.filter(Boolean),
      };
      case 'bulk': return p.fridge
        ? { title: teglia ? 'Riposo prima del frigo' : p.style === 'roman' ? 'Rilassamento' : 'Puntata', cue: 'Coperto, a temperatura ambiente',
            steps: [teglia ? 'Trasferisci in un contenitore unto e chiudi. Poi in frigo.' : 'Copri l’impasto e lascialo rilassare: non deve ancora crescere molto.'] }
        : { title: 'Puntata', cue: `Circa +${growthPct(GROWTH.bulkRoom)}% di volume`,
            steps: ['Copri l’impasto in un contenitore trasparente e segna il livello di partenza.', 'Il volume decide più dell’orologio: con ambiente più caldo arriva prima.'] };
      case 'ball': return {
        title: teglia ? 'Staglio' : 'Forma i panetti', cue: teglia ? 'Una porzione per teglia' : `Panetti da ${Math.round(ctx.q.ball)} g`,
        steps: teglia
          ? ['Rovescia la massa sul piano infarinato, dividi e forma una palla lenta per teglia.']
          : ['Dividi l’impasto e forma panetti tesi, chiudendo bene il fondo.',
             'In contenitori chiusi, uno per panetto, oppure in cassetta a 3–4 cm di distanza.'],
      };
      case 'preCold': return {
        title: 'Prima del frigo',
        cue: (g => g < 10 ? (teglia ? 'Massa appena mossa: cresce poco, è normale' : 'Panetti appena mossi: crescono poco, è normale')
          : teglia ? `Massa a circa +${g}%` : `Circa +${g}%, panetti che iniziano ad allargarsi`)(growthPct(ph.growth ?? GROWTH.preCold)),
        steps: teglia
          ? ['Lascia la massa coperta a temperatura ambiente.', 'Poi in frigo: con poco lievito e tante ore di frigo la crescita vera avviene dopo, in frigo e fuori frigo.']
          : ['Lascia i panetti coperti a temperatura ambiente: riprendono forza dopo la formatura.', 'Poi in frigo: con poco lievito e tante ore di frigo la crescita vera avviene dopo, in frigo e fuori frigo.'],
      };
      case 'cold': return {
        title: teglia ? 'Massa in frigo' : 'Frigorifero', cue: `${fmt(p.fridgeTemp)} °C, ben chiuso`,
        steps: ['Ripiano centrale, lontano dalla porta.', `In frigo l’impasto rallenta molto: impiega qualche ora a raffreddarsi, poi cresce poco.`],
      };
      case 'out': return {
        title: p.fridge ? 'Fuori frigo' : 'Appretto', cue: 'Panetti a +70–80%, morbidi e distesi',
        steps: [
          teglia ? 'Stendi la porzione nella teglia unta con le dita, senza schiacciare i bordi, e lascia lievitare coperto.' : 'Lascia i contenitori chiusi a temperatura ambiente.',
          `Prima di stendere il panetto deve essere intorno a ${OUT_TARGET_TEMP}–20 °C e lasciare un’impronta che torna su lentamente.`,
        ],
      };
      case 'proof': return {
        title: 'Appretto', cue: 'Panetti a +70–80%, morbidi e distesi',
        steps: [teglia ? 'Stendi in teglia unta e lascia lievitare coperto.' : 'Panetti coperti a temperatura ambiente.', 'Pronto quando la pressione del dito lascia un segno che risale lentamente.'],
      };
      case 'bake': return {
        title: 'Cottura', cue: BAKE[p.style].cue,
        steps: [teglia ? 'Precuoci la base, poi completa con i condimenti.' : 'Stendi un panetto alla volta, condisci e inforna subito.', ...BAKE[p.style].steps],
      };
    } };
    const base = build() || { title: ph.id, steps: [] };
    return PHASE_WHY[ph.id] ? { ...base, why: PHASE_WHY[ph.id] } : base;
  }

  /* ---------- calcolo principale ---------- */

  function defaults(style) {
    const s = STYLES[style];
    return { hydration: s.hydration, hydrationRange: s.hydrationRange, salt: s.salt, oil: s.oil, ball: s.ball, ballRange: s.ballRange };
  }

  /**
   * input: { style, machine, quantityBasis ('count'|'flour'), count, ball, flourKg, division,
   *          trayWidth, trayLength, trays, hydration, salt, oil, flourTemp, waterTemp, w, yeastType,
   *          start (ms), hours, fridge, room, fridgeTemp, measuredDoughTemp }
   */
  function calculate(input) {
    const p = {
      machine: 'spiral', quantityBasis: 'count', division: 'fixed',
      yeastType: 'fresh', fridgeTemp: 4, flourTemp: 22, room: 22, waterTemp: 4, ...input,
    };
    if (!Number.isFinite(p.waterTemp)) p.waterTemp = 4;
    const st = STYLES[p.style];
    if (!st) throw new Error('Stile sconosciuto: ' + p.style);
    const alerts = [];
    const target = (st.fdt[0] + st.fdt[1]) / 2;

    // 1) temperatura dell'impasto a fine lavorazione: esce dal bilancio termico
    //    con l'acqua alla temperatura che usi davvero (es. 4 °C dal frigo).
    const w0 = water(p, quantities(p, 0), target, st.fdt[1]);
    const startTemp = clamp(w0.dough, 12, 32);

    // 2) lievito dimensionato su quella temperatura, così il programma chiude all'orario scelto.
    const base = p.fridge ? planFridge(p, startTemp) : null;
    let yeast;
    if (p.fridge) yeast = base.yeast;
    else {
      const mixH = mixPlan(p).minutes / 60;
      const s = run(sim(startTemp), startTemp, 1e9, mixH);
      run(s, p.room, BULK_TAU, Math.max(0, p.hours - mixH));
      yeast = clamp(GROWTH.end / s.eq, YEAST_MIN, YEAST_MAX);
    }
    if (yeast >= YEAST_MAX) alerts.push('Tempo troppo breve: servirebbe più del 3% di lievito.');

    const q = quantities(p, yeast);
    const w = water(p, q, target, st.fdt[1]);

    // 3) se hai misurato la temperatura a fine impasto, il lievito è già pesato: si adattano i tempi.
    const fdt = p.measuredDoughTemp ?? startTemp;
    const plan = p.fridge ? (p.measuredDoughTemp == null ? base : planFridge(p, fdt, yeast)) : planRoom(p, fdt, yeast);
    if (plan.notes) alerts.push(...plan.notes);

    const mix = mixPlan(p);

    // orari
    let t = p.start ?? 0;
    const phases = plan.phases.map(ph => {
      const text = phaseText(p, ph, { q, mix });
      const item = { ...ph, ...text, from: t, to: t + ph.hours * H };
      t = item.to;
      return item;
    });

    // stima della cottura se il programma con la temperatura misurata non torna
    let estimatedBake = null;
    if (!p.fridge && p.measuredDoughTemp != null && Number.isFinite(plan.readyAfter) && Math.abs(plan.readyAfter - p.hours) * 60 >= 10) {
      estimatedBake = (p.start ?? 0) + plan.readyAfter * H;
      alerts.push(`Con l’impasto a ${round(fdt, 1)} °C sarà pronto ${plan.readyAfter < p.hours ? 'prima' : 'dopo'} dell’orario scelto: segui il volume.`);
    }
    if (p.fridge && p.measuredDoughTemp != null && Math.abs(plan.finalGrowth - GROWTH.end) > 0.1) alerts.push('Con questa temperatura il programma è al limite: controlla il volume più che gli orari.');

    // avvisi
    const win = p.fridge ? st.fridgeWindow : st.roomWindow;
    if (p.hours < win[0] || p.hours > win[1]) alerts.push(`Per ${st.label} ${p.fridge ? 'con' : 'senza'} frigo consiglio ${win[0]}–${win[1]} ore totali.`);
    const hl = hydrationLimit(p);
    if (p.hydration > Math.max(hl.max, hl.min)) alerts.push(`Idratazione ${p.hydration}% oltre il massimo ${hl.max}% (${hl.by}).`);
    if (hl.tooWeak) alerts.push(`La farina regge circa il ${hl.max}% d’acqua, meno del minimo tipico per ${st.label} (${hl.min}%): meglio una farina più forte.`);
    if (st.ballRange && q.count >= 1 && (q.ball < st.ballRange[0] - 5 || q.ball > st.ballRange[1] + 5)) alerts.push(`Panetti da ${Math.round(q.ball)} g: per ${st.label} sono consigliati ${st.ballRange[0]}–${st.ballRange[1]} g.`);
    if (!p.fridge && p.room > 28) alerts.push('Ambiente sopra 28 °C: fermentazione difficile da controllare, valuta il frigo.');
    const strength = flourStrength(p.fridge ? p.hours * 0.8 : p.hours, p.hydration);
    if (p.w && (p.w < strength[0] - 20 || p.w > strength[1] + 40)) alerts.push(`${p.flourLabel ? p.flourLabel + ' (W' + p.w + ')' : 'Farina W' + p.w} fuori dall’intervallo consigliato per questi tempi (W${strength[0]}–${strength[1]}).`);
    if (p.quantityBasis === 'flour' && q.count < 1) alerts.push('Farina insufficiente per un panetto del peso scelto.');

    const yAs = yeast * YEAST_TYPES[p.yeastType].factor;
    return {
      input: p,
      grams: { flour: round(q.flour), water: round(q.water), salt: round(q.salt, 1), oil: round(q.oil, 1), yeast: round(q.yeast, 2) },
      percent: { hydration: p.hydration, salt: p.salt, oil: p.oil, yeastFresh: round(yeast, 3), yeast: round(yAs, 3) },
      dough: { total: round(q.dough), count: q.count, ball: round(q.ball), leftover: round(q.leftover) },
      waterTemp: round(w.use, 1), idealWaterTemp: round(w.ideal, 1),
      iceTip: w.iceTip > 0 ? { grams: round(w.iceTip), doughTemp: round(target, 1), fdtMax: st.fdt[1] } : null,
      doughFromWater: round(w.dough, 1),
      finalDoughTemp: { target, range: st.fdt, used: round(fdt, 1) },
      strength,
      mixMinutes: mix.minutes,
      phases,
      start: p.start ?? 0,
      end: t,
      estimatedBake,
      alerts,
    };
  }

  /** W consigliato: cresce con la durata e, oltre il 70% d'acqua, con l'idratazione. */
  function flourStrength(hours, hydration = 60) {
    const base = hours < 8 ? [220, 260] : hours < 16 ? [250, 290] : hours < 30 ? [270, 320] : hours < 50 ? [300, 350] : [330, 380];
    const extra = Math.max(0, hydration - 70) * 6; // es. 80% → +60
    return base.map(w => Math.round((w + extra) / 10) * 10);
  }

  const api = { PRE_COLD_H, OUT_H, STYLES, MACHINES, BAKE, FLOURS, flourMaxHydration, hydrationLimit, YEAST_TYPES, INGREDIENTS, PHASE_WHY, GROWTH, activity, defaults, calculate, equalSplit, flourStrength };
  root.DoughModel = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
