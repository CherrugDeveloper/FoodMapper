import { useState } from 'react';
import MedicalDisclaimer from './components/MedicalDisclaimer';
import NutritionalCalculator from './components/NutritionalCalculator';
import EducationalHub from './components/EducationalHub';
import FoodFilter from './components/FoodFilter';
// AGGIORNATO: Importazione dello schema dieta
import DietPlan from './components/DietPlan';
// AGGIORNATO: Importazione dell'Header con le opzioni lingua
import Header from './components/Header';

export default function App() {
  const [isAppUnlocked, setIsAppUnlocked] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-8">
      <MedicalDisclaimer onAccept={() => setIsAppUnlocked(true)} />

      {isAppUnlocked && (
        <div className="w-full max-w-4xl mt-6">
          {/* AGGIORNATO: Visualizzazione della barra superiore per cambiare lingua */}
          <Header />

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
