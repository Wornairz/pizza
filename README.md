# Pizza Pronta

Calcolatore dell’impasto per pizza.

Calcola dosi e procedimento per l'impasto della pizza: stile, impastatrice, farina,
idratazione, temperatura dell'acqua, maturazione in frigorifero e orario di infornata.

Pagina statica, senza build: `index.html` (interfaccia) e `model.js` (modello di calcolo).
Le impostazioni restano salvate nel browser di chi la usa.

## Uso in locale

```bash
python3 -m http.server 8123
```

poi apri <http://localhost:8123>.

## Modello

- Il lievito è dimensionato con una simulazione minuto per minuto della temperatura
  dell'impasto (acqua, farina, impastatrice, ambiente, frigo) e dell'attività del lievito,
  tarata sul Calcolapizza della Confraternita della Pizza.
- Con il frigo i tempi prima e fuori frigo sono fissi (2 h e 4 h): più ore di frigo, meno lievito.
- L'idratazione massima è la più bassa tra quella dello stile, dell'impastatrice e della farina
  (stimata dal W: `33 + 0,1375 × W`).

Quando modifichi `model.js`, aggiorna il parametro `?v=` dello script in `index.html`,
così il browser non usa una copia vecchia.
