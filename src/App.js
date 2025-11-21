import React, { useState, useMemo } from 'react';

const GoldInvestmentCalculator = () => {
  const [contracts, setContracts] = useState([]);
  const [formData, setFormData] = useState({
    capital: '',
    duration: ''
  });
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [autoReinvest, setAutoReinvest] = useState(true);

  // Return rates based on duration
  const getReturnRate = (duration) => {
    const rates = {
      3: 9, 5: 12, 8: 13, 10: 14, 12: 15, 15: 16
    };
    return rates[duration] || 0;
  };

  // Available durations
  const availableDurations = [3, 5, 8, 10, 12, 15];

  // Theme colors
  const theme = {
    primary: '#D4AF37', // Gold
    primaryDark: '#B8941F',
    secondary: '#F5E6A8',
    background: '#FEFDF8',
    gradientGold: 'linear-gradient(135deg, #D4AF37 0%, #FFE55C 50%, #D4AF37 100%)',
    gradientDark: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
    white: '#FFFFFF',
    text: {
      primary: '#2C3E50',
      secondary: '#7F8C8D',
      light: '#FFFFFF',
      muted: '#95A5A6'
    },
    status: {
      active: '#27AE60',
      completed: '#8E44AD',
      pending: '#F39C12'
    },
    shadow: {
      light: '0 4px 6px rgba(0, 0, 0, 0.05)',
      medium: '0 8px 25px rgba(0, 0, 0, 0.1)',
      heavy: '0 20px 60px rgba(212, 175, 55, 0.15)'
    }
  };

  // Calculate contract performance
  const calculateContractPerformance = (contract) => {
    const yearsPassed = Math.min(currentYear - contract.startYear, contract.duration);
    const annualReturn = (contract.capital * contract.returnRate) / 100;
    let totalValue = contract.capital;
    let yearlyData = [];

    for (let year = 1; year <= contract.duration; year++) {
      const yearReturn = year <= yearsPassed ? annualReturn : 0;
      totalValue += yearReturn;
      yearlyData.push({
        year: contract.startYear + year - 1,
        return: year <= yearsPassed ? yearReturn : 0,
        cumulativeValue: year <= yearsPassed ? totalValue : contract.capital + (annualReturn * year),
        status: year <= yearsPassed ? 'completed' : 'projected'
      });
    }

    return {
      ...contract,
      yearlyData,
      currentValue: totalValue,
      totalReturns: totalValue - contract.capital,
      isCompleted: yearsPassed >= contract.duration,
      progress: (yearsPassed / contract.duration) * 100
    };
  };

  // Portfolio calculations
  const portfolioStats = useMemo(() => {
    const processedContracts = contracts.map(calculateContractPerformance);
    const totalInvested = processedContracts.reduce((sum, c) => sum + c.capital, 0);
    const totalCurrentValue = processedContracts.reduce((sum, c) => sum + c.currentValue, 0);
    const totalReturns = totalCurrentValue - totalInvested;
    const activeContracts = processedContracts.filter(c => !c.isCompleted).length;
    const completedContracts = processedContracts.filter(c => c.isCompleted).length;

    return {
      totalInvested,
      totalCurrentValue,
      totalReturns,
      returnPercentage: totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0,
      activeContracts,
      completedContracts,
      totalContracts: contracts.length,
      processedContracts
    };
  }, [contracts, currentYear]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createContract = () => {
    const capital = parseFloat(formData.capital);
    const duration = parseInt(formData.duration);

    if (capital < 5000) {
      alert('Il capitale minimo è €5.000');
      return;
    }

    if (!availableDurations.includes(duration)) {
      alert('Seleziona una durata valida');
      return;
    }

    const newContract = {
      id: Date.now(),
      capital,
      duration,
      returnRate: getReturnRate(duration),
      startYear: currentYear,
      createdAt: new Date().toISOString()
    };

    setContracts(prev => [...prev, newContract]);
    setFormData({ capital: '', duration: '' });
  };

  const removeContract = (id) => {
    setContracts(prev => prev.filter(c => c.id !== id));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const StatusBadge = ({ status, progress, isCompleted }) => (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: isCompleted ? theme.status.completed : theme.status.active,
      color: theme.text.light,
      boxShadow: theme.shadow.light
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: theme.text.light,
        animation: isCompleted ? 'none' : 'pulse 2s infinite'
      }} />
      {isCompleted ? 'Completato' : `Attivo (${Math.round(progress)}%)`}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.gradientDark,
      padding: '20px',
      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes goldShimmer {
            0% { background-position: -100% 0; }
            100% { background-position: 100% 0; }
          }
        `}
      </style>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        animation: 'slideIn 0.6s ease-out'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: theme.text.light
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            background: theme.gradientGold,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 16px 0',
            fontWeight: '700',
            letterSpacing: '-0.02em'
          }}>
            Gold Investment Calculator
          </h1>
          <p style={{
            fontSize: '1.2rem',
            margin: '0',
            opacity: '0.9',
            fontWeight: '300'
          }}>
            Calcola i rendimenti dei tuoi investimenti in oro con contratti professionali
          </p>
        </div>

        {/* Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: theme.white,
            borderRadius: '20px',
            padding: '32px',
            boxShadow: theme.shadow.heavy,
            border: `2px solid ${theme.secondary}`,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '100px',
              height: '100px',
              background: theme.gradientGold,
              borderRadius: '50%',
              transform: 'translate(30px, -30px)',
              opacity: '0.1'
            }} />
            <h3 style={{
              margin: '0 0 16px 0',
              color: theme.text.secondary,
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Valore Portfolio
            </h3>
            <div style={{
              fontSize: '2.8rem',
              fontWeight: '700',
              color: theme.text.primary,
              margin: '0 0 8px 0'
            }}>
              {formatCurrency(portfolioStats.totalCurrentValue)}
            </div>
            <div style={{
              color: portfolioStats.totalReturns >= 0 ? theme.status.active : '#E74C3C',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              {portfolioStats.totalReturns >= 0 ? '+' : ''}{formatCurrency(portfolioStats.totalReturns)}
              {' '}({portfolioStats.returnPercentage.toFixed(1)}%)
            </div>
          </div>

          <div style={{
            background: theme.white,
            borderRadius: '20px',
            padding: '32px',
            boxShadow: theme.shadow.heavy,
            border: `2px solid ${theme.secondary}`
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              color: theme.text.secondary,
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Contratti
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div>
                <div style={{
                  fontSize: '2.8rem',
                  fontWeight: '700',
                  color: theme.text.primary,
                  margin: '0'
                }}>
                  {portfolioStats.totalContracts}
                </div>
                <div style={{
                  color: theme.text.secondary,
                  fontSize: '14px'
                }}>
                  Totali
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '16px',
              fontSize: '14px'
            }}>
              <div>
                <span style={{ color: theme.status.active, fontWeight: '600' }}>
                  {portfolioStats.activeContracts}
                </span>
                <span style={{ color: theme.text.muted }}> Attivi</span>
              </div>
              <div>
                <span style={{ color: theme.status.completed, fontWeight: '600' }}>
                  {portfolioStats.completedContracts}
                </span>
                <span style={{ color: theme.text.muted }}> Completati</span>
              </div>
            </div>
          </div>

          <div style={{
            background: theme.white,
            borderRadius: '20px',
            padding: '32px',
            boxShadow: theme.shadow.heavy,
            border: `2px solid ${theme.secondary}`
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              color: theme.text.secondary,
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Capitale Investito
            </h3>
            <div style={{
              fontSize: '2.8rem',
              fontWeight: '700',
              color: theme.text.primary,
              margin: '0 0 8px 0'
            }}>
              {formatCurrency(portfolioStats.totalInvested)}
            </div>
            <div style={{
              color: theme.text.secondary,
              fontSize: '14px'
            }}>
              Investimento totale in oro
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 400px) 1fr',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Contract Creation Form */}
          <div style={{
            background: theme.white,
            borderRadius: '24px',
            padding: '40px',
            boxShadow: theme.shadow.heavy,
            border: `2px solid ${theme.secondary}`,
            position: 'sticky',
            top: '20px'
          }}>
            <h2 style={{
              margin: '0 0 32px 0',
              color: theme.text.primary,
              fontSize: '1.8rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              Nuovo Contratto
            </h2>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: theme.text.primary,
                fontWeight: '600',
                fontSize: '14px'
              }}>
                Capitale (€)
              </label>
              <input
                type="number"
                name="capital"
                value={formData.capital}
                onChange={handleInputChange}
                placeholder="Minimo €5.000"
                min="5000"
                step="1000"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  border: `2px solid ${theme.secondary}`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  backgroundColor: theme.background,
                  color: theme.text.primary,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.secondary;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                marginBottom: '16px',
                color: theme.text.primary,
                fontWeight: '600',
                fontSize: '14px'
              }}>
                Durata e Rendimento
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                {availableDurations.map(duration => (
                  <div
                    key={duration}
                    onClick={() => setFormData(prev => ({ ...prev, duration: duration.toString() }))}
                    style={{
                      padding: '16px 12px',
                      borderRadius: '12px',
                      border: `2px solid ${formData.duration === duration.toString() ? theme.primary : theme.secondary}`,
                      backgroundColor: formData.duration === duration.toString() ? `${theme.primary}10` : theme.background,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.duration !== duration.toString()) {
                        e.target.style.borderColor = theme.primary;
                        e.target.style.backgroundColor = `${theme.primary}05`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.duration !== duration.toString()) {
                        e.target.style.borderColor = theme.secondary;
                        e.target.style.backgroundColor = theme.background;
                      }
                    }}
                  >
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: theme.text.primary,
                      marginBottom: '4px'
                    }}>
                      {duration} anni
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: theme.primary
                    }}>
                      {getReturnRate(duration)}% annuo
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={createContract}
              disabled={!formData.capital || !formData.duration || parseFloat(formData.capital) < 5000}
              style={{
                width: '100%',
                padding: '18px',
                background: theme.gradientGold,
                border: 'none',
                borderRadius: '12px',
                color: theme.text.light,
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: theme.shadow.medium,
                opacity: (!formData.capital || !formData.duration || parseFloat(formData.capital) < 5000) ? 0.5 : 1,
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 30px rgba(212, 175, 55, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = theme.shadow.medium;
              }}
            >
              Crea Contratto
            </button>
          </div>

          {/* Contracts Table */}
          <div style={{
            background: theme.white,
            borderRadius: '24px',
            padding: '40px',
            boxShadow: theme.shadow.heavy,
            border: `2px solid ${theme.secondary}`,
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <h2 style={{
                margin: '0',
                color: theme.text.primary,
                fontSize: '1.8rem',
                fontWeight: '600'
              }}>
                Portafoglio Contratti
              </h2>
              {contracts.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  color: theme.text.secondary
                }}>
                  <input
                    type="number"
                    value={currentYear}
                    onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                    style={{
                      padding: '8px 12px',
                      border: `1px solid ${theme.secondary}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      width: '80px',
                      textAlign: 'center'
                    }}
                  />
                  <span>Anno corrente</span>
                </div>
              )}
            </div>

            {contracts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: theme.text.muted
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '16px'
                }}>
                  📊
                </div>
                <h3 style={{
                  margin: '0 0 8px 0',
                  color: theme.text.secondary,
                  fontSize: '1.2rem'
                }}>
                  Nessun contratto attivo
                </h3>
                <p style={{
                  margin: '0',
                  fontSize: '14px'
                }}>
                  Crea il tuo primo contratto di investimento in oro
                </p>
              </div>
            ) : (
              <div style={{
                overflowX: 'auto',
                marginBottom: '24px'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: '0 8px'
                }}>
                  <thead>
                    <tr>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        color: theme.text.secondary,
                        fontWeight: '600',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `2px solid ${theme.secondary}`
                      }}>Contratto</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'right',
                        color: theme.text.secondary,
                        fontWeight: '600',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `2px solid ${theme.secondary}`
                      }}>Capitale</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'center',
                        color: theme.text.secondary,
                        fontWeight: '600',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `2px solid ${theme.secondary}`
                      }}>Durata</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'center',
                        color: theme.text.secondary,
                        fontWeight: '600',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `2px solid ${theme.secondary}`
                      }}>Rendimento</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'right',
                        color: theme.text.secondary,
                        fontWeight: '600',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `2px solid ${theme.secondary}`
                      }}>Valore Attuale</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'center',
                        color: theme.text.secondary,
                        fontWeight: '600',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `2px solid ${theme.secondary}`
                      }}>Status</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'center',
                        color: theme.text.secondary,
                        fontWeight: '600',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `2px solid ${theme.secondary}`
                      }}>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioStats.processedContracts.map((contract, index) => (
                      <tr
                        key={contract.id}
                        style={{
                          backgroundColor: theme.background,
                          borderRadius: '12px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${theme.primary}10`;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = theme.shadow.medium;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = theme.background;
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <td style={{
                          padding: '20px',
                          borderRadius: '12px 0 0 12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: theme.text.primary
                        }}>
                          #{index + 1}
                          <div style={{
                            fontSize: '12px',
                            color: theme.text.muted,
                            marginTop: '4px'
                          }}>
                            {contract.startYear} - {contract.startYear + contract.duration}
                          </div>
                        </td>
                        <td style={{
                          padding: '20px',
                          textAlign: 'right',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: theme.text.primary
                        }}>
                          {formatCurrency(contract.capital)}
                        </td>
                        <td style={{
                          padding: '20px',
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: theme.text.primary
                        }}>
                          {contract.duration} anni
                        </td>
                        <td style={{
                          padding: '20px',
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: theme.primary
                        }}>
                          {contract.returnRate}%
                        </td>
                        <td style={{
                          padding: '20px',
                          textAlign: 'right'
                        }}>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: theme.text.primary,
                            marginBottom: '4px'
                          }}>
                            {formatCurrency(contract.currentValue)}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: contract.totalReturns >= 0 ? theme.status.active : '#E74C3C',
                            fontWeight: '600'
                          }}>
                            {contract.totalReturns >= 0 ? '+' : ''}{formatCurrency(contract.totalReturns)}
                          </div>
                        </td>
                        <td style={{
                          padding: '20px',
                          textAlign: 'center'
                        }}>
                          <StatusBadge
                            status={contract.isCompleted ? 'completed' : 'active'}
                            progress={contract.progress}
                            isCompleted={contract.isCompleted}
                          />
                        </td>
                        <td style={{
                          padding: '20px',
                          textAlign: 'center',
                          borderRadius: '0 12px 12px 0'
                        }}>
                          <button
                            onClick={() => removeContract(contract.id)}
                            style={{
                              padding: '8px 16px',
                              background: '#E74C3C',
                              border: 'none',
                              borderRadius: '8px',
                              color: theme.text.light,
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              textTransform: 'uppercase'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#C0392B';
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#E74C3C';
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            Rimuovi
                          </button>
                        </td>
                      </tr>
                    )