---
name: Impasto pizza
description: Dosi e procedimento dell'impasto per pizza, dipinti come l'insegna e il listino di una pizzeria napoletana.
colors:
  tomato-enamel: "#a8231b"
  oxblood-shade: "#6e140f"
  gold-pinstripe: "#d6a142"
  gold-leaf-soft: "#f3d9a0"
  basil: "#1f5a3a"
  basil-wash: "#e6efe9"
  on-basil-muted: "#d3e4d9"
  warm-ink: "#1e1a16"
  smoke-muted: "#5f5a52"
  rule-line: "#e2ddd5"
  rule-strong: "#9c9488"
  leader-gold: "#c9b48e"
  enamel-white: "#ffffff"
  tile-wash: "#f4f4f2"
  warn-umber: "#7a4d00"
  warn-wash: "#fff1cc"
  late-umber: "#5a3a00"
  phase-mix: "#77796f"
  phase-bulk: "#d4701f"
  phase-ball: "#a8231b"
  phase-precold: "#c99a12"
  phase-cold: "#3f86ad"
  phase-proof: "#5e8c3a"
  phase-bake: "#6e140f"
  ink-dark: "#f1ece4"
  muted-dark: "#b3aca1"
  paper-dark: "#221e1a"
  wash-dark: "#171411"
  line-dark: "#36312b"
  line-strong-dark: "#6f685e"
  leader-dark: "#6d5f45"
  basil-wash-dark: "#1d2a22"
  warn-dark: "#f3c768"
  warn-wash-dark: "#3a2e14"
  tomato-on-dark: "#f08a72"
  basil-on-dark: "#8fc7a3"
  phase-mix-dark: "#9a9c93"
  phase-bulk-dark: "#ec8b45"
  phase-ball-dark: "#e0634f"
  phase-precold-dark: "#e2bb4a"
  phase-cold-dark: "#6fb0d0"
  phase-proof-dark: "#8fbd6c"
typography:
  display:
    fontFamily: "Shrikhand, Georgia, serif"
    fontSize: "3.25rem"
    fontWeight: 400
    lineHeight: 1.2
  headline:
    fontFamily: "Shrikhand, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.2
  plaque:
    fontFamily: "Shrikhand, Georgia, serif"
    fontSize: "1.3rem"
    fontWeight: 400
    lineHeight: 1.2
  title:
    fontFamily: "Barlow, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.12rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Barlow, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  numeral:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', system-ui, sans-serif"
    fontSize: "2.15rem"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "tnum"
  time:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 800
    lineHeight: 1.2
    fontFeature: "tnum"
  label:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 700
    letterSpacing: "0.08em"
rounded:
  chip-time: "8px"
  field: "10px"
  plaque: "12px"
  card: "14px"
  button: "16px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  card: "18px"
  page-bottom: "56px"
components:
  button-painted:
    backgroundColor: "{colors.tomato-enamel}"
    textColor: "{colors.enamel-white}"
    typography: "{typography.plaque}"
    rounded: "{rounded.button}"
    height: "58px"
    width: "100%"
  button-painted-hover:
    backgroundColor: "#b92a20"
  button-sign:
    textColor: "{colors.enamel-white}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  chip:
    backgroundColor: "{colors.enamel-white}"
    textColor: "{colors.warm-ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  chip-selected:
    backgroundColor: "{colors.tomato-enamel}"
    textColor: "{colors.enamel-white}"
  input:
    backgroundColor: "{colors.enamel-white}"
    textColor: "{colors.warm-ink}"
    rounded: "{rounded.field}"
    padding: "10px 12px"
    height: "46px"
  card:
    backgroundColor: "{colors.enamel-white}"
    textColor: "{colors.warm-ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  plaque:
    backgroundColor: "{colors.basil}"
    textColor: "{colors.enamel-white}"
    rounded: "{rounded.plaque}"
    padding: "10px 12px 10px 14px"
  plaque-late:
    backgroundColor: "{colors.late-umber}"
  step-now:
    backgroundColor: "{colors.basil}"
    textColor: "{colors.enamel-white}"
    padding: "12px 14px"
  time-chip:
    textColor: "{colors.warm-ink}"
    typography: "{typography.time}"
    rounded: "{rounded.chip-time}"
    padding: "2px 7px"
  warning-note:
    backgroundColor: "{colors.warn-wash}"
    textColor: "{colors.warn-umber}"
    rounded: "{rounded.field}"
    padding: "10px 12px"
