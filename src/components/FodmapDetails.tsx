import { useTranslation } from 'react-i18next';
import { FOODS_DATABASE } from '../utils/foodsData';
import type { FoodItem } from '../utils/foodsData';
import InfoPopup from './InfoPopup';

interface FodmapDetailsProps {
  foodId: string;
  isOpen: boolean;
  onClose: () => void;
}

const FODMAP_TYPES = [
  { key: 'fructans', label: 'Fruttani', description: 'Catene di fruttosio presenti in grano, cipolle, aglio, porri, carciofi' },
  { key: 'galactans', label: 'Galattani (GOS)', description: 'Oligosaccaridi del galattosio presenti in legumi, cavoli, broccoli' },
  { key: 'lactose', label: 'Lattosio', description: 'Zucchero del latte presente in latticini freschi, latte vaccino, yogurt non delattosato' },
  { key: 'fructose', label: 'Fruttosio in eccesso', description: 'Quando il fruttosio supera il glucosio: mele, pere, miele, anguria, sciroppo di mais ad alto fruttosio' },
  { key: 'sorbitol', label: 'Sorbitolo (Poliolo)', description: 'Alcol zuccherino presente in frutta a nocciolo (pesche, prugne), funghi, dolcificanti artificiali' },
  { key: 'mannitol', label: 'Mannitolo (Poliolo)', description: 'Alcol zuccherino presente in funghi, cavolfiore, sedano, alghe, dolcificanti' },
] as const;

const TOLERANCE_LEVELS = [
  { level: 'low', label: 'Basso', color: 'emerald', description: 'Generalmente ben tollerato in porzioni standard' },
  { level: 'medium', label: 'Medio', color: 'amber', description: 'Tollerato in piccole porzioni, testare individualmente' },
  { level: 'high', label: 'Alto', color: 'red', description: 'Probabile scatenante sintomi, evitare o limitare fortemente' },
] as const;

