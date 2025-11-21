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

  // Theme colors
  const theme = {
    gold: '#D4AF37',
    goldLight: '#F7E98E',
    goldDark: '#B8941F',
    white: '#FFFFFF',
    dark: '#1A1A1A',
    gray: '#F5F5F5',
    grayMedium: '#CCCCCC',
    grayDark: '#666666',
    green: '#27AE60',
    red: '#E74C3C',
    blue: '#3498DB',
    gradientGold: 'linear-gradient(135deg, #D4AF37 0%, #F7E98E 50%, #D4AF37 100%)',
    gradientDark: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
    shadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    shadowHeavy: '0 20px 60px rgba(212, 175, 55, 0.2)'
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
      renditeTotali: 0,
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
        renditeTotali: contract.renditeTotali + contract.renditaAnnuale,
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
  const totalInvested = contracts.reduce((sum, c) => sum + c.capital, 0);
  const totalReturns = contracts.reduce((sum, c) => sum + c.renditeTotali, 0);
  const activeContracts = contracts.filter(c => c.stato === 'Attivo').length;
  const completedContracts = contracts.filter(c => c.stato === 'Completato').length;

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.gradientDark,
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: theme.white
    }}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
            50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.6); }
          }
        `}
      </style>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        animation: 'slideIn 0.8s ease-out'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          padding: '20px'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            background: theme.gradientGold,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 16px 0',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🏆 GOLD INVESTMENT CALCULATOR 🏆
          </h1>
          <p style={{
            fontSize: '1.3rem',
            margin: '0',
            opacity: '0.9',
            fontWeight: '300',
            color: theme.goldLight
          }}>
            Calcola e simula i rendimenti dei tuoi investimenti in oro
          </p>
        </div>

        {/* Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Portfolio Value */}
          <div style={{
            background: theme.white,
            borderRadius: '24px',
            padding: '32px',
            boxShadow: theme.shadowHeavy,
            border: `3px solid ${theme.gold}`,
            position: 'relative',
            overflow: 'hidden',
            transform: 'translateY(0)',
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              background: theme.gradientGold,
              borderRadius: '50%',
              opacity: '0.1'
            }} />
            <h3 style={{
              margin: '0 0 16px 0',
              color: theme.grayDark,
              fontSize: '14px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              💰 PORTAFOGLIO RENDITE
            </h3>
            <div style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: '900',
              color: theme.green,
              margin: '0 0 8px 0',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}>
              {formatCurrency(portfolioRendites)}
            </div>
            <div style={{
              color: theme.grayDark,
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Disponibile per nuovi contratti
            </div>
          </div>

          {/* Contracts Summary */}
          <div style={{
            background: theme.white,
            borderRadius: '24px',
            padding: '32px',
            boxShadow: theme.shadowHeavy,
            border: `3px solid ${theme.gold}`,
            transform: 'translateY(0)',
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              color: theme.grayDark,
              fontSize: '14px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              📋 CONTRATTI ATTIVI
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: '900',
                color: theme.blue,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}>
                {contracts.length}
              </div>
              <div style={{
                textAlign: 'right'
              }}>
                <div style={{ color: theme.green, fontSize: '18px', fontWeight: '700' }}>
                  ✅ {activeContracts} Attivi
                </div>
                <div style={{ color: theme.gold, fontSize: '18px', fontWeight: '700' }}>
                  🏆 {completedContracts} Completati
                </div>
              </div>
            </div>
          </div>

          {/* Total Investment */}
          <div style={{
            background: theme.white,
            borderRadius: '24px',
            padding: '32px',
            boxShadow: theme.shadowHeavy,
            border: `3px solid ${theme.gold}`,
            transform: 'translateY(0)',
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              color: theme.grayDark,
              fontSize: '14px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              💎 CAPITALE INVESTITO
            </h3>
            <div style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: '900',
              color: theme.gold,
              margin: '0 0 8px 0',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}>
              {formatCurrency(totalInvested)}
            </div>
            <div style={{
              color: totalReturns >= 0 ? theme.green : theme.red,
              fontSize: '16px',
              fontWeight: '700'
            }}>
              {totalReturns >= 0 ? '📈 +' : '📉 '}{formatCurrency(totalReturns)} rendite
            </div>
          </div>
        </div>

        {/* Year Counter and Controls */}
        <div style={{
          background: theme.white,
          borderRadius: '24px',
          padding: '32px',
          boxShadow: theme.shadowHeavy,
          border: `3px solid ${theme.gold}`,
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h2 style={{
            margin: '0 0 24px 0',
            color: theme.dark,
            fontSize: '2rem',
            fontWeight: '800'
          }}>
            🕐 Anno di Simulazione: <span style={{ color: theme.gold }}>{simulationYear}</span>
          </h2>
          
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
                padding: '16px 32px',
                background: contracts.length > 0 ? theme.gradientGold : theme.grayMedium,
                border: 'none',
                borderRadius: '50px',
                color: theme.white,
                fontSize: '18px',
                fontWeight: '700',
                cursor: contracts.length > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: theme.shadow,
                transform: 'scale(1)',
                opacity: contracts.length > 0 ? 1 : 0.5
              }}
            >
              ⏭️ Simula Anno Successivo
            </button>

            <button
              onClick={resetAll}
              style={{
                padding: '16px 32px',
                background: theme.red,
                border: 'none',
                borderRadius: '50px',
                color: theme.white,
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: theme.shadow,
                transform: 'scale(1)'
              }}
            >
              🔄 Reset Totale
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 450px) 1fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Contract Creation Form */}
          <div style={{
            background: theme.white,
            borderRadius: '24px',
            padding: '40px',
            boxShadow: theme.shadowHeavy,
            border: `3px solid ${theme.gold}`,
            position: 'sticky',
            top: '20px'
          }}>
            <h2 style={{
              margin: '0 0 32px 0',
              color: theme.dark,
              fontSize: '2rem',
              fontWeight: '800',
              textAlign: 'center'
            }}>
              ✨ {isFirstContract ? 'Primo Contratto' : 'Nuovo Contratto'}
            </h2>

            {!isFirstContract && (
              <div style={{
                background: theme.goldLight,
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                textAlign: 'center',
                color: theme.dark,
                fontWeight: '600'
              }}>
                💡 Usa le rendite accumulate per finanziare questo investimento
              </div>
            )}

            <form onSubmit={createContract}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: theme.dark,
                  fontWeight: '700',
                  fontSize: '16px'
                }}>
                  💰 Capitale (€)
                </label>
                <input
                  type="number"
                  min={MIN_CAPITAL}
                  step="100"
                  placeholder={isFirstContract ? `Minimo ${MIN_CAPITAL.toLocaleString()}€` : `Max ${portfolioRendites.toLocaleString()}€`}
                  value={formData.capital}
                  onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
                  disabled={!isFirstContract && !canCreateSubsequentContract}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    border: `3px solid ${errors.capital ? theme.red : theme.gold}`,
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    backgroundColor: theme.gray,
                    color: theme.dark,
                    outline: 'none',
                    boxSizing: 'border-box',
                    opacity: (!isFirstContract && !canCreateSubsequentContract) ? 0.5 : 1
                  }}
                />
                {errors.capital && (
                  <p style={{
                    color: theme.red,
                    fontSize: '14px',
                    margin: '8px 0 0 0',
                    fontWeight: '600'
                  }}>
                    ⚠️ {errors.capital}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '16px',
                  color: theme.dark,
                  fontWeight: '700',
                  fontSize: '16px'
                }}>
                  ⏱️ Durata e Rendimento
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  {Object.entries(DURATION_RATES).map(([years, rate]) => (
                    <div
                      key={years}
                      onClick={() => setFormData(prev => ({ ...prev, duration: years }))}
                      style={{
                        padding: '16px 12px',
                        borderRadius: '12px',
                        border: `3px solid ${formData.duration === years ? theme.gold : theme.grayMedium}`,
                        backgroundColor: formData.duration === years ? `${theme.gold}20` : theme.gray,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        transform: 'scale(1)'
                      }}
                    >
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: theme.dark,
                        marginBottom: '4px'
                      }}>
                        {years} anni
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: theme.gold
                      }}>
                        {rate}% annuo
                      </div>
                    </div>
                  ))}
                </div>
                {errors.duration && (
                  <p style={{
                    color: theme.red,
                    fontSize: '14px',
                    margin: '12px 0 0 0',
                    fontWeight: '600'
                  }}>
                    ⚠️ {errors.duration}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFirstContract && !canCreateSubsequentContract}
                style={{
                  width: '100%',
                  padding: '20px',
                  background: (isFirstContract || canCreateSubsequentContract) ? theme.gradientGold : theme.grayMedium,
                  border: 'none',
                  borderRadius: '50px',
                  color: theme.white,
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: (isFirstContract || canCreateSubsequentContract) ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: theme.shadow,
                  opacity: (isFirstContract || canCreateSubsequentContract) ? 1 : 0.5,
                  transform: 'translateY(0)'
                }}
              >
                🚀 {isFirstContract ? 'Crea Primo Contratto' : 'Crea con Rendite'}
              </button>

              {!isFirstContract && !canCreateSubsequentContract && portfolioRendites > 0 && (
                <p style={{
                  color: '#F39C12',
                  fontSize: '14px',
                  margin: '16px 0 0 0',
                  textAlign: 'center',
                  fontWeight: '600'
                }}>
                  💡 Accumula almeno {formatCurrency(MIN_CAPITAL)} di rendite per creare un altro contratto
                </p>
              )}
            </form>
          </div>

          {/* Contracts Table */}
          <div style={{
            background: theme.white,
            borderRadius: '24px',
            padding: '40px',
            boxShadow: theme.shadowHeavy,
            border: `3px solid ${theme.gold}`
          }}>
            <h2 style={{
              margin: '0 0 32px 0',
              color: theme.dark,
              fontSize: '2rem',
              fontWeight: '800',
              textAlign: 'center'
            }}>
              📊 Riepilogo Contratti
            </h2>

            {contracts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: theme.grayDark
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '24px' }}>
                  📈
                </div>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}>
                  Nessun contratto attivo
                </h3>
                <p style={{
                  margin: '0',
                  fontSize: '16px',
                  opacity: 0.8
                }}>
                  Crea il tuo primo contratto di investimento in oro per iniziare
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: '0 12px'
                }}>
                  <thead>
                    <tr>
                      {['ID', 'Capitale', 'Durata', 'Ricavo %', 'Anni', 'Rendita/Anno', 'Tot. Rendite', 'Stato'].map(header => (
                        <th key={header} style={{
                          padding: '20px 16px',
                          textAlign: 'center',
                          color: theme.grayDark,
                          fontWeight: '700',
                          fontSize: '14px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          borderBottom: `3px solid ${theme.gold}`
                        }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract) => (
                      <tr
                        key={contract.id}
                        style={{
                          backgroundColor: theme.gray,
                          borderRadius: '16px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <td style={{
                          padding: '20px 16px',
                          textAlign: 'center',
                          fontSize: '16px',
                          fontWeight: '800',
                          color: theme.dark,
                          borderRadius: '16px 0 0 16px'
                        }}>
                          #{contract.id}
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          textAlign: 'center',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: theme.gold
                        }}>
                          {formatCurrency(contract.capital)}
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: theme.dark
                        }}>
                          {contract.duration} anni
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          textAlign: 'center',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: theme.blue
                        }}>
                          {contract.ricavo}%
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          textAlign: 'center',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: theme.green
                        }}>
                          {contract.anniTrascorsi}
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          textAlign: 'center',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: theme.dark
                        }}>
                          {formatCurrency(contract.renditaAnnuale)}
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          textAlign: 'center',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: theme.green
                        }}>
                          {formatCurrency(contract.renditeTotali)}
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          textAlign: 'center',
                          borderRadius: '0 16px 16px 0'
                        }}>
                          <span style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '700',
                            backgroundColor: contract.stato === 'Attivo' ? theme.green : theme.gold,
                            color: theme.white
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