---

# Design System: Impasto pizza

## Overview

**Creative North Star: "L'insegna della pizzeria"**

L'app si legge come la facciata di una pizzeria napoletana: in alto un'insegna di smalto rosso pomodoro con un filo d'oro dipinto a mano, sotto una targa verde basilico che dice quando si inforna, e poi il listino scritto a mano con i grammi allineati a destra dietro una fila di puntini. Il carattere è popolare e artigiano ma la lettura resta da attrezzo da cucina: numeri grandi, tabellari, leggibili da un metro di distanza con le mani nella farina.

La densità è media e verticale, pensata per un telefono appoggiato al piano di lavoro. Il colore pieno è riservato a tre superfici dipinte (insegna, targa, riga della fase in corso) e al bottone principale; tutto il resto sta su smalto bianco e su un fondo grigio piastrella neutro, così il rosso e il verde restano un segnale e non una tinta di fondo. Il tema scuro sposta il fondo su un bruno fumo di forno e schiarisce gli accenti, ma l'insegna e la targa restano gli stessi smalti.

Il mondo rifiuta in modo esplicito la pila di schede bianche su fondo crema con accento terracotta: il fondo non è mai crema e l'accento è un rosso pieno, non un mattone spento.

**Key Characteristics:**
- Insegna rossa con filo oro interno e una fascia d'ombra più scura alla base.
- Scritta dipinta (Shrikhand) solo per titoli, targa e chiusura.
- Numeri e orari in Barlow Condensed tabellare, grandi e pesanti.
- Listino con puntini di guida tra nome e quantità.
- Procedimento come lavagne per giorno; la fase in corso diventa una fascia verde basilico da bordo a bordo, con filo oro sopra e sotto.
- Ogni fase porta un suo colore, usato solo nella targhetta dell'orario.

## Colors

Smalti pieni da insegna (pomodoro, basilico, oro) su un fondo neutro bianco e grigio piastrella, con un sistema parallelo di colori di fase.

### Primary
- **Smalto pomodoro** (tomato-enamel): il fondo dell'insegna, il bottone dipinto, i chip selezionati, il cursore e la traccia piena del range, i titoli di scheda in chiaro, i link "Cosa fare e perché", la chiusura "Buona pizza!". È anche il colore della `theme-color` del manifest e il fondo dell'icona.
- **Ombra sangue di bue** (oxblood-shade): la fascia inferiore dell'insegna (riga piena interna di 9px) e l'ombra dipinta della scritta sull'insegna. Mai usata come superficie a sé.

### Secondary
- **Verde basilico** (basil): la targa fissa con l'ora dell'infornata, la riga della fase in corso, l'interruttore acceso, le etichette di campo e le intestazioni di giorno in chiaro, il colore del fuoco in chiaro.
- **Verde basilico lavato** (basil-wash): il riquadro della divisione in panetti uguali.
- **Verde chiaro su basilico** (on-basil-muted): testo secondario sopra le superfici basilico (spiegazioni e indicazioni nella riga in corso, sottotitolo della targa).

### Tertiary
- **Filo oro** (gold-pinstripe): la filettatura dell'insegna, il bordo della targa e del bottone dipinto, la riga sotto le intestazioni di giorno, il filo sopra e sotto la riga in corso, il badge "ORA", il fuoco sopra superfici colorate e in tema scuro.
- **Foglia d'oro tenue** (gold-leaf-soft): testo secondario sopra il rosso e sopra il basilico (sottotitolo dell'insegna, etichetta della targa, durata e link nella riga in corso), bordo del bottone dell'insegna, selezione del testo.