const STANDARD_PORTIONS: Record<string, { amount: number; unit: string }> = {
  '1': { amount: 100, unit: 'g' }, // Pane/Pasta
  '2': { amount: 80, unit: 'g' },  // Riso
  '3': { amount: 40, unit: 'g' },  // Avena
  '4': { amount: 10, unit: 'g' },  // Aglio/Cipolla
  '5': { amount: 100, unit: 'g' }, // Zucchine
  '6': { amount: 75, unit: 'g' },  // Carote
  '7': { amount: 120, unit: 'g' }, // Carciofi/Scalogno
  '8': { amount: 100, unit: 'g' }, // Mele/Pere
  '9': { amount: 80, unit: 'g' },  // Fragole/Mirtilli
  '10': { amount: 150, unit: 'g' }, // Anguria
  '11': { amount: 100, unit: 'ml' }, // Latte
  '12': { amount: 30, unit: 'g' },  // Parmigiano
  '13': { amount: 100, unit: 'g' }, // Uova/Carne
  '14': { amount: 100, unit: 'g' }, // Legumi
  '15': { amount: 60, unit: 'g' },  // Quinoa
  '16': { amount: 80, unit: 'g' },  // Mais
  '17': { amount: 60, unit: 'g' },  // Grano saraceno
  '18': { amount: 50, unit: 'g' },  // Pane GF
  '19': { amount: 80, unit: 'g' },  // Spinaci
  '20': { amount: 100, unit: 'g' }, // Finocchio
  '21': { amount: 100, unit: 'g' }, // Peperoni
  '22': { amount: 100, unit: 'g' }, // Pomodori
  '23': { amount: 75, unit: 'g' },  // Cavolfiore
  '24': { amount: 150, unit: 'g' }, // Patate
  '25': { amount: 100, unit: 'g' }, // Zucca
  '26': { amount: 100, unit: 'g' }, // Melanzane
  '27': { amount: 150, unit: 'g' }, // Arance
  '28': { amount: 75, unit: 'g' },  // Kiwi
  '29': { amount: 100, unit: 'g' }, // Banana
  '30': { amount: 150, unit: 'g' }, // Melone
  '31': { amount: 100, unit: 'g' }, // Ananas
  '32': { amount: 80, unit: 'g' },  // Ciliegie
  '33': { amount: 100, unit: 'g' }, // Pollo
  '34': { amount: 100, unit: 'g' }, // Pesce
  '35': { amount: 100, unit: 'g' }, // Tofu
  '36': { amount: 125, unit: 'g' }, // Yogurt greco
  '37': { amount: 10, unit: 'ml' }, // Olio EVO
  '38': { amount: 15, unit: 'g' },  // Mandorle
  '39': { amount: 15, unit: 'g' },  // Semi chia
  '40': { amount: 15, unit: 'g' },  // Semi zucca
  '41': { amount: 20, unit: 'g' },  // Cioccolato
  '42': { amount: 15, unit: 'g' },  // Miele
  '43': { amount: 15, unit: 'ml' }, // Sciroppo acero
  '44': { amount: 10, unit: 'g' },  // Zenzero
  '45': { amount: 100, unit: 'g' }, // Shirataki
  '46': { amount: 60, unit: 'g' },  // Farro
  '47': { amount: 75, unit: 'g' },  // Broccoli
  '48': { amount: 80, unit: 'g' },  // Asparagi
  '49': { amount: 100, unit: 'g' }, // Cetrioli
  '50': { amount: 30, unit: 'g' },  // Rucola
  '51': { amount: 100, unit: 'g' }, // Barbabietola
  '52': { amount: 100, unit: 'g' }, // Papaia
  '53': { amount: 60, unit: 'g' },  // Lamponi
  '54': { amount: 30, unit: 'g' },  // Prugne secche
  '55': { amount: 80, unit: 'g' },  // Uva
  '56': { amount: 50, unit: 'g' },  // Mozzarella bufala
  '57': { amount: 100, unit: 'g' }, // Tempeh
  '58': { amount: 100, unit: 'g' }, // Manzo
  '59': { amount: 15, unit: 'ml' }, // Aceto mele
  '60': { amount: 5, unit: 'g' },   // Curcuma
  '61': { amount: 10, unit: 'g' },  // Senape
  '62': { amount: 30, unit: 'ml' }, // Caffè
  '63': { amount: 200, unit: 'ml' }, // Tè verde
  '64': { amount: 200, unit: 'ml' }, // Camomilla
  '65': { amount: 250, unit: 'ml' }, // Acqua
  '66': { amount: 200, unit: 'ml' }, // Latte avena
  '67': { amount: 10, unit: 'g' },  // Ghee
  '68': { amount: 30, unit: 'g' },  // Noci
  '69': { amount: 80, unit: 'g' },  // Avocado
  '70': { amount: 80, unit: 'g' },  // Funghi Porcini
  '71': { amount: 30, unit: 'ml' }, // Limone
  '72': { amount: 30, unit: 'g' },  // Olive
  '73': { amount: 15, unit: 'g' },  // Pinoli
  '74': { amount: 80, unit: 'g' },  // Farina di riso
  '75': { amount: 5, unit: 'g' },   // Cannella
  '76': { amount: 10, unit: 'g' },  // Prezzemolo
  '77': { amount: 10, unit: 'g' },  // Basilico
  '78': { amount: 10, unit: 'g' },  // Menta
  '79': { amount: 10, unit: 'g' },  // Salvia
  '80': { amount: 3, unit: 'g' },   // Pepe
  '81': { amount: 5, unit: 'g' },   // Paprica
  '82': { amount: 5, unit: 'g' },   // Cumino
  '83': { amount: 15, unit: 'g' },  // Tahina/Olio sesamo
  '84': { amount: 15, unit: 'ml' }, // Tamari
  '85': { amount: 60, unit: 'ml' }, // Latte cocco
  '86': { amount: 40, unit: 'g' },  // Sedano
  '87': { amount: 20, unit: 'g' },  // Anacardi
  '88': { amount: 40, unit: 'g' },  // Feta
  '89': { amount: 50, unit: 'g' },  // Lenticchie rosse
  '90': { amount: 15, unit: 'g' },  // Zucchero
};

