import React, { useState } from 'react';
import './App.css'; // Puoi personalizzare meglio lo stile qui se vuoi

// STILE inline per il tasto RESET rosso chiaro, in alto a destra
const resetButtonStyle = {
  backgroundColor: '#ffcccc',
  color: '#a40000',
  border: 'none',
  borderRadius: '6px',
  padding: '8px 16px',
  fontWeight: 'bold',
  position: 'absolute',
  right: '24px',
  top: '24px',
  cursor: 'pointer',
  boxShadow: '0 2px 8px #ccc'
};

function CalcolatoreMultiContratto() {
  // Portafoglio di contratti attivi
  const [contratti, setContratti] = useState([]);

  // Stato temporaneo per creare nuovo contratto
  const [nuovoCapitale, setNuovoCapitale] = useState('');
  const [anni, setAnni] = useState('');
  const [rendimento, setRendimento] = useState('');

  // Calcola le rendite totali maturate (sommando tutte le rendite realizzate dai contratti chiusi)
  const totaleRendite = contratti.reduce(
    (acc, c) => acc + (c.capitale * (c.rendimento / 100) * c.anni), 0
  );

  // Calcola il capitale totale investito (dei contratti ancora ATTIVI)
  const capitaleInvestito = contratti.reduce(
    (acc, c) => acc + Number(c.capitale), 0
  );

  // Calcola il totale che può essere usato per nuovi contratti (rendite maturate)
  const massimoPerNuovoContratto = totaleRendite; // o si può adattare secondo altri criteri

  // Calcola il totale che torna al cliente (rendite + capitale restituito)
  const totaleTornaCliente = contratti.reduce((tot, c) => {
    // Rendita maturata per contratto + capitale restituito a fine contratto
    return tot + (c.capitale * (c.rendimento / 100) * c.anni) + Number(c.capitale);
  }, 0);

  // Aggiunge un nuovo contratto al portafoglio
  const aggiungiContratto = e => {
    e.preventDefault();
    if (!nuovoCapitale || !anni || !rendimento) return;
    setContratti([
      ...contratti, 
      {
        capitale: Number(nuovoCapitale),
        anni: Number(anni),
        rendimento: Number(rendimento)
      }
    ]);
    setNuovoCapitale('');
    setAnni('');
    setRendimento('');
  };

  // Gestione RESET (azzera tutto)
  const resetAll = () => {
    setContratti([]);
    setNuovoCapitale('');
    setAnni('');
    setRendimento('');
  };

  return (
    <div style={{ position: 'relative', padding: '32px', maxWidth: '600px', margin: 'auto', background: '#fafbfc', borderRadius: '16px', boxShadow: '0 3px 24px #eee' }}>
      {/* TITOLO */}
      <h1 style={{ textAlign: 'center', marginBottom: 4 }}>Calcolatore Multi Contratto</h1>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '15px', marginTop: 0 }}>
        Simula più contratti con rendite e capitale restituito.
      </p>
      
      {/* PULSANTE RESET in alto a destra */}
      <button style={resetButtonStyle} onClick={resetAll}>
        RESET
      </button>
      
      {/* Portfolio attuale */}
      <div style={{ marginTop: 40, marginBottom: 32, background: '#f2f9f9', padding: 18, borderRadius: 10, border: '1px solid #ddeeff' }}>
        <h3>Contratti Attivi</h3>
        {contratti.length === 0 && (
          <div style={{ color: '#bbb', margin: '12px 0' }}>Nessun contratto attivo</div>
        )}
        {contratti.length > 0 && (
          <table style={{ width: '100%', fontSize: 15, marginTop: 4 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Capitale</th>
                <th>Anni</th>
                <th>Rendimento (%)</th>
                <th>Rendita (€)</th>
                <th>Totale finale (€)</th>
              </tr>
            </thead>
            <tbody>
              {contratti.map((c, i) => (
                <tr key={i}>
                  <td>{c.capitale.toLocaleString('it-IT')} €</td>
                  <td>{c.anni}</td>
                  <td>{c.rendimento}</td>
                  <td>
                    {/* Rendita per questo contratto */}
                    {(c.capitale * (c.rendimento/100) * c.anni).toLocaleString('it-IT', { maximumFractionDigits: 0 })} €
                  </td>
                  <td>
                    {/* Rendita finale + capitale restituito */}
                    {(c.capitale + c.capitale * (c.rendimento/100) * c.anni).toLocaleString('it-IT', { maximumFractionDigits: 0 })} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div> 

      {/* SEZIONE NUOVO CONTRATTO */}
      <form onSubmit={aggiungiContratto} style={{ background: '#eef4ff', padding: 22, borderRadius: 12, boxShadow: '0 2px 8px #f0f6ff' }}>
        <h3>Nuovo contratto</h3>
        <div style={{ marginBottom: 12 }}>
          <label>
            Capitale <span style={{ color: '#666', fontSize: 13 }}>(max: {massimoPerNuovoContratto.toLocaleString('it-IT')} €)</span>
            <input
              type="number"
              value={nuovoCapitale}
              min={0}
              max={massimoPerNuovoContratto || ''}
              onChange={e => setNuovoCapitale(e.target.value)}
              placeholder={massimoPerNuovoContratto ? `${massimoPerNuovoContratto.toLocaleString('it-IT')} € disponibili` : '€'}
              style={{ marginLeft: 12, width: 180 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Anni
            <input
              type="number"
              value={anni}
              min={1}
              onChange={e => setAnni(e.target.value)}
              style={{ marginLeft: 12, width: 80 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Rendimento %
            <input
              type="number"
              value={rendimento}
              min={0}
              step={0.01}
              onChange={e => setRendimento(e.target.value)}
              style={{ marginLeft: 12, width: 80 }}
            />
          </label>
        </div>
        <button type="submit" style={{ padding: '6px 24px', background: '#347cf0', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginTop: 8 }}>
          AGGIUNGI CONTRATTO
        </button>
      </form>

      {/* AREA RIEPILOGATIVA CALCOLI */}
      <div style={{ marginTop: 32, padding: 18, background: '#fcfcf4', borderRadius: 10, border: '1px solid #f5e6d0' }}>
        <h4>Riepilogo</h4>
        <div><strong>Totale ricavi (rendite):</strong> {totaleRendite.toLocaleString('it-IT', { maximumFractionDigits: 2 })} €</div>
        <div style={{ marginTop: 4 }}>
          <strong>Totale che torna al cliente (rendite + capitale a fine contratti):</strong> {totaleTornaCliente.toLocaleString('it-IT', { maximumFractionDigits: 2 })} €
        </div>
      </div>

      {/* DOCUMENTAZIONE DEI CAMPI */}
      <div style={{ marginTop: 34, fontSize: 14, color: '#888' }}>
        <hr style={{ margin: '16px 0' }} />
        <ul>
          <li><b>RESET</b>: Azzera tutto e ripartìsce da zero.</li>
          <li><b>CAPITALE (nuovo contratto)</b>: massimo = rendite maturate, puoi abbassare manualmente.</li>
          <li><b>Totale ricavi</b>: Somma di tutte le rendite generate dai contratti.</li>
          <li><b>Totale che torna al cliente</b>: Ricavi maturati + capitale di ogni contratto, che viene restituito a fine contratto.</li>
          <li><b>Tabella</b>: mostra i dettagli di ogni contratto (capitale, anni, % rendimento, rendita generata, totale finale).</li>
        </ul>
      </div>
    </div>
  );
}

export default CalcolatoreMultiContratto;