### Neutral
- **Inchiostro caldo** (warm-ink): testo principale; scuro bruno, mai nero puro.
- **Fumo** (smoke-muted): testo secondario, spiegazioni, durate, segnaposto.
- **Smalto bianco** (enamel-white): superficie di schede, lavagne, campi e chip non selezionati.
- **Grigio piastrella** (tile-wash): fondo pagina. Neutro, senza giallo.
- **Riga** (rule-line) e **Riga forte** (rule-strong): bordi delle schede e divisori tratteggiati; i bordi di campi e chip usano la riga forte.
- **Puntini oro** (leader-gold): i puntini di guida del listino.
- **Avviso** (warn-umber su warn-wash): ogni avviso, nota, errore e campo non valido. **Ritardo** (late-umber): la targa quando l'impasto non sarà pronto in tempo.

### Colori di fase
Ogni fase del procedimento ha un colore che segue la temperatura dell'impasto: impasto grigio (phase-mix), puntata arancio (phase-bulk), staglio pomodoro (phase-ball), prima del frigo ocra (phase-precold), frigo azzurro (phase-cold), fuori frigo e appretto verde foglia (phase-proof), infornata sangue di bue (phase-bake). In tema scuro ogni colore ha la sua variante schiarita (`-dark`). Il colore di fase compare solo nella targhetta dell'orario e nel quadratino della targa: tinto al 40% sullo smalto nelle righe normali, pieno nella riga in corso, solo contorno al 45% nelle fasi passate.

### Named Rules
**La regola del fondo neutro.** Il fondo pagina e le superfici sono bianco smalto e grigio piastrella in chiaro, bruno fumo in scuro. Mai crema, avorio o carta ingiallita: il calore viene dagli smalti, non dal fondo.

**La regola delle tre superfici dipinte.** Il colore pieno copre solo insegna (rosso), targa e riga in corso (basilico) e il bottone dipinto. Una nuova superficie a colore pieno deve essere una di queste, non una quarta.

**La regola del colore di fase.** Il colore di una fase vive nella targhetta dell'orario, non sul testo né sullo sfondo della riga.

## Typography

**Display Font:** Shrikhand (con Georgia, serif)
**Body Font:** Barlow (con system-ui, -apple-system, Segoe UI, sans-serif)
**Label/Mono Font:** Barlow Condensed (con Arial Narrow, system-ui, sans-serif)

**Character:** Shrikhand è la mano del pittore d'insegne, grassa e corsiva; Barlow è il testo di servizio, asciutto; Barlow Condensed è il gessetto del listino, stretto e alto per far stare grammi e orari grandi su un telefono.

### Hierarchy
- **Display** (Shrikhand 400, 3.25rem su desktop, 2rem su tablet e telefono, 1.75rem sotto 480px, interlinea 1.2): il titolo dell'insegna (nome dell'app o nome della pizza), con ombra dipinta sangue di bue.
- **Headline** (Shrikhand 400, 1.5rem, 1.2): titoli di scheda e sezione ("Che pizza", "Quando", "Quantità", "Dosi", "Procedimento"), in pomodoro; "Buona pizza!" in chiusura a 2rem.
- **Plaque** (Shrikhand 400, 1.3rem, 1.1rem sotto 480px): l'ora dell'infornata nella targa e la scritta del bottone dipinto (1.4rem).
- **Title** (Barlow 700, 1.12rem, 1.3): nome della fase; il nome dell'ingrediente è a 1.1rem/1.25.
- **Body** (Barlow 400, 16px, 1.5): testo e spiegazioni; le note secondarie scendono a .9-.93rem in fumo. I controlli usano Barlow 600.
- **Numeral** (Barlow Condensed 800, 2.15rem, 1, cifre tabellari): i grammi del listino; i totali a 1.3rem, il valore del range a 1.9rem, la divisione in panetti a 1.5rem.
- **Time** (Barlow Condensed 800, 1.2rem, cifre tabellari): l'orario di inizio fase; la durata è Barlow Condensed 700 a 1.05rem.
- **Label** (Barlow Condensed 700, .9rem, spaziatura .08em, maiuscolo): etichette di campo e gruppo in basilico; intestazioni di giorno a .95rem/.1em; etichetta della targa a .8rem/.1em; sottotitolo dell'insegna 600 a .95-1.05rem/.07em.

