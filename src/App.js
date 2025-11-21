import React, { useState } from 'react';

// Ricavi annuali fissi in base alla durata del contratto
const DURATION_RATES = {
  3: 9,
  5: 12,
  8: 13,
  10: 14,
  12: 15,
  15: 16,
};

const MIN_CAPITAL = 5000;

export default function GoldInvestmentCalculator() {
  const [contracts, setContracts] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [formData, setFormData] = useState({ capital: '', duration: '' });
  const [errors, setErrors] = useState({});
  const [simulationYear, setSimulationYear] = useState(0);
  const [portfolioRendites, setPortfolioRendites] = useState(0);

  // Calcola la rendita annuale per un dato contratto
  const calculateAnnualReturn = (capital, rate) => {
    return Math.round((capital * rate) / 100);
  };
  
  // Logica per validare i dati del form prima della creazione
  const validateForm = () => {
    const newErrors = {};
    const capitalNum = parseInt(formData.capital, 10) || 0;
    const isFirstContract = contracts.length === 0;

    if (!formData.capital || isNaN(capitalNum) || capitalNum < MIN_CAPITAL) {
      newErrors.capital = `Il capitale minimo è ${MIN_CAPITAL.toLocaleString()}€`;
    } else if (!isFirstContract && capitalNum > portfolioRendites) {
      newErrors.capital = `Fondi insufficienti. Disponibili dal portafoglio: ${portfolioRendites.toLocaleString()}€`;
    }

    if (!formData.duration) {
      newErrors.duration = 'Seleziona una durata';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funzione per creare un nuovo contratto
  const createContract = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const capital = parseInt(formData.capital, 10);
    const duration = parseInt(formData.duration, 10);
    const ricavo = DURATION_RATES[duration];
    const isFirstContract = contracts.length === 0;

    // Se non è il primo contratto, il capitale viene sottratto dal portafoglio rendite
    if (!isFirstContract) {
      setPortfolioRendites((prev) => prev - capital);
    }
    
    const newContract = {
      id: nextId,
      capital,
      duration,
      ricavo, // Usiamo "ricavo" come richiesto
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

  // Funzione per simulare l'avanzamento di un anno per tutti i contratti
  const simulateNextYear = () => {
    let accumulatedRenditesThisYear = 0;

    const updatedContracts = contracts.map((contract) => {
      // Se il contratto è già completato, non genera più rendite
      if (contract.stato === 'Completato') {
        return contract;
      }

      const newAnniTrascorsi = contract.anniTrascorsi + 1;
      const newStatus = newAnniTrascorsi >= contract.duration ? 'Completato' : 'Attivo';

      // La rendita viene accumulata solo se il contratto è ancora in corso
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

  // Funzione per resettare l'intera simulazione
  const resetAll = () => {
    setContracts([]);
    setNextId(1);
    setFormData({ capital: '', duration: '' });
    setErrors({});
    setSimulationYear(0);
    setPortfolioRendites(0);
  };

  const isFirstContract = contracts.length === 0;
  // Per i contratti successivi, il form è utilizzabile solo se ci sono abbastanza rendite
  const canCreateSubsequentContract = !isFirstContract && portfolioRendites >= MIN_CAPITAL;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="text-center p-4">
          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">Calcolatore Investimenti Oro</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Anno Simulazione: 
            <span className="ml-2 font-mono font-bold text-blue-600 dark:text-blue-400 text-lg bg-blue-50 dark:bg-blue-900/50 px-3 py-1 rounded-full">
              {simulationYear}
            </span>
          </p>
        </div>

        {/* DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Portafoglio Rendite</h3>
            <p className="text-4xl font-bold mt-2 text-green-600 dark:text-green-400">{portfolioRendites.toLocaleString()}€</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Disponibile per nuovi contratti</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Contratti in Essere</h3>
            <p className="text-4xl font-bold mt-2 text-purple-600 dark:text-purple-400">{contracts.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {contracts.filter(c => c.stato === 'Attivo').length} Attivi / {contracts.filter(c => c.stato === 'Completato').length} Completati
            </p>
          </div>
        </div>

        {/* FORM CREAZIONE CONTRATTO */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2">
            {isFirstContract ? 'Crea il Tuo Primo Contratto' : 'Crea Nuovo Contratto con Rendite'}
          </h2>
          {!isFirstContract && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Puoi usare le rendite accumulate per finanziare questo investimento.
            </p>
          )}

          <form onSubmit={createContract} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="capital" className="block text-sm font-medium">Capitale (€)</label>
                <input
                  id="capital" type="number" min={MIN_CAPITAL} step="100"
                  placeholder={isFirstContract ? `Minimo ${MIN_CAPITAL.toLocaleString()}€` : `Max ${portfolioRendites.toLocaleString()}€`}
                  value={formData.capital}
                  onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
                  disabled={!isFirstContract && !canCreateSubsequentContract}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${errors.capital ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
                {errors.capital && <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.capital}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="duration" className="block text-sm font-medium">Durata e Ricavo</label>
                <select
                  id="duration" value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  disabled={!isFirstContract && !canCreateSubsequentContract}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 ${errors.duration ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                >
                  <option value="" disabled>Seleziona durata...</option>
                  {Object.entries(DURATION_RATES).map(([years, ricavo]) => (
                    <option key={years} value={years}>
                      {years} anni • {ricavo}% ricavo annuo
                    </option>
                  ))}
                </select>
                {errors.duration && <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.duration}</p>}
              </div>
            </div>

            <button type="submit" disabled={!isFirstContract && !canCreateSubsequentContract}
              className="w-full md:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isFirstContract ? 'Crea Contratto' : 'Crea con Rendite'}
            </button>
            {!isFirstContract && !canCreateSubsequentContract && portfolioRendites > 0 && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                    💡 Accumula almeno {MIN_CAPITAL.toLocaleString()}€ di rendite per creare un altro contratto.
                </p>
            )}
          </form>
        </div>

        {/* CONTROLLI */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={simulateNextYear} disabled={contracts.length === 0}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-lg transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Simula Anno Successivo
          </button>
          <button onClick={resetAll}
            className="sm:w-auto px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-base rounded-lg transition-colors shadow-lg"
          >
            Reset Totale
          </button>
        </div>

        {/* TABELLA CONTRATTI */}
        {contracts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Riepilogo Contratti</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">ID</th>
                    <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Capitale</th>
                    <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Durata</th>
                    <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Ricavo</th>
                    <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Anni Trascorsi</th>
                    <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Rendita Annuale</th>
                    <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Rendite Totali</th>
                    <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Stato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-3 font-mono">#{contract.id}</td>
                      <td className="p-3 font-medium">{contract.capital.toLocaleString()}€</td>
                      <td className="p-3">{contract.duration} anni</td>
                      <td className="p-3">{contract.ricavo}%</td>
                      <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{contract.anniTrascorsi}</td>
                      <td className="p-3 text-orange-600 dark:text-orange-400 font-medium">
                        {contract.renditaAnnuale.toLocaleString()}€
                      </td>
                      <td className="p-3 text-green-600 dark:text-green-400 font-bold">
                        {contract.renditeTotali.toLocaleString()}€
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${contract.stato === 'Attivo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'}`}
                        >
                          {contract.stato}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}