function getFodmapContent(food: FoodItem) {
  const triggerGroup = food.triggerGroup;
  const fodmapLevel = food.fodmapLevel;
  const standardPortion = STANDARD_PORTIONS[food.id] || { amount: 100, unit: 'g' };

  // Determine which FODMAP types are present
  const presentFodmaps = FODMAP_TYPES.filter(fodmap => {
    if (food.fodmapDetails && fodmap.key in food.fodmapDetails) return true;
    if (triggerGroup === 'Fruttani' && fodmap.key === 'fructans') return true;
    if (triggerGroup === 'Galattani' && fodmap.key === 'galactans') return true;
    if (triggerGroup === 'Lattosio' && fodmap.key === 'lactose') return true;
    if (triggerGroup === 'Fruttosio' && fodmap.key === 'fructose') return true;
    if (triggerGroup === 'Polioli' && (fodmap.key === 'sorbitol' || fodmap.key === 'mannitol')) return true;
    return false;
  });

  // If no specific trigger group but high FODMAP, show all possible
  const displayFodmaps = presentFodmaps.length > 0 ? presentFodmaps : FODMAP_TYPES;

  return {
    food,
    triggerGroup,
    fodmapLevel,
    standardPortion,
    presentFodmaps: displayFodmaps,
    toleranceLevel: TOLERANCE_LEVELS.find(tl => tl.level === fodmapLevel) || TOLERANCE_LEVELS[0],
  };
}