### Named Rules
**La regola della scritta dipinta.** Shrikhand solo per il titolo dell'insegna, i titoli di sezione, l'ora nella targa, il bottone dipinto e la chiusura. Mai su testo corrente, etichette, numeri del listino o orari del procedimento.

**La regola delle cifre tabellari.** Ogni quantità e ogni orario è in Barlow Condensed con cifre tabellari, così le colonne restano allineate quando i valori cambiano.

**La regola delle unità minuscole.** Le unità restano minuscole e staccate dal numero ("270 g", "1 kg", "°C"), anche dentro le etichette in maiuscolo.

## Layout

Una colonna su telefono, con margini laterali di 16px e larghezza massima 1120px centrata. Le schede sono separate da 16px; il fondo pagina chiude con 56px.

- **Impostazioni:** da 900px in su due colonne uguali (Che pizza a sinistra, Quando e Quantità a destra), con bottone e note a tutta larghezza sotto.
- **Risultato:** da 900px in su il listino delle dosi sta in una colonna fissa di 380px a sinistra, appiccicato sotto la targa (top 108px), e il procedimento occupa il resto.
- **Targa:** appiccicata in cima allo scorrimento, su una velatura del fondo al 92% con sfocatura di 8px.
- **Ritmo:** 8px tra chip e azioni, 12px tra campi e tra elementi della targa, 16px tra schede, 18px di padding interno; 18px sopra ogni gruppo etichettato, 20px sopra ogni intestazione di giorno.
- Le righe di campi si dispongono da sole in colonne di almeno 130px.
- L'insegna rispetta la zona sicura in alto (`env(safe-area-inset-top)`).

## Elevation & Depth

Il sistema è piatto: la profondità viene da smalti pieni e fili dipinti, non da ombre. Le poche ombre sono morbide e servono a staccare dal fondo solo le due cose che si toccano o che restano sopra lo scorrimento.

### Shadow Vocabulary
- **Fascia dell'insegna** (`box-shadow: inset 0 -9px 0 #6e140f`): la base più scura dell'insegna, sopra il bordo oro di 5px. È pittura, non elevazione.
- **Ombra dipinta della scritta** (`text-shadow: 2px 2px 0 #6e140f`, 3px su desktop): l'ombreggiatura del pittore d'insegne sotto il titolo Shrikhand dell'insegna. Solo lì.
- **Bottone dipinto** (`box-shadow: 0 10px 22px -12px rgb(110 20 15 / .75)`; hover `0 14px 26px -12px …/.8`; premuto `0 6px 14px -10px …/.8` con 1px di discesa).
- **Targa** (`box-shadow: 0 8px 18px -14px rgb(0 0 0 / .6)`): la stacca dal contenuto che le scorre sotto.
- **Cursore del range** (`box-shadow: 0 2px 4px rgb(0 0 0 / .2)`).

### Named Rules
**La regola della pittura, non della luce.** Schede e lavagne non hanno ombra: bordo di 1px in riga e basta. L'ombra netta e sfalsata esiste solo come ombreggiatura dipinta della scritta sull'insegna, mai su riquadri.

## Shapes

Angoli morbidi da insegna smaltata, mai spigoli vivi e mai pillole sulle superfici grandi. La scala va dal piccolo al grande: targhetta orario 8px, campi e avvisi 10px, targa e riquadri d'avviso 12px, schede e lavagne 14px, bottone dipinto 16px. Pillola (999px) solo per chip, bottone dell'insegna e bottoni d'avviso.

Il filo oro è la firma della forma: una linea interna di 1.5px a 75% di opacità con angoli di 12px (16px su desktop) dentro l'insegna, un bordo pieno di 2px su targa e bottone, una riga di 2px che chiude le intestazioni di giorno e incornicia la riga in corso. I divisori interni di listino e lavagne sono tratteggiati (1px), i puntini di guida sono punteggiati (2px).

L'icona è una piastrella rossa ad angoli molto arrotondati (rx 112 su 512) con filo oro interno, e dentro una pizza napoletana vista dall'alto; in pagina si mostra a 54px (46px sotto 480px, 76px su desktop) con angoli di 14px.

