---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface: calcolatore (index.html)

Scope: tutta l'app, due schermate (Impostazioni, Risultato). Mode: Operate. Mobile prima (telefono in cucina), poi desktop e tablet.
Job: impostare l'impasto la sera prima, poi pesare e seguire il procedimento in cucina con le mani sporche.

## Direction contract

THESIS: Il calcolatore come la vetrina di una pizzeria napoletana: l'ora dell'infornata dipinta come l'orario d'apertura, le dosi scritte come il listino del giorno, il procedimento come la lavagna. Rifiuta la pila di schede bianche su crema con accento terracotta.

OWN-WORLD: Smalto rosso pomodoro (#a8231b) per l'insegna, filo oro (#d6a142), verde basilico (#1f5a3a) per la targa e la fase in corso, fondo bianco smalto, inchiostro scuro caldo. Scritta dipinta (Shrikhand) solo su titoli, targa e chiusura; Barlow per il testo, Barlow Condensed per numeri e orari. Puntini di guida da listino. Mai crema.

STORY: Chi arriva capisce che pizza, quando si inforna e quanto pesare; in cucina vede subito cosa fare adesso e perché, e alla fine trova il forno da accendere.

FIRST VIEWPORT: Mobile 390: insegna rossa con il nome della pizza dipinto, quantità e impostazioni in una riga, Modifica a destra; targa verde fissa "Si inforna sab 14 nov · 20:00" con la fase in corso; poi il listino delle dosi con grammi a 34px. Impostazioni: insegna "Pizza Pronta" con l'icona, poi schede Che pizza / Quando / Quantità, bottone rosso dipinto in fondo.

FORM: Insegna di pizzeria, candidato 3 su 7 della lista radicata (sacco di farina, maioliche del forno, insegna dipinta, cartone della pizza, orario ferroviario, blocchetto comande, tovaglia a quadri). seed:9ebf6535566fee6e. Mossa firma: dosi e procedimento come listino dipinto, con la fase in corso che diventa la lavagna verde con filo oro. Rilanci: colore pieno per fase (manuale con divisori), passo in corso in cima (feed verticale), ogni avviso col suo numero (monocromo), numeri su griglia tabellare (Crouwel).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Altre decisioni
- "Tabella di marcia" si chiama "Procedimento".
- Frigo con meno ore del minimo dello stile: non permesso, si disattiva da solo con il motivo.
- Icona: pizza rotonda dipinta nei colori dell'insegna (SVG + PNG per telefono).
