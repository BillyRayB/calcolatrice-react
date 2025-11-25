import React, { useState } from 'react';

const DURATIONS = [
  { years: 3, rate: 0.09 },
  { years: 5, rate: 0.12 },
  { years: 8, rate: 0.13 },
  { years: 10, rate: 0.14 },
  { years: 12, rate: 0.15 },
  { years: 15, rate: 0.16 }
];

const MIN_CAPITAL = 5000;

const colors = {
  navy: '#1a365d',
  gold: '#d4af37',
  white: '#ffffff',
  lightGray: '#f7fafc',
  darkGray: '#4a5568',
  success: '#38a169',
  danger: '#e53e3e'
};

export default function ProfessionalGoldCalculator() {
  const [contracts, setContracts] = useState([]);
  const [formData, setFormData] = useState({ capital: '', duration: '' });
  const [errors, setErrors] = useState({});
  const [simulationYear, setSimulationYear] = useState(1);

  const isFirstContract = contracts.length === 0;
  const portfolioCapital = contracts.reduce((sum, c) => sum + c.capital, 0);
  const portfolioRendites = contracts.reduce((sum, c) => sum + c.ricaviTotali, 0);
  const canCreateSubsequentContract = portfolioRendites >= MIN_CAPITAL;
  const ricaviTotali = contracts.reduce((sum, c) => sum + c.ricaviTotali, 0);

  // Calcolo totale che torna al cliente (ricavi + capitale restituito dai contratti completati)
  const totaleCheTornaAlCliente = contracts.reduce((sum, c) => {
    const capitaleRestituito = c.stato === 'Completato' ? c.capital : 0;
    return sum + c.ricaviTotali + capitaleRestituito;
  }, 0);

  const validateForm = () => {
    const newErrors = {};
    const capital = parseFloat(formData.capital);

    if (!formData.capital || capital < MIN_CAPITAL) {
      newErrors.capital = `Il capitale minimo è ${MIN_CAPITAL.toLocaleString()}€`;
    }

    if (!isFirstContract && capital > portfolioRendites) {
      newErrors.capital = `Capitale insufficiente. Massimo: ${portfolioRendites.toLocaleString()}€`;
    }

    if (!formData.duration) {
      newErrors.duration = 'Seleziona la durata del contratto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createContract = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const capital = parseFloat(formData.capital);
    const duration = parseInt(formData.duration);
    const rate = DURATIONS.find(d => d.years === duration).rate;
    const ricaviAnnuali = capital * rate;

    const newContract = {
      id: Date.now(),
      capital,
      duration,
      rate: rate * 100,
      ricaviAnnuali,
      ricaviTotali: 0,
      anniTrascorsi: 0,
      annoInizio: simulationYear,
      stato: 'Attivo'
    };

    setContracts([...contracts, newContract]);
    setFormData({ capital: '', duration: '' });
    setErrors({});
  };

  const simulateYear = () => {
    setSimulationYear(prev => prev + 1);
    
    setContracts(prev => prev.map(contract => {
      if (contract.stato === 'Completato') return contract;

      const newAnniTrascorsi = contract.anniTrascorsi + 1;
      const newRicaviTotali = contract.ricaviTotali + contract.ricaviAnnuali;
      const isCompleted = newAnniTrascorsi >= contract.duration;

      return {
        ...contract,
        anniTrascorsi: newAnniTrascorsi,
        ricaviTotali: newRicaviTotali,
        stato: isCompleted ? 'Completato' : 'Attivo'
      };
    }));
  };

  const resetAll = () => {
    setContracts([]);
    setFormData({ capital: '', duration: '' });
    setErrors({});
    setSimulationYear(1);
  };

  const formatCurrency = (amount) => `${amount.toLocaleString()}€`;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.navy,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* PULSANTE RESET - rosso chiaro, in alto a destra */}
      <button 
        onClick={resetAll}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#ffcccc',
          color: '#cc0000',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 20px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}
      >
        🔄 RESET
      </button>

      {/* Header - MODIFICATO: nuovo titolo */}
      <div style={{
        backgroundColor: colors.navy,
        padding: '40px 20px',
        textAlign: 'center',
        borderBottom: `4px solid ${colors.gold}`
      }}>
        <h1 style={{
          color: colors.white,
          fontSize: '2.5rem',
          fontWeight: '700',
          margin: '0 0 12px 0',
          letterSpacing: '-0.5px'
        }}>
          Calcolatore Multi Contratto
        </h1>
        <p style={{
          color: colors.gold,
          fontSize: '1.1rem',
          margin: '0',
          fontWeight: '500'
        }}>
          Simulazione professionale di investimenti in oro • Anno {simulationYear}
        </p>
      </div>

      {/* Dashboard principale */}
      <div style={{ padding: '40px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: colors.white,
            padding: '25px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: colors.darkGray, margin: '0 0 10px 0', fontSize: '0.9rem' }}>
              CONTRATTI ATTIVI
            </h3>
            <p style={{ color: colors.navy, fontSize: '2rem', fontWeight: '700', margin: '0' }}>
              {contracts.filter(c => c.stato === 'Attivo').length}
            </p>
          </div>

          <div style={{
            backgroundColor: colors.white,
            padding: '25px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: colors.darkGray, margin: '0 0 10px 0', fontSize: '0.9rem' }}>
              CAPITALE INVESTITO
            </h3>
            <p style={{ color: colors.navy, fontSize: '2rem', fontWeight: '700', margin: '0' }}>
              {formatCurrency(portfolioCapital)}
            </p>
          </div>

          <div style={{
            backgroundColor: colors.white,
            padding: '25px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: colors.darkGray, margin: '0 0 10px 0', fontSize: '0.9rem' }}>
              TOTALE RICAVI
            </h3>
            <p style={{ color: colors.success, fontSize: '2rem', fontWeight: '700', margin: '0' }}>
              {formatCurrency(ricaviTotali)}
            </p>
          </div>

          {/* NUOVO: Totale che torna al cliente */}
          <div style={{
            backgroundColor: colors.white,
            padding: '25px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: colors.darkGray, margin: '0 0 10px 0', fontSize: '0.9rem' }}>
              TOTALE CLIENTE
            </h3>
            <p style={{ color: colors.gold, fontSize: '2rem', fontWeight: '700', margin: '0' }}>
              {formatCurrency(totaleCheTornaAlCliente)}
            </p>
            <small style={{ color: colors.darkGray, fontSize: '0.8rem' }}>
              (ricavi + capitale restituito)
            </small>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '400px 1fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Form creazione contratto */}
          <div style={{
            backgroundColor: colors.white,
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: '20px'
          }}>
            <h2 style={{
              color: colors.navy,
              fontSize: '1.4rem',
              fontWeight: '700',
              margin: '0 0 30px 0',
              textAlign: 'center'
            }}>
              {isFirstContract ? 'PRIMO CONTRATTO' : 'NUOVO CONTRATTO'}
            </h2>

            <form onSubmit={createContract}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: colors.navy,
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  CAPITALE (€)
                  {!isFirstContract && (
                    <span style={{ 
                      color: colors.darkGray, 
                      fontSize: '0.8rem', 
                      fontWeight: '400',
                      marginLeft: '10px'
                    }}>
                      (Max: {formatCurrency(portfolioRendites)})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  min={MIN_CAPITAL}
                  step="1000"
                  placeholder={
                    isFirstContract 
                      ? `Min. ${MIN_CAPITAL.toLocaleString()}€` 
                      : `${portfolioRendites.toLocaleString()}€ disponibili`
                  }
                  value={formData.capital}
                  onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
                  disabled={!isFirstContract && !canCreateSubsequentContract}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${errors.capital ? colors.danger : colors.lightGray}`,
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    backgroundColor: colors.lightGray,
                    color: colors.navy,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.capital && (
                  <p style={{
                    color: colors.danger,
                    fontSize: '0.8rem',
                    margin: '5px 0 0 0',
                    fontWeight: '500'
                  }}>
                    {errors.capital}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '15px',
                  color: colors.navy,
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  DURATA CONTRATTO
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {DURATIONS.map((option) => (
                    <label key={option.years} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      border: `2px solid ${formData.duration == option.years ? colors.gold : colors.lightGray}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: formData.duration == option.years ? '#fff9e6' : colors.white
                    }}>
                      <input
                        type="radio"
                        name="duration"
                        value={option.years}
                        checked={formData.duration == option.years}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        style={{ marginRight: '10px' }}
                      />
                      <div>
                        <strong>{option.years} {option.years === 1 ? 'Anno' : 'Anni'}</strong>
                        <span style={{ color: colors.gold, marginLeft: '8px' }}>
                          {(option.rate * 100).toFixed(0)}% annuo
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.duration && (
                  <p style={{
                    color: colors.danger,
                    fontSize: '0.8rem',
                    margin: '5px 0 0 0',
                    fontWeight: '500'
                  }}>
                    {errors.duration}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFirstContract && !canCreateSubsequentContract}
                style={{
                  width: '100%',
                  backgroundColor: (!isFirstContract && !canCreateSubsequentContract) 
                    ? colors.darkGray : colors.gold,
                  color: colors.navy,
                  border: 'none',
                  padding: '15px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: (!isFirstContract && !canCreateSubsequentContract) 
                    ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s'
                }}
              >
                {isFirstContract ? 'CREA PRIMO CONTRATTO' : 'AGGIUNGI CONTRATTO'}
              </button>
            </form>

            {!isFirstContract && !canCreateSubsequentContract && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#856404',
                textAlign: 'center'
              }}>
                💡 <strong>Simula qualche anno</strong> per accumulare rendite e creare nuovi contratti
              </div>
            )}
          </div>

          {/* Portafoglio contratti */}
          <div style={{
            backgroundColor: colors.white,
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <h2 style={{
                color: colors.navy,
                fontSize: '1.4rem',
                fontWeight: '700',
                margin: '0'
              }}>
                PORTAFOGLIO CONTRATTI
              </h2>
              <button
                onClick={simulateYear}
                disabled={contracts.length === 0}
                style={{
                  backgroundColor: contracts.length === 0 ? colors.darkGray : colors.success,
                  color: colors.white,
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: contracts.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                ⏭ SIMULA ANNO SUCCESSIVO
              </button>
            </div>

            {contracts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: colors.darkGray,
                padding: '60px 20px',
                fontSize: '1.1rem'
              }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '3rem' }}>📊</p>
                <p style={{ margin: '0' }}>Nessun contratto attivo</p>
                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', opacity: 0.7 }}>
                  Crea il tuo primo contratto per iniziare
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: colors.lightGray }}>
                      <th style={{ padding: '15px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '700' }}>
                        CAPITALE
                      </th>
                      <th style={{ padding: '15px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '700' }}>
                        DURATA
                      </th>
                      <th style={{ padding: '15px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '700' }}>
                        ANNI TRASCORSI
                      </th>
                      <th style={{ padding: '15px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '700' }}>
                        TASSO
                      </th>
                      <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '700' }}>
                        RICAVI TOTALI
                      </th>
                      <th style={{ padding: '15px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '700' }}>
                        PROGRESSO
                      </th>
                      <th style={{ padding: '15px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '700' }}>
                        STATO
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract) => {
                      const progressPercentage = (contract.anniTrascorsi / contract.duration) * 100;
                      return (
                        <tr key={contract.id} style={{ 
                          borderBottom: '1px solid #e2e8f0',
                          backgroundColor: contract.stato === 'Completato' ? '#f0fff4' : 'transparent'
                        }}>
                          <td style={{ padding: '20px', fontWeight: '700', color: colors.navy }}>
                            {formatCurrency(contract.capital)}
                          </td>
                          <td style={{ padding: '20px', textAlign: 'center' }}>
                            {contract.duration} {contract.duration === 1 ? 'anno' : 'anni'}
                          </td>
                          <td style={{ padding: '20px', textAlign: 'center', fontWeight: '600' }}>
                            {contract.anniTrascorsi} / {contract.duration}
                          </td>
                          <td style={{ padding: '20px', textAlign: 'center', color: colors.gold, fontWeight: '600' }}>
                            {contract.rate.toFixed(0)}%
                          </td>
                          <td style={{ padding: '20px', textAlign: 'right', color: colors.success, fontWeight: '700', fontSize: '1.1rem' }}>
                            {formatCurrency(contract.ricaviTotali)}
                          </td>
                          <td style={{ padding: '20px', textAlign: 'center' }}>
                            <div style={{
                              width: '100px',
                              height: '8px',
                              backgroundColor: '#e2e8f0',
                              borderRadius: '4px',
                              margin: '0 auto',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${progressPercentage}%`,
                                height: '100%',
                                backgroundColor: contract.stato === 'Completato' ? colors.success : colors.gold,
                                transition: 'width 0.5s ease'
                              }} />
                            </div>
                            <div style={{ 
                              fontSize: '0.8rem', 
                              marginTop: '4px', 
                              color: colors.darkGray,
                              fontWeight: '600'
                            }}>
                              {Math.round(progressPercentage)}%
                            </div>
                          </td>
                          <td style={{ padding: '20px', textAlign: 'center' }}>
                            <span style={{
                              padding: '6px 16px',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              backgroundColor: contract.stato === 'Attivo' ? '#e6fffa' : '#f0fff4',
                              color: contract.stato === 'Attivo' ? '#38a169' : '#2d3748'
                            }}>
                              {contract.stato}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