## Components

### Buttons
Dipinti e sicuri: il bottone principale è un pezzo d'insegna.
- **Shape:** angoli di 16px, alto 58px, a tutta larghezza.
- **Bottone dipinto:** smalto pomodoro, bordo oro di 2px, scritta Shrikhand bianca a 1.4rem, ombra calda morbida.
- **Hover / Focus:** si schiarisce di poco e l'ombra cresce; premuto scende di 1px; il fuoco è un anello oro di 3px staccato 3px.
- **Bottone dell'insegna** ("Modifica"): pillola trasparente con bordo foglia d'oro di 1.5px, testo bianco Barlow 600, 44px; hover con un velo bianco al 10%.
- **Bottoni d'avviso:** pillole da 44px dentro gli avvisi, contorno nel colore del testo (oppure pieni in avviso con testo invertito per l'azione principale del ritardo).
- **Fantasma** ("Annulla" della misura): 46px, angoli di 10px, contorno nel colore corrente.

### Chips
- **Style:** pillola alta 44px, padding orizzontale 16px, bordo di 1.5px in riga forte, testo Barlow 600 a .95rem, fondo smalto.
- **State:** al passaggio il bordo diventa pomodoro; selezionato, pieno pomodoro con testo bianco. Il radio è invisibile ma copre tutto il chip, e il fuoco si disegna sul chip.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** smalto bianco (bruno fumo in scuro).
- **Shadow Strategy:** nessuna, vedi Elevation & Depth.
- **Border:** 1px in riga.
- **Internal Padding:** 18px; il listino usa 8px 18px 14px.
- **Scheda richiudibile** ("Altre impostazioni"): intestazione alta 64px con sottotitolo in fumo e freccia pomodoro che ruota di 180° in .25s.

### Inputs / Fields
- **Style:** bordo di 1.5px in riga forte, angoli di 10px, alto 46px, padding 10px 12px, testo Barlow 600 a 1rem; etichetta sopra in Barlow 500 .9rem fumo, a 6px. Le etichette di gruppo sono nel ruolo Label.
- **Focus:** anello di 3px nel colore del fuoco (basilico in chiaro, oro in scuro) e bordo dello stesso colore.
- **Error:** bordo pomodoro e fondo avviso; il messaggio sotto in avviso, Barlow 600.
- **Interruttore:** 48×28px, angoli di 14px, spento in riga forte, acceso in basilico; pallino bianco di 20px che scorre in .2s; disattivato al 55% con l'etichetta in fumo. Riga cliccabile alta 44px.
- **Range:** traccia di 8px in riga con la parte piena in pomodoro, cursore bianco di 26px con anello pomodoro di 3px; valore sopra a destra nel ruolo Numeral (1.9rem), minimo e massimo sotto in Barlow Condensed .82rem fumo.
- **Select:** stesso trattamento dei campi.

### Navigation
Nessuna navigazione: due schermate, e l'unico passaggio è il bottone dipinto in avanti e "Modifica" sull'insegna indietro.

### Insegna
La testata di entrambe le schermate. Fondo pomodoro, filo oro interno, bordo oro di 5px alla base sopra la fascia sangue di bue. A sinistra l'icona (solo nelle impostazioni), poi il titolo dipinto e sotto il sottotitolo in Label foglia d'oro; nel risultato il sottotitolo riassume quantità e impostazioni in minuscolo, e a destra c'è "Modifica".

### Targa
Una tavoletta verde basilico con bordo oro di 2px e angoli di 12px, fissa in cima. A sinistra l'etichetta in Label foglia d'oro ("Si inforna") e l'ora dipinta; a destra la fase in corso in Barlow Condensed 700 con il quadratino del colore di fase (10px, angoli di 3px, alone bianco) e sotto "fino alle…" in verde chiaro. Il bottone per tenere acceso lo schermo è un quadrato di 44px con contorno bianco al 45%, pieno oro quando attivo. In ritardo la targa diventa bruno ritardo e mostra l'orario previsto barrato prima di quello reale.

