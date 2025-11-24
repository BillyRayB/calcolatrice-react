import React, { useState } from 'react';

const DURATION_RATES = {
  3: 9,
  5: 12,
  8: 13,
  10: 14,
  12: 15,
  15: 16,
};

const MIN_CAPITAL = 5000;

export default function ProfessionalGoldCalculator() {
  const [contracts, setContracts] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [formData, setFormData] = useState({ capital: '', duration: '' });
  const [errors, setErrors] = useState({});
  const [simulationYear, setSimulationYear] = useState(0);
  const [portfolioRendites, setPortfolioRendites] = useState(0);

  // Colori professionali: Navy Blue + Gold + White
  const colors = {
    navy: '#1e3a8a',
    gold: '#d4af37',
    white: '#ffffff',
    lightGray: '#f8fafc',
    darkGray: '#64748b',
    success: '#059669',
    danger: '#dc2626'
  };

  const calculateAnnualReturn = (capital, rate) => {
    return Math.round((capital * rate) / 100);
  };

  const validateForm = () => {
    const newErrors = {};
    const capitalNum = parseInt(formData.capital, 10) || 0;
    const isFirstContract = contracts.length === 0;

    if (!formData.capital || isNaN(capitalNum) || capitalNum < MIN_CAPITAL) {
      newErrors.capital = `Il capitale minimo è ${MIN_CAPITAL.toLocaleString()}€`;
    } else if (!isFirstContract && capitalNum > portfolioRendites) {
      newErrors.capital = `Fondi insufficienti. Disponibili: ${portfolioRendites.toLocaleString()}€`;
    }

    if (!formData.duration) {
      newErrors.duration = 'Seleziona una durata';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createContract = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const capital = parseInt(formData.capital, 10);
    const duration = parseInt(formData.duration, 10);
    const ricavo = DURATION_RATES[duration];
    const isFirstContract = contracts.length === 0;

    if (!isFirstContract) {
      setPortfolioRendites((prev) => prev - capital);
    }

    const newContract = {
      id: nextId,
      capital,
      duration,
      ricavo,
      anniTrascorsi: 0,
      renditaAnnuale: calculateAnnualReturn(capital, ricavo),
      ricaviTotali: 0,
      stato: 'Attivo',
    };

    setContracts((prev) => [...prev, newContract]);
    setNextId((prev) => prev + 1);
    setFormData({ capital: '', duration: '' });
    setErrors({});
  };

  const simulateNextYear = () => {
    let accumulatedRenditesThisYear = 0;

    const updatedContracts = contracts.map((contract) => {
      if (contract.stato === 'Completato') {
        return contract;
      }

      const newAnniTrascorsi = contract.anniTrascorsi + 1;
      const newStatus = newAnniTrascorsi >= contract.duration ? 'Completato' : 'Attivo';

      accumulatedRenditesThisYear += contract.renditaAnnuale;

      return {
        ...contract,
        anniTrascorsi: newAnniTrascorsi,
        ricaviTotali: contract.ricaviTotali + contract.renditaAnnuale,
        stato: newStatus,
      };
    });

    setContracts(updatedContracts);
    setPortfolioRendites((prev) => prev + accumulatedRenditesThisYear);
    setSimulationYear((prev) => prev + 1);
  };

  const resetAll = () => {
    setContracts([]);
    setNextId(1);
    setFormData({ capital: '', duration: '' });
    setErrors({});
    setSimulationYear(0);
    setPortfolioRendites(0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const isFirstContract = contracts.length === 0;
  const canCreateSubsequentContract = !isFirstContract && portfolioRendites >= MIN_CAPITAL;
  
  // CAPITALE INIZIALE = Solo il primo deposito (primo contratto)
  const capitaleIniziale = contracts.length > 0 ? contracts[0].capital : 0;
  
  // RICAVI TOTALI = Tutti i ricavi accumulati
  const ricaviTotali = contracts.reduce((sum, c) => sum + c.ricaviTotali, 0);
  
  const activeContracts = contracts.filter(c => c.stato === 'Attivo').length;
  const completedContracts = contracts.filter(c => c.stato === 'Completato').length;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.navy,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header */}
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
          GOLD INVESTMENT CALCULATOR
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

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Dashboard principale */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>
          {/* Capitale Iniziale - Solo primo deposito */}
          <div style={{
            backgroundColor: colors.white,
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            border: `2px solid ${colors.lightGray}`,
            textAlign: 'center'
          }}>
            <h3 style={{
              color: colors.darkGray,
              fontSize: '0.9rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 16px 0'
            }}>
              CAPITALE INIZIALE
            </h3>
            <div style={{
              fontSize: '2.2rem',
              fontWeight: '700',
              color: colors.navy,
              margin: '0'
            }}>
              {formatCurrency(capitaleIniziale)}
            </div>
            <p style={{
              color: colors.darkGray,
              fontSize: '0.85rem',
              margin: '8px 0 0 0',
              fontWeight: '500'
            }}>
              Il tuo primo investimento
            </p>
          </div>

          {/* RICAVI TOTALI - Focus principale */}
          <div style={{
            backgroundColor: colors.gold,
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 12px 35px rgba(212,175,55,0.3)',
            textAlign: 'center',
            transform: 'scale(1.02)',
            border: `3px solid ${colors.gold}`
          }}>
            <h3 style={{
              color: colors.white,
              fontSize: '0.9rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 16px 0'
            }}>
              💰 RICAVI TOTALI
            </h3>
            <div style={{
              fontSize: '2.8rem',
              fontWeight: '800',
              color: colors.white,
              margin: '0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}>
              {formatCurrency(ricaviTotali)}
            </div>
            <p style={{
              color: colors.white,
              fontSize: '0.9rem',
              margin: '8px 0 0 0',
              fontWeight: '600',
              opacity: 0.9
            }}>
              Il tuo guadagno totale
            </p>
          </div>

          {/* Contratti Attivi */}
          <div style={{
            backgroundColor: colors.white,
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            border: `2px solid ${colors.lightGray}`,
            textAlign: 'center'
          }}>
            <h3 style={{
              color: colors.darkGray,
              fontSize: '0.9rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 16px 0'
            }}>
              CONTRATTI IN ESSERE
            </h3>
            <div style={{
              fontSize: '2.2rem',
              fontWeight: '700',
              color: colors.success,
              margin: '0 0 12px 0'
            }}>
              {contracts.length}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              <span style={{ color: colors.success }}>
                {activeContracts} Attivi
              </span>
              <span style={{ color: colors.gold }}>
                {completedContracts} Completati
              </span>
            </div>
          </div>
        </div>

        {/* Controlli simulazione */}
        <div style={{
          backgroundColor: colors.white,
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={simulateNextYear}
              disabled={contracts.length === 0}
              style={{
                backgroundColor: contracts.length > 0 ? colors.gold : colors.darkGray,
                color: colors.white,
                border: 'none',
                borderRadius: '8px',
                padding: '15px 30px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: contracts.length > 0 ? 'pointer' : 'not-allowed',
                opacity: contracts.length > 0 ? 1 : 0.6,
                transition: 'all 0.2s ease'
              }}
            >
              ▶ Simula Anno Successivo
            </button>
            
            <button
              onClick={resetAll}
              style={{
                backgroundColor: colors.danger,
                color: colors.white,
                border: 'none',
                borderRadius: '8px',
                padding: '15px 30px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🔄 Reset Totale
            </button>
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
                </label>
                <input
                  type="number"
                  min={MIN_CAPITAL}
                  step="1000"
                  placeholder={`Min. ${MIN_CAPITAL.toLocaleString()}€`}
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

              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '12px',
                  color: colors.navy,
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  DURATA E RENDIMENTO
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px'
                }}>
                  {Object.entries(DURATION_RATES).map(([years, rate]) => (
                    <div
                      key={years}
                      onClick={() => setFormData(prev => ({ ...prev, duration: years }))}
                      style={{
                        padding: '15px 10px',
                        borderRadius: '8px',
                        border: `2px solid ${formData.duration === years ? colors.gold : colors.lightGray}`,
                        backgroundColor: formData.duration === years ? colors.gold : colors.white,
                        color: formData.duration === years ? colors.white : colors.navy,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        fontWeight: '600'
                      }}
                    >
                      <div style={{ fontSize: '1rem', marginBottom: '4px' }}>
                        {years} anni
                      </div>
                      <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                        {rate}% annuo
                      </div>
                    </div>
                  ))}
                </div>
                {errors.duration && (
                  <p style={{
                    color: colors.danger,
                    fontSize: '0.8rem',
                    margin: '8px 0 0 0',
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
                  padding: '15px',
                  backgroundColor: (isFirstContract || canCreateSubsequentContract) ? colors.navy : colors.darkGray,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: (isFirstContract || canCreateSubsequentContract) ? 'pointer' : 'not-allowed',
                  opacity: (isFirstContract || canCreateSubsequentContract) ? 1 : 0.6,
                  transition: 'all 0.2s ease'
                }}
              >
                CREA CONTRATTO
              </button>
            </form>
          </div>

          {/* Tabella contratti */}
          <div style={{
            backgroundColor: colors.white,
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              color: colors.navy,
              fontSize: '1.4rem',
              fontWeight: '700',
              margin: '0 0 30px 0',
              textAlign: 'center'
            }}>
              PORTAFOGLIO CONTRATTI
            </h2>

            {contracts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: colors.darkGray
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
                  📊
                </div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  margin: '0 0 10px 0'
                }}>
                  Nessun contratto attivo
                </h3>
                <p style={{ margin: '0', opacity: 0.8 }}>
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
                    <tr style={{
                      borderBottom: `3px solid ${colors.navy}`
                    }}>
                      {['ID', 'Capitale', 'Durata', 'Ricavo %', 'Anni', 'Ricavi/Anno', 'Tot. Ricavi', 'Stato'].map(header => (
                        <th key={header} style={{
                          padding: '15px 10px',
                          textAlign: 'center',
                          color: colors.navy,
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract, index) => (
                      <tr
                        key={contract.id}
                        style={{
                          borderBottom: `1px solid ${colors.lightGray}`,
                          backgroundColor: index % 2 === 0 ? colors.lightGray : colors.white
                        }}
                      >
                        <td style={{
                          padding: '15px 10px',
                          textAlign: 'center',
                          fontWeight: '700',
                          color: colors.navy
                        }}>
                          #{contract.id}
                        </td>
                        <td style={{
                          padding: '15px 10px',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: colors.navy
                        }}>
                          {formatCurrency(contract.capital)}
                        </td>
                        <td style={{
                          padding: '15px 10px',
                          textAlign: 'center',
                          color: colors.darkGray
                        }}>
                          {contract.duration}a
                        </td>
                        <td style={{
                          padding: '15px 10px',
                          textAlign: 'center',
                          fontWeight: '700',
                          color: colors.gold
                        }}>
                          {contract.ricavo}%
                        </td>
                        <td style={{
                          padding: '15px 10px',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: colors.success
                        }}>
                          {contract.anniTrascorsi}
                        </td>
                        <td style={{
                          padding: '15px 10px',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: colors.navy
                        }}>
                          {formatCurrency(contract.renditaAnnuale)}
                        </td>
                        <td style={{
                          padding: '15px 10px',
                          textAlign: 'center',
                          fontWeight: '700',
                          color: colors.gold
                        }}>
                          {formatCurrency(contract.ricaviTotali)}
                        </td>
                        <td style={{
                          padding: '15px 10px',
                          textAlign: 'center'
                        }}>
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: contract.stato === 'Attivo' ? colors.success : colors.gold,
                            color: colors.white
                          }}>
                            {contract.stato}
                          </span>
                        </td>
                      </tr>
                    ))}
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
