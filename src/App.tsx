import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MedicalDisclaimer from './components/MedicalDisclaimer';
import NutritionalCalculator from './components/NutritionalCalculator';
import EducationalHub from './components/EducationalHub';
import FoodFilter from './components/FoodFilter';
import DietPlan from './components/DietPlan';
import Diary from './components/Diary';
import WorkoutPlan from './components/WorkoutPlan';
import Devices from './components/Devices';
import Header from './components/Header';
import type { UserData, NutritionalResults } from './utils/nutritionEngine';

type TabId = 'calc' | 'diary' | 'diet' | 'workout' | 'foods' | 'devices' | 'hub';

const TABS: { id: TabId; icon: string; labelKey: string }[] = [
  { id: 'calc', icon: '⚙️', labelKey: 'tab_calc' },
  { id: 'diary', icon: '📔', labelKey: 'tab_diary' },
  { id: 'diet', icon: '🍽️', labelKey: 'tab_diet' },
  { id: 'workout', icon: '💪', labelKey: 'tab_workout' },
  { id: 'foods', icon: '🔍', labelKey: 'tab_foods' },
  { id: 'devices', icon: '⌚', labelKey: 'tab_devices' },
  { id: 'hub', icon: '📚', labelKey: 'tab_hub' }
];

export default function App() {
  const { t } = useTranslation();
  const [isAppUnlocked, setIsAppUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('calc');

  // Risultati del calcolo condivisi con Diario, Dieta e Allenamento
  const [calcResults, setCalcResults] = useState<NutritionalResults | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleCalculate = (results: NutritionalResults, data: UserData) => {
    setCalcResults(results);
    setUserData(data);
  };

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-8">
      <MedicalDisclaimer onAccept={() => setIsAppUnlocked(true)} />

      {isAppUnlocked && (
        <div className="w-full max-w-4xl mt-6">
          <Header />

          {/* Navigazione a schede */}
          <nav className="w-full max-w-4xl mx-auto px-6 md:px-8 mb-2">
            <div className="flex gap-1.5 md:gap-2 pb-2">
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-(--accent) text-white border-(--accent) shadow-md'
                        : 'bg-(--bg) border-(--border) text-(--text) hover:text-(--text-h) hover:border-(--accent-border)'
                    }`}
                  >
                    <span aria-hidden="true">{tab.icon}</span>
                    {t(tab.labelKey)}
                  </button>
                );
              })}
            </div>
          </nav>

          <main>
            {activeTab === 'calc' && (
              <NutritionalCalculator onCalculate={handleCalculate} initialResults={calcResults} />
            )}
            {activeTab === 'diary' && (
              <Diary waterTargetLiters={calcResults?.waterLiters ?? null} />
            )}
            {activeTab === 'diet' && (
              <DietPlan
                results={calcResults}
                userData={userData}
                onGoToCalculator={() => setActiveTab('calc')}
              />
            )}
            {activeTab === 'workout' && (
              <WorkoutPlan
                userData={userData}
                onGoToCalculator={() => setActiveTab('calc')}
              />
            )}
            {activeTab === 'foods' && <FoodFilter />}
            {activeTab === 'devices' && <Devices />}
            {activeTab === 'hub' && <EducationalHub />}
          </main>
        </div>
      )}
    </div>
  );
}
