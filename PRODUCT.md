# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Chi fa la pizza in casa con attrezzatura domestica. L'utente principale è l'autore, che la condivide con alcuni amici e parenti; non è un prodotto pubblico.

L'autore usa una planetaria (non una spirale) e mette sempre l'acqua presa dal frigo (circa 4 °C): sono i default.

Il lavoro da fare: decidere cosa impastare e quando infornare, pesare le dosi giuste e seguire i passaggi nell'ordine e nei tempi giusti.

## Product Purpose

Calcolatore d'impasto per pizza: dai dati di partenza (stile, impastatrice, farina, idratazione, quantità, temperature, orari) produce le dosi in grammi e il procedimento con orari, durate e cosa fare in ogni fase.

Funziona se la pizza esce all'orario scelto con l'impasto al punto giusto, e se chi lo usa capisce cosa sta facendo e perché.

## Positioning

Alternativa indipendente a DoughMetry e al Calcolapizza della Confraternita della Pizza, con quattro differenze:

- **Tutto gratis**: nessuna funzione bloccata (senza frigo, tutti gli stili, tutte le farine).
- **Si adatta alla realtà**: lievito e tempi si calcolano sull'attrezzatura e sulle condizioni vere (planetaria con start & stop, acqua di frigo, temperatura dell'impasto misurata a fine lavorazione), non su un impasto ideale.
- **Spiega il perché**: ogni ingrediente e ogni fase hanno una spiegazione tecnica, non solo un numero.
- **Semplice e chiaro**: pochi passaggi e un risultato leggibile subito.

## Operating Context

Si usa in tre momenti:

- **Il giorno prima, al PC**: si pianifica con calma (stile, quantità, orari).
- **In cucina, dal telefono**: mani sporche, schermo piccolo; servono le dosi e il prossimo passo a colpo d'occhio.
- **Su un tablet appoggiato al piano di lavoro**: consultato per tutta la lavorazione.

Il flusso ha due schermate: una per le impostazioni e una con il riassunto delle scelte, le dosi e il procedimento (la fase in corso in evidenza, in base all'ora). A fine impasto si può inserire la temperatura misurata dell'impasto: il lievito già pesato resta, i tempi si ricalcolano.

## Capabilities and Constraints

- **Stack**: pagina statica (`index.html` + `model.js`), senza build né backend, pubblicata su GitHub Pages. Quando cambia `model.js` si aggiorna il parametro `?v=` dello script.
- **Lingua**: italiano.
- **Stili**: Napoletana classica, Napoletana contemporanea, Tonda romana, Pizza classica (la tonda da pizzeria del resto d'Italia, non "di casa"), Teglia romana. Ogni stile ha range propri di peso panetto e idratazione.
- **Impastatrici**: spirale, planetaria, a mano. La planetaria limita l'idratazione al 72%, tranne nella teglia, dove la struttura nasce da bassinage e pieghe.
- **Farine**: elenco preimpostato e scalabile (oggi Caputo Nuvola, Pizzeria, Saccorosso) più l'inserimento manuale del W e dell'assorbimento facoltativo. Idratazione massima stimata dal W: `33 + 0,1375 × W`.
- **Idratazione**: il massimo è il più basso tra il limite dello stile, quello dell'impastatrice e quello della farina, e l'interfaccia dice quale dei tre sta limitando.
- **Quantità**: per numero di panetti, oppure per kg di farina con divisione automatica in parti uguali dentro il range dello stile (il calcolo conta anche acqua, sale e olio).
- **Modello**: simulazione termica minuto per minuto e attività del lievito tarata sul Calcolapizza. Col frigo i tempi sono fissi (2 h prima del frigo, 4 h fuori frigo) ed è il lievito ad adattarsi.
- **Frigo e ore**: sotto il minimo di ore dello stile il frigo non è permesso: si disattiva da solo, con il motivo, e torna quando le ore bastano.
- **Persistenza**: le impostazioni restano nel browser di chi usa la pagina (localStorage); non ci sono account né dati sul server.
- **Impasto in corso**: col tasto «Salva» accanto a «Modifica» si salva l'impasto (orari esatti e temperatura misurata), uno solo alla volta e solo su questo dispositivo; da salvato si aggiorna da solo, e toccando «Salvato» si toglie. Riaprendo l'app si va dritti al procedimento; da «Modifica» si torna con «Riprendi». Scade 3 ore dopo l'infornata; salvarne un altro chiede conferma.
- **Avvisi**: per l'impasto salvato, il tasto «Avvisami» accanto a «Procedimento» manda una notifica all'inizio di ogni passaggio, compresa «Accendi il forno», che nel procedimento è un passaggio a sé 45 minuti prima dell'infornata (titolo e indicazione presi dal procedimento). Senza server arrivano solo finché la pagina resta aperta, e l'interfaccia lo dice; `sw.js` è un service worker minimo, senza cache, che serve solo a mostrare le notifiche.
- **Escluso**: niente scelta del contenitore dei panetti né del forno. Non cambiavano dosi né tempi in modo rilevante; la cottura è descritta per stile.
- **Non si fa**: DoughMetry è solo un riferimento di confronto, mai da aggirare o copiare (né il paywall né i testi).

## Brand Commitments

Nome: "Pizza Pronta" (scelto dall'utente il 2026-11-13; prima "Impasto pizza"). Identità visiva: l'insegna dipinta di una pizzeria napoletana (rosso pomodoro, filo oro, verde basilico, scritta dipinta), scelta dall'utente il 2026-11-13; il dettaglio è in DESIGN.md.

Icona: una pizza napoletana vista dall'alto dentro una piastrella rossa con filo oro (`icon.svg`, più i PNG per la schermata Home).

Il tono è diretto, tecnico e pratico, in italiano: istruzioni operative ("Ferma, copri la ciotola…") e spiegazioni del perché. La sezione delle fasi si chiama "Procedimento".

## Evidence on Hand

- Confronti con il Calcolapizza (napoletana classica, 6 × 270 g, 60%): scarto medio di circa il 10% sul lievito, e differenze più ampie solo sulle lievitazioni brevi a temperatura ambiente.
- Riferimenti DoughMetry per i limiti di idratazione delle impastatrici e per la durata dell'impastamento con planetaria (65 minuti con start & stop).
- Nessuna testimonianza, nessun utente esterno e nessuna metrica d'uso: non vanno inventati.

## Product Principles

1. **I numeri seguono la realtà della cucina**: attrezzatura, acqua e temperature vere cambiano lievito e tempi, invece di generare un avviso.
2. **Prima la decisione, poi l'esecuzione**: si imposta tutto in un posto e si esegue da un altro, con riassunto, dosi e procedimento.
3. **Ogni numero ha un perché a portata di mano**, ma non deve ingombrare chi vuole solo pesare.
4. **Leggibile in cucina**: dosi e prossimo passo si leggono al volo su un telefono, con le mani occupate.
5. **Niente di superfluo**: un'opzione che non cambia il risultato non va chiesta.