### Listino delle dosi
Ogni ingrediente è una riga richiudibile alta almeno 64px: nome in Barlow 700 con una riga di dettaglio in fumo, poi una fila di puntini oro (2px) che riempie lo spazio, poi i grammi nel ruolo Numeral con l'unità minuscola. Le righe sono separate da un tratteggio di 1px. Aprendo una riga compare il perché, con il ruolo in grassetto. I totali chiudono lo stesso listino con la stessa struttura, numeri a 1.3rem.

### Lavagne del procedimento
Una lavagna per giorno, preceduta dall'intestazione del giorno in Label basilico chiusa da un filo oro di 2px che arriva al margine. Ogni lavagna è una scheda bianca con angoli di 14px e padding orizzontale di 14px; ogni riga è una griglia: targhetta dell'orario (colonna di 62px), nome della fase, puntini di guida, durata a destra; sotto, l'indicazione in fumo e "Cosa fare e perché" in pomodoro.
- **Targhetta dell'orario:** Time su colore di fase al 40% sullo smalto, angoli di 8px.
- **Fase in corso:** la riga esce fino ai bordi della lavagna, diventa basilico pieno con filo oro di 2px sopra e sotto, testo bianco, testo secondario in verde chiaro, durata e link in foglia d'oro, badge "ORA" oro; la targhetta prende il colore di fase pieno, con l'inchiostro che garantisce almeno 3:1 (inchiostro scuro per puntata e prima del frigo).
- **Fasi passate:** nome e durata in fumo, targhetta solo contorno, "· fatto" in basilico dopo il nome.
- **Tempi ricalcolati:** la durata vecchia barrata e un lampo oro di 1.6s sulla nuova.
- L'infornata aggiunge "Accendi il forno alle…" in basilico.

### Avvisi
Un'unica famiglia: fondo avviso, testo avviso, angoli di 10px (12px per i riquadri con azioni), padding 10px 12px. Vale per note, errori, avvisi del risultato, il consiglio del ghiaccio e la divisione impossibile. I suggerimenti positivi sono in fumo con un segno di spunta basilico disegnato in SVG.

## Do's and Don'ts

### Do:
- **Do** tenere il fondo pagina su grigio piastrella (#f4f4f2) e le superfici su smalto bianco; in scuro su bruno fumo (#171411 / #221e1a).
- **Do** usare Shrikhand solo per insegna, titoli di sezione, ora della targa, bottone dipinto e chiusura.
- **Do** scrivere ogni quantità e orario in Barlow Condensed con cifre tabellari, e le unità in minuscolo ("g", "kg", "°C", "h").
- **Do** legare nome e valore di una riga di listino o di procedimento con i puntini di guida oro.
- **Do** dare a ogni bersaglio toccabile almeno 44px di altezza (46px per i campi, 58px per il bottone dipinto, 64px per le righe del listino).
- **Do** garantire un contrasto di almeno 4.5:1 per il testo, e 3:1 solo per il testo grande (dalla targhetta dell'orario in su), in entrambi i temi.
- **Do** usare il filo oro come cornice delle superfici dipinte e come anello di fuoco sopra il rosso e il basilico.
- **Do** mettere ogni avviso nella famiglia avviso (warn-umber su warn-wash), non in rosso.

### Don't:
- **Don't** usare fondi crema, avorio o carta ingiallita, né un accento terracotta spento al posto del pomodoro.
- **Don't** usare Shrikhand per testo corrente, etichette, numeri del listino o orari.
- **Don't** scrivere le unità in maiuscolo o attaccate al numero.
- **Don't** aggiungere una quarta superficie a colore pieno oltre a insegna, targa con riga in corso e bottone dipinto.
- **Don't** dare ombra a schede e lavagne, né ombre nette sfalsate a riquadri: l'unica ombra netta è quella dipinta sotto la scritta dell'insegna.
- **Don't** usare il colore di fase su testo o sfondi di riga: vive solo nella targhetta dell'orario e nel quadratino della targa.
- **Don't** usare caratteri o emoji come icone: le icone sono SVG a tratto.
