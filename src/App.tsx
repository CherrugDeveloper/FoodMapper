import { useState } from 'react';
import MedicalDisclaimer from './components/MedicalDisclaimer';
import NutritionalCalculator from './components/NutritionalCalculator';
import EducationalHub from './components/EducationalHub';
import FoodFilter from './components/FoodFilter';
// AGGIORNATO: Importazione dello schema dieta
import DietPlan from './components/DietPlan';

export default function App() {
  const [isAppUnlocked, setIsAppUnlocked] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-8">
      <MedicalDisclaimer onAccept={() => setIsAppUnlocked(true)} />

      {isAppUnlocked && (
        <div className="w-full max-w-4xl mt-6">
          <header className="mb-6 flex flex-col items-center justify-center text-center w-full">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-center text-(--text-h)">
              🥑 <span className="text-(--accent)">IBS</span> Nutrition Guide
            </h1>
            <p className="text-(--text) text-sm md:text-base max-w-xl text-center block w-full mx-auto">
              Strumento scientifico basato sul protocollo FODMAP e sui fabbisogni cellulari strutturali.
            </p>
          </header>

          <main>
            <NutritionalCalculator />
            <EducationalHub />
            <FoodFilter />
            {/* AGGIORNATO: Visualizzazione dello Schema Pasti */}
            <DietPlan />
          </main>
        </div>
      )}
    </div>
  );
}
