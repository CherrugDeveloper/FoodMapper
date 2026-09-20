import { useState } from 'react';
import { calculateNutritionalNeeds } from '../utils/nutritionEngine';
import type { UserData, NutritionalResults } from '../utils/nutritionEngine';

export default function NutritionalCalculator() {
  const [formData, setFormData] = useState<UserData>({
    weightKg: 70,
    heightCm: 175,
    ageYears: 30,
    biologicalSex: 'female',
    activityLevel: 'sedentary',
    ibsType: 'unknown'
  });

  const [results, setResults] = useState<NutritionalResults | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue = ['weightKg', 'heightCm', 'ageYears'].includes(name) ? Number(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nutritionalNeeds = calculateNutritionalNeeds(formData);
    setResults(nutritionalNeeds);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COLONNA FORM */}
        <div className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
          <h2 className="text-xl font-bold text-(--text-h) mb-6">⚙️ Parametri Biometrici e Intestinali</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input Peso e Altezza */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-(--text) mb-1">Peso (kg)</label>
                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={handleChange}
                  min="30"
                  max="200"
                  className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text) mb-1">Altezza (cm)</label>
                <input
                  type="number"
                  name="heightCm"
                  value={formData.heightCm}
                  onChange={handleChange}
                  min="100"
                  max="250"
                  className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
                  required
                />
              </div>
            </div>

            {/* Input Età e Sesso */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-(--text) mb-1">Età (anni)</label>
                <input
                  type="number"
                  name="ageYears"
                  value={formData.ageYears}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text) mb-1">Sesso Biologico</label>
                <select
                  name="biologicalSex"
                  value={formData.biologicalSex}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
                >
                  <option value="female">Femmina</option>
                  <option value="male">Maschio</option>
                </select>
              </div>
            </div>

            {/* Livello di Attività */}
            <div>
              <label className="block text-sm font-medium text-(--text) mb-1">Livello di Attività</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
              >
                <option value="sedentary">Sedentario (Lavoro d'ufficio)</option>
                <option value="lightly_active">Attività Leggera (1-3 gg/sett)</option>
                <option value="moderately_active">Attività Moderata (3-5 gg/sett)</option>
                <option value="very_active">Attività Intensa (Tutti i giorni)</option>
              </select>
            </div>

            {/* Sottotipo IBS */}
            <div>
              <label className="block text-sm font-medium text-(--text) mb-1">Sottotipo IBS Dominante</label>
              <select
                name="ibsType"
                value={formData.ibsType}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) focus:outline-none focus:border-(--accent) font-semibold text-(--accent)"
              >
                <option value="unknown">Non lo so / Non specificato</option>
                <option value="IBS-D">IBS-D (Prevalenza Diarrea / Gonfiore)</option>
                <option value="IBS-C">IBS-C (Prevalenza Stipsi / Rallentamento)</option>
                <option value="IBS-M">IBS-M (Mista / Alternata)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 font-semibold rounded-xl text-white bg-(--accent) hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer shadow-md text-center"
            >
              Calcola Fabbisogno Strutturale
            </button>
          </form>
        </div>

        {/* COLONNA RISULTATI */}
        <div className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-(--text-h) mb-6">📊 Report Fabbisogno Basato su Evidenze</h2>
            
            {results ? (
              <div className="space-y-4 animate-fade-in">
                {/* Macronutrienti */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-(--code-bg) border border-(--border)">
                    <span className="block text-xs uppercase tracking-wider text-(--text)">Proteine</span>
                    <strong className="text-lg text-(--text-h)">{results.proteins}g</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-(--code-bg) border border-(--border)">
                    <span className="block text-xs uppercase tracking-wider text-(--text)">Grassi</span>
                    <strong className="text-lg text-(--text-h)">{results.fats}g</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-(--code-bg) border border-(--border)">
                    <span className="block text-xs uppercase tracking-wider text-(--text)">Carboidrati</span>
                    <strong className="text-lg text-(--text-h)">{results.carbs}g</strong>
                  </div>
                </div>

                {/* Target Intestino */}
                <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border) space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-(--text)">🎯 Target Fibre Critico:</span>
                    <strong className="text-(--text-h)">{results.fiber}g / giorno</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-(--text)">💧 Idratazione Minima:</span>
                    <strong className="text-(--text-h)">{results.waterLiters} Litri</strong>
                  </div>
                </div>

                {/* Box Raccomandazioni Cliniche */}
                <div className="p-4 rounded-xl bg-purple-500/5 border border-(--accent-border)">
                  <h4 className="text-sm font-bold text-(--accent) mb-1">💡 Indicazione per il Microbiota:</h4>
                  <p className="text-sm text-(--text) leading-relaxed">{results.recommendations}</p>
                </div>
                
                <p className="text-xs text-(--text) italic mt-2 text-center">
                  *Stima del consumo energetico teorico di fondo: ~{results.estimatedTotalEnergyKcal} kcal
                </p>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center border border-dashed border-(--border) rounded-xl text-(--text) italic text-center p-4">
                Inserisci i tuoi dati biometrici e primi "Calcola" per visualizzare i fabbisogni strutturali personalizzati.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