export default function FodmapDetails({ foodId, isOpen, onClose }: FodmapDetailsProps) {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  const food = FOODS_DATABASE.find(f => f.id === foodId);
  if (!food) return null;

  const content = getFodmapContent(food);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fodmap-details-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-(--bg) border border-(--border) rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl mx-0 sm:mx-4">
        <div className="flex justify-between items-start p-4 sm:p-6 border-b border-(--border)">
          <h2 id="fodmap-details-title" className="text-xl sm:text-2xl font-bold text-(--text-h)">
            {t('fodmap_details.title', { defaultValue: 'Dettagli FODMAP' })}: {t(`foods.${food.id}.name`)}
          </h2>
          <button
            onClick={onClose}
            className="text-(--text) hover:text-(--text-h) text-2xl leading-none p-1"
            aria-label={t('fodmap_details.close', { defaultValue: 'Chiudi' })}
          >
            ×
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* FODMAP Level Badge */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
              content.fodmapLevel === 'high'
                ? 'bg-red-500/20 text-red-500'
                : content.fodmapLevel === 'medium'
                  ? 'bg-amber-500/20 text-amber-500'
                  : 'bg-emerald-500/20 text-emerald-500'
            }`}>
              {content.fodmapLevel === 'high'
                ? t('fodmap_details.high_fodmap', { defaultValue: 'FODMAP Alto' })
                : content.fodmapLevel === 'medium'
                  ? t('fodmap_details.medium_fodmap', { defaultValue: 'FODMAP Medio' })
                  : t('fodmap_details.low_fodmap', { defaultValue: 'FODMAP Basso' })}
            </span>
            <InfoPopup infoKey={content.fodmapLevel === 'high' ? 'fodmap_high' : 'fodmap_low'} className="ml-2" />
          </div>

          {/* Standard Portion */}
          <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border)">
            <h3 className="text-sm font-medium text-(--text-h) mb-2 flex items-center gap-2">
              <span aria-hidden="true">📏</span>
              {t('fodmap_details.standard_portion', { defaultValue: 'Porzione standard di riferimento' })}
            </h3>
            <p className="text-lg font-bold text-(--text-h)">
              {content.standardPortion.amount} {content.standardPortion.unit}
            </p>
            <p className="text-xs text-(--text) mt-1">
              {t('fodmap_details.portion_note', { defaultValue: 'I valori FODMAP si riferiscono a questa porzione. Porzioni diverse possono cambiare il livello di tolleranza. La tolleranza è strettamente individuale.' })}
            </p>
          </div>

          {/* FODMAP Types Present */}
          <div>
            <h3 className="text-sm font-medium text-(--text-h) mb-3 flex items-center gap-2">
              <span aria-hidden="true">🧪</span>
              {t('fodmap_details.types_present', { defaultValue: 'Tipi di FODMAP presenti' })}
            </h3>
            <div className="space-y-2">
              {content.presentFodmaps.map((fodmap) => {
                const groupDetail = food.fodmapDetails?.[fodmap.key as keyof typeof food.fodmapDetails];
                return (
                <div key={fodmap.key} className="p-3 rounded-lg bg-(--code-bg) border border-(--border)">
                  <div className="flex items-start gap-3">
                    <span className="font-medium text-(--text-h) min-w-30">{t(`fodmap_details.${fodmap.key}`, { defaultValue: fodmap.label })}</span>
                    <div className="flex-1">
                      <p className="text-sm text-(--text)">{fodmap.description}</p>
                      {groupDetail && (
                        <p className="text-xs text-(--text-h) font-medium mt-1.5">
                          {t('fodmap_details.group_level', { defaultValue: 'Contributo di questo alimento' })}:{' '}
                          <span className={groupDetail.level === 'high' ? 'text-red-500' : groupDetail.level === 'medium' ? 'text-amber-500' : 'text-emerald-500'}>
                            {t(`fodmap_details.tolerance_${groupDetail.level}`, { defaultValue: groupDetail.level })}
                          </span>
                          {groupDetail.thresholdGrams !== undefined && (
                            <span className="text-(--text)">
                              {' · '}{t('fodmap_details.threshold_value', { defaultValue: 'soglia' })} {groupDetail.thresholdGrams} g
                            </span>
                          )}
                        </p>
                      )}
                      {groupDetail?.portionDependent && (
                        <p className="text-[11px] text-(--text) italic mt-1">
                          {t('fodmap_details.portion_dependent', { defaultValue: 'Valore dipendente dalla porzione: la classificazione può cambiare aumentando o riducendo la quantità.' })}
                        </p>
                      )}
                      {food.triggerGroup && fodmap.key === (food.triggerGroup === 'Fruttani' ? 'fructans' : food.triggerGroup === 'Galattani' ? 'galactans' : food.triggerGroup === 'Lattosio' ? 'lactose' : food.triggerGroup === 'Fruttosio' ? 'fructose' : 'sorbitol') && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-(--accent)/10 text-(--accent) rounded">
                          {t('fodmap_details.primary_trigger', { defaultValue: 'Trigger principale per questo alimento' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* Tolerance Level */}
          <div className="p-4 rounded-xl border border-(--border) bg-(--code-bg)">
            <h3 className="text-sm font-medium text-(--text-h) mb-3 flex items-center gap-2">
              <span aria-hidden="true">⚖️</span>
              {t('fodmap_details.tolerance_level', { defaultValue: 'Livello di tolleranza' })}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                content.toleranceLevel.level === 'high'
                  ? 'bg-red-500/20 text-red-500'
                  : content.toleranceLevel.level === 'medium'
                    ? 'bg-amber-500/20 text-amber-500'
                    : 'bg-emerald-500/20 text-emerald-500'
              }`}>
                {t(`fodmap_details.tolerance_${content.toleranceLevel.level}`, { defaultValue: content.toleranceLevel.label })}
              </span>
              <span className="text-sm text-(--text)">{content.toleranceLevel.description}</span>
            </div>
            <p className="text-xs text-(--text) mt-3">
              {t('fodmap_details.individual_tolerance', { defaultValue: 'La tolleranza è individuale: anche fra persone con lo stesso IBS la reazione può essere diversa. La porzione può cambiare la classificazione.' })}
            </p>
          </div>

          {/* Detailed FODMAP amounts if available */}
          {(food.microDetails || food.fodmapDetails) && (
            <div>
              <h3 className="text-sm font-medium text-(--text-h) mb-3 flex items-center gap-2">
                <span aria-hidden="true">📊</span>
                {t('fodmap_details.quantities', { defaultValue: 'Quantità per porzione standard' })}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.presentFodmaps.map((fodmap) => {
                  // Estimate FODMAP content based on food data
                  const estimatedAmount = estimateFodmapAmount(food, fodmap.key, content.standardPortion.amount);
                  if (estimatedAmount === null) return null;
                  
                  return (
                    <div key={fodmap.key} className="p-3 rounded-lg bg-(--bg) border border-(--border)">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-(--text-h)">{t(`fodmap_details.${fodmap.key}`, { defaultValue: fodmap.label })}</span>
                        <span className="text-lg font-bold text-(--accent)">{estimatedAmount} g</span>
                      </div>
                      <div className="mt-1 h-2 bg-(--border) rounded-full overflow-hidden">
                        <div
                          className="h-full bg-(--accent) transition-all"
                          style={{ width: `${Math.min(estimatedAmount / 5 * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-(--text) mt-1">
                        {getFodmapThresholdNote(fodmap.key, estimatedAmount, t)}
                      </p>
                      {food.fodmapDetails && food.fodmapDetails[fodmap.key as keyof typeof food.fodmapDetails]?.sourceOrNote && (
                        <p className="text-[11px] text-(--text) italic mt-1.5 border-t border-(--border) pt-1">
                          ℹ️ {food.fodmapDetails[fodmap.key as keyof typeof food.fodmapDetails]?.sourceOrNote}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Alternatives */}
          {food.alternative && (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <h3 className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
                <span aria-hidden="true">💡</span>
                {t('fodmap_details.alternatives', { defaultValue: 'Alternative a basso FODMAP' })}
              </h3>
              <p className="text-sm text-(--text)">{t(`foods.${food.id}.alt`)}</p>
            </div>
          )}

          {/* Seasonality */}
          {food.months && (
            <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border)">
              <h3 className="text-sm font-medium text-(--text-h) mb-2 flex items-center gap-2">
                <span aria-hidden="true">📅</span>
                {t('fodmap_details.seasonality', { defaultValue: 'Stagionalità' })}
              </h3>
              <p className="text-sm text-(--text)">
                {t('fodmap_details.available_months', { defaultValue: 'Disponibile fresco nei mesi:' })} 
                {food.months.map(m => t(`months.${['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'][m-1]}`)).join(', ')}
              </p>
            </div>
          )}

          {/* Nutritional info per portion */}
          <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border)">
            <h3 className="text-sm font-medium text-(--text-h) mb-3 flex items-center gap-2">
              <span aria-hidden="true">🥗</span>
              {t('fodmap_details.nutrition_per_portion', { defaultValue: 'Valori nutrizionali per porzione standard' })}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded bg-(--bg) border border-(--border)">
                <p className="text-xs text-(--text)">{t('macro_kcal', { defaultValue: 'kcal' })}</p>
                <p className="font-bold text-(--text-h)">{Math.round(food.nutrition.kcal * content.standardPortion.amount / 100)}</p>
              </div>
              <div className="p-2 rounded bg-(--bg) border border-(--border)">
                <p className="text-xs text-(--text)">{t('macro_p', { defaultValue: 'Proteine' })}</p>
                <p className="font-bold text-(--text-h)">{Math.round(food.nutrition.protein * content.standardPortion.amount / 100 * 10) / 10}g</p>
              </div>
              <div className="p-2 rounded bg-(--bg) border border-(--border)">
                <p className="text-xs text-(--text)">{t('macro_c', { defaultValue: 'Carboidrati' })}</p>
                <p className="font-bold text-(--text-h)">{Math.round(food.nutrition.carbs * content.standardPortion.amount / 100 * 10) / 10}g</p>
              </div>
              <div className="p-2 rounded bg-(--bg) border border-(--border)">
                <p className="text-xs text-(--text)">{t('macro_f', { defaultValue: 'Grassi' })}</p>
                <p className="font-bold text-(--text-h)">{Math.round(food.nutrition.fats * content.standardPortion.amount / 100 * 10) / 10}g</p>
              </div>
              <div className="p-2 rounded bg-(--bg) border border-(--border)">
                <p className="text-xs text-(--text)">{t('macro_fib', { defaultValue: 'Fibre' })}</p>
                <p className="font-bold text-(--text-h)">{Math.round(food.nutrition.fiber * content.standardPortion.amount / 100 * 10) / 10}g</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function estimateFodmapAmount(food: FoodItem, fodmapKey: string, portionAmount: number): number | null {
  if (food.fodmapDetails && fodmapKey in food.fodmapDetails) {
    const detail = food.fodmapDetails[fodmapKey as keyof typeof food.fodmapDetails];
    if (detail && detail.amountGrams !== undefined) {
      const basePortion = STANDARD_PORTIONS[food.id]?.amount || 100;
      return Math.round(detail.amountGrams * portionAmount / basePortion * 10) / 10;
    }
  }
  // Rough estimates based on Monash University data and food composition
  // These are approximate values for the standard portion
  const estimates: Record<string, Record<string, number>> = {
    '1': { fructans: 1.2 }, // Pane frumento
    '2': {}, // Riso - low FODMAP
    '3': { fructans: 0.3 }, // Avena
    '4': { fructans: 2.5 }, // Aglio/Cipolla
    '5': {}, // Zucchine - low
    '6': {}, // Carote - low
    '7': { fructans: 1.8 }, // Carciofi
    '8': { fructose: 3.2 }, // Mele/Pere
    '9': {}, // Fragole - low
    '10': { sorbitol: 1.5, mannitol: 0.8 }, // Anguria
    '11': { lactose: 4.8 }, // Latte
    '12': { lactose: 0.1 }, // Parmigiano - very low
    '13': {}, // Uova/Carne - none
    '14': { galactans: 3.5 }, // Legumi
    '15': {}, // Quinoa - low
    '16': {}, // Mais - low
    '17': {}, // Grano saraceno - low
    '18': {}, // Pane GF - low
    '19': {}, // Spinaci - low
    '20': { mannitol: 0.4 }, // Finocchio
    '21': {}, // Peperoni - low
    '22': {}, // Pomodori - low
    '23': { mannitol: 1.2 }, // Cavolfiore
    '24': {}, // Patate - low
    '25': {}, // Zucca - low
    '26': {}, // Melanzane - low
    '27': {}, // Arance - low
    '28': {}, // Kiwi - low
    '29': {}, // Banana - low
    '30': {}, // Melone - low
    '31': {}, // Ananas - low
    '32': { sorbitol: 1.8 }, // Ciliegie
    '33': {}, // Pollo - none
    '34': {}, // Pesce - none
    '35': {}, // Tofu - low
    '36': { lactose: 0.5 }, // Yogurt greco delattosato
    '37': {}, // Olio - none
    '38': { sorbitol: 0.3 }, // Mandorle
    '39': {}, // Semi chia - low
    '40': {}, // Semi zucca - low
    '41': { lactose: 0.2 }, // Cioccolato
    '42': { fructose: 2.1 }, // Miele
    '43': {}, // Sciroppo acero - low
    '44': {}, // Zenzero - low
    '45': {}, // Shirataki - none
    '46': { fructans: 1.5 }, // Farro
    '47': { mannitol: 0.5 }, // Broccoli
    '48': { fructans: 1.2 }, // Asparagi
    '49': {}, // Cetrioli - low
    '50': {}, // Rucola - low
    '51': {}, // Barbabietola - low
    '52': {}, // Papaia - low
    '53': {}, // Lamponi - low
    '54': { fructose: 4.2 }, // Prugne secche
    '55': {}, // Uva - low
    '56': { lactose: 2.1 }, // Mozzarella bufala
    '57': {}, // Tempeh - low
    '58': {}, // Manzo - none
    '59': {}, // Aceto - none
    '60': {}, // Curcuma - none
    '61': {}, // Senape - low
    '62': {}, // Caffè - none
    '63': {}, // Tè - none
    '64': {}, // Camomilla - none
    '65': {}, // Acqua - none
    '66': { fructans: 0.3 }, // Latte avena
    '67': { lactose: 0.05 }, // Ghee
    '68': { sorbitol: 0.2 }, // Noci
  };

  const foodEstimates = estimates[food.id];
  if (!foodEstimates || !(fodmapKey in foodEstimates)) return null;
  
  // Scale to standard portion
  const baseAmount = foodEstimates[fodmapKey];
  const basePortion = STANDARD_PORTIONS[food.id]?.amount || 100;
  return Math.round(baseAmount * portionAmount / basePortion * 10) / 10;
}

function getFodmapThresholdNote(fodmapKey: string, amount: number, t: (key: string, options?: { defaultValue?: string }) => string): string {
  const thresholds: Record<string, { low: number; medium: number }> = {
    fructans: { low: 0.3, medium: 1.0 },
    galactans: { low: 0.3, medium: 1.0 },
    lactose: { low: 1.0, medium: 4.0 },
    fructose: { low: 0.5, medium: 2.0 },
    sorbitol: { low: 0.5, medium: 2.0 },
    mannitol: { low: 0.5, medium: 2.0 },
  };

  const threshold = thresholds[fodmapKey];
  if (!threshold) return '';

  if (amount <= threshold.low) {
    return t('fodmap_details.threshold_low', { defaultValue: 'Sotto la soglia di tolleranza per la maggior parte delle persone' });
  } else if (amount <= threshold.medium) {
    return t('fodmap_details.threshold_medium', { defaultValue: 'Nella fascia media - testare tolleranza individuale' });
  } else {
    return t('fodmap_details.threshold_high', { defaultValue: 'Sopra la soglia - probabile scatenante sintomi' });
  }
}