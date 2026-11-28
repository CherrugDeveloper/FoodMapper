import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../hooks/useToast';
import { navigateTo } from '../../utils/navigation';
import { RECIPES_DATABASE } from '../../utils/recipesData';
import { formatMealForCopy, formatNum, getUnitDisplay, cleanFoodName, formatPortionDisplay } from '../../utils/mealCopyFormatter';
import type { MealPortion, GeneratedMeal, MealKey, DietPhase, Recipe } from '../../types/dietPlan';

interface MealCardProps {
  meal: GeneratedMeal;
  onConfirm: () => void;
  onUnconfirm?: () => void;
  onModify: (modifications: Partial<MealPortion>[]) => void;
  isConfirming: boolean;
  isModifying: boolean;
  onConfirmed?: () => void;
  phase?: DietPhase;
  id?: string;
}

export function MealCard({
  meal,
  onConfirm,
  onUnconfirm,
  onModify,
  isConfirming,
  isModifying,
  onConfirmed,
  phase,
  id
}: MealCardProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPortions, setEditedPortions] = useState<Partial<MealPortion>[]>([]);
  const [localIsConfirming, setLocalIsConfirming] = useState(false);
  const effectiveIsConfirming = isConfirming || localIsConfirming;

  // Day name mapping for copy operation (consistente con DietPlan.tsx dayNameMap)
  const MEAL_DISPLAY_NAMES: Record<MealKey, string> = {
    colazione: 'Colazione',
    spuntinoMattina: 'Spuntino Mattina',
    pranzo: 'Pranzo',
    spuntinoPomeriggio: 'Spuntino Pomeriggio',
    spuntino: 'Spuntino',
    spuntinoSera: 'Spuntino Sera',
    cena: 'Cena'
  };

  // Find a recipe matching the meal type and ingredients
  // Requirement: ALL recipe ingredients must be in the meal (recipe ⊆ meal)
  // Not all meal ingredients need to be in the recipe
  const findMatchingRecipe = (mealKey: MealKey, portions?: MealPortion[]) => {
    const mealPortions = portions ?? meal.portions;
    
    // Get the set of ingredient names from the meal (food names, excluding unit/gram info)
    const mealIngredientNames = new Set(
      mealPortions.map(p => p.foodName.toLowerCase().trim())
    );
    
    // Filter recipes that match the meal type
    const matchingRecipes = RECIPES_DATABASE.filter(
      recipe => recipe.mealType === mealKey
    );
    
    if (matchingRecipes.length === 0) {
      return null;
    }
    
    // Score each recipe based on ingredient overlap
    const scoredRecipes = matchingRecipes.map(recipe => {
      const recipeIngredientNames = new Set(
        recipe.portions.map(p => p.foodName.toLowerCase().trim())
      );
      
      // Check if ALL recipe ingredients are in the meal (recipe ⊆ meal)
      let recipeIngredientsInMeal = 0;
      recipeIngredientNames.forEach(recipeIng => {
        if (mealIngredientNames.has(recipeIng)) {
          recipeIngredientsInMeal++;
        }
      });
      
      const recipeIngredientCount = recipeIngredientNames.size;
      const recipePurity = recipeIngredientCount > 0 ? recipeIngredientsInMeal / recipeIngredientCount : 1;
      
      // A good match requires ALL recipe ingredients to be in the meal (purity = 1.0)
      // Meal coverage is not required - the recipe can be a subset of the meal
      const isGoodMatch = recipePurity >= 1.0;
      
      // For scoring among good matches, prefer recipes that cover more meal ingredients
      let overlapCount = 0;
      mealIngredientNames.forEach(mealIng => {
        if (recipeIngredientNames.has(mealIng)) {
          overlapCount++;
        }
      });
      
      return {
        recipe,
        score: overlapCount, // Prefer recipes covering more meal ingredients
        mealCoverage: mealIngredientNames.size > 0 ? overlapCount / mealIngredientNames.size : 0,
        recipePurity,
        isGoodMatch
      };
    });
    
    // Sort by score (highest first) and return the best match
    scoredRecipes.sort((a, b) => b.score - a.score);
    
    // Return the best matching recipe if it's a good match, otherwise null
    // This will cause fall-through to findOrCreateRecipeForMeal
    const best = scoredRecipes[0];
    return best && best.isGoodMatch ? best.recipe : null;
  };

  // Genera il nome della ricetta dal pasto - nomi creativi basati su tipo pasto e ingredienti
  const generateRecipeName = (mealKey: MealKey, portions: MealPortion[]): string => {
    // Estrai nomi ingredienti puliti, escludendo condimenti
    const condimentKeywords = ['olio', 'sale', 'spezie', 'pepe', 'curcuma', 'zenzero', 'curry', 'paprika', 'origano', 'basilico', 'prezzemolo', 'rosmarino', 'salvia', 'menta', 'timo', 'alloro', 'cannella', 'vaniglia', 'limone', 'aceto'];
    const mainIngredients = portions
      .filter(p => {
        const lower = p.foodName.toLowerCase();
        return !condimentKeywords.some(k => lower.includes(k));
      })
      .map(p => cleanFoodName(p.foodName).toLowerCase());

    if (mainIngredients.length === 0) {
      return `${mealKey.charAt(0).toUpperCase() + mealKey.slice(1)}: Piatto misto`;
    }

    // Identifica categorie principali
    const hasEggs = mainIngredients.some(i => i.includes('uova') || i.includes('uovo'));
    const hasChicken = mainIngredients.some(i => i.includes('pollo') || i.includes('petto') || i.includes('tacchino'));
    const hasFish = mainIngredients.some(i => i.includes('pesce') || i.includes('branzino') || i.includes('salmone') || i.includes('merluzz') || i.includes('tonno') || i.includes('sgombro'));
    const hasPotatoes = mainIngredients.some(i => i.includes('patat'));
    const hasRice = mainIngredients.some(i => i.includes('riso'));
    const hasPasta = mainIngredients.some(i => i.includes('pasta') || i.includes('spaghetti') || i.includes('penne') || i.includes('fusilli') || i.includes('farfalle'));
    const hasBread = mainIngredients.some(i => i.includes('pane') || i.includes('gallette') || i.includes('cracker') || i.includes('fette biscottate'));
    const hasLegumes = mainIngredients.some(i => i.includes('ceci') || i.includes('lenticch') || i.includes('fagiol') || i.includes('legumin'));
    const hasTofu = mainIngredients.some(i => i.includes('tofu') || i.includes('tempeh'));
    const hasVeggies = mainIngredients.some(i => i.includes('zucchin') || i.includes('melanzan') || i.includes('peperon') || i.includes('pomodor') || i.includes('spinac') || i.includes('rucola') || i.includes('lattuga') || i.includes('carot') || i.includes('broccol') || i.includes('finocch'));
    const hasFruit = mainIngredients.some(i => i.includes('aranc') || i.includes('mela') || i.includes('pera') || i.includes('fragol') || i.includes('mirtill') || i.includes('lampon') || i.includes('kiwi') || i.includes('pesca') || i.includes('albicocc') || i.includes('melone') || i.includes('anguria') || i.includes('uva') || i.includes('mandar'));
    const hasNuts = mainIngredients.some(i => i.includes('mandorl') || i.includes('noci') || i.includes('nocciol') || i.includes('anacard') || i.includes('pistacch'));
    const hasSeeds = mainIngredients.some(i => i.includes('semi') || i.includes('chia') || i.includes('lino') || i.includes('zucca') || i.includes('girasol'));
    const hasOats = mainIngredients.some(i => i.includes('avena') || i.includes('fiocchi') || i.includes('crusca') || i.includes('muesli') || i.includes('granola'));
    const hasYogurt = mainIngredients.some(i => i.includes('yogurt'));

    // Nomi creativi per COLAZIONE
    if (mealKey === 'colazione') {
      if (hasEggs && hasBread && hasVeggies) return 'Frittata di verdure con pane tostato';
      if (hasEggs && hasPotatoes) return 'Frittata di patate';
      if (hasEggs && hasVeggies) return 'Uova strapazzate alle verdure';
      if (hasEggs && hasBread) return 'Uova con pane tostato';
      if (hasEggs) return 'Uova alla coque con contorno';
      if (hasOats && hasFruit && (hasNuts || hasSeeds)) return 'Porridge di avena con frutta e frutta secca';
      if (hasOats && hasFruit) return 'Porridge di avena con frutta fresca';
      if (hasOats && (hasNuts || hasSeeds)) return 'Porridge di avena con frutta secca';
      if (hasOats) return 'Porridge di avena';
      if (hasYogurt && hasFruit && (hasNuts || hasSeeds)) return 'Yogurt con frutta e granola';
      if (hasYogurt && hasFruit) return 'Yogurt con frutta fresca';
      if (hasYogurt && (hasNuts || hasSeeds)) return 'Yogurt con frutta secca';
      if (hasYogurt) return 'Yogurt con cereali';
      if (hasBread && hasFruit && (hasNuts || hasSeeds)) return 'Pane tostato con frutta e crema di frutta secca';
      if (hasBread && hasFruit) return 'Pane tostato con confettura e frutta';
      if (hasBread && (hasNuts || hasSeeds)) return 'Pane tostato con crema di frutta secca';
      if (hasBread) return 'Pane tostato con burro';
      if (hasFruit && (hasNuts || hasSeeds)) return 'Macedonia con frutta secca';
      if (hasFruit) return 'Frutta fresca di stagione';
    }

    // Nomi creativi per SPUNTINI
    if (mealKey.includes('spuntino')) {
      if (hasFruit && (hasNuts || hasSeeds)) return 'Spuntino: Frutta fresca con frutta secca';
      if (hasFruit && hasYogurt) return 'Spuntino: Frutta con yogurt';
      if (hasBread && hasFruit && (hasNuts || hasSeeds)) return 'Spuntino: Gallette con crema di frutta secca';
      if (hasBread && hasFruit) return 'Spuntino: Gallette con frutta';
      if (hasNuts || hasSeeds) return 'Spuntino: Mix di frutta secca';
      if (hasFruit) return 'Spuntino: Frutta di stagione';
      if (hasYogurt) return 'Spuntino: Yogurt';
      if (hasBread) return 'Spuntino: Gallette di riso';
    }

    // Nomi creativi per PRANZO
    if (mealKey === 'pranzo') {
      if (hasPasta && hasFish && hasVeggies) return 'Pasta con pesce e verdure';
      if (hasPasta && hasChicken && hasVeggies) return 'Pasta con pollo e verdure';
      if (hasPasta && hasLegumes && hasVeggies) return 'Pasta e legumi con verdure';
      if (hasPasta && hasVeggies) return 'Pasta alle verdure';
      if (hasPasta && hasFish) return 'Pasta al pesce';
      if (hasPasta && hasChicken) return 'Pasta al pollo';
      if (hasPasta && hasLegumes) return 'Pasta e legumi';
      if (hasPasta) return 'Pasta al sugo';
      if (hasRice && hasFish && hasVeggies) return 'Risotto di pesce con verdure';
      if (hasRice && hasChicken && hasVeggies) return 'Riso con pollo e verdure';
      if (hasRice && hasLegumes && hasVeggies) return 'Riso e legumi con verdure';
      if (hasRice && hasVeggies) return 'Risotto alle verdure';
      if (hasRice && hasFish) return 'Riso al pesce';
      if (hasRice && hasChicken) return 'Riso con pollo';
      if (hasRice && hasLegumes) return 'Riso e legumi';
      if (hasRice) return 'Riso in bianco';
      if (hasChicken && hasPotatoes && hasVeggies) return 'Pollo arrosto con patate e verdure';
      if (hasChicken && hasPotatoes) return 'Pollo con patate al forno';
      if (hasChicken && hasVeggies) return 'Pollo alle verdure';
      if (hasChicken && hasRice) return 'Pollo con riso';
      if (hasChicken) return 'Petto di pollo alla piastra';
      if (hasFish && hasPotatoes && hasVeggies) return 'Pesce al forno con patate e verdure';
      if (hasFish && hasPotatoes) return 'Pesce con patate';
      if (hasFish && hasVeggies) return 'Pesce alle verdure';
      if (hasFish && hasRice) return 'Pesce con riso';
      if (hasTofu && hasVeggies && hasRice) return 'Tofu saltato con verdure e riso';
      if (hasTofu && hasVeggies) return 'Tofu alle verdure';
      if (hasLegumes && hasVeggies && hasRice) return 'Legumi con verdure e riso';
      if (hasLegumes && hasVeggies) return 'Zuppa di legumi e verdure';
      if (hasLegumes && hasRice) return 'Riso e legumi';
      if (hasLegumes) return 'Legumi in umido';
      if (hasVeggies && hasBread) return 'Verdure grigliate con pane';
      if (hasVeggies) return 'Verdure miste saltate';
    }

    // Nomi creativi per CENA
    if (mealKey === 'cena') {
      if (hasFish && hasVeggies && hasPotatoes) return 'Pesce al forno con patate e verdure';
      if (hasFish && hasVeggies) return 'Pesce alle verdure';
      if (hasFish && hasPotatoes) return 'Pesce con patate';
      if (hasFish) return 'Pesce al vapore con limone';
      if (hasChicken && hasVeggies && hasPotatoes) return 'Pollo al forno con patate e verdure';
      if (hasChicken && hasVeggies) return 'Pollo alle verdure';
      if (hasChicken && hasPotatoes) return 'Pollo con patate';
      if (hasChicken) return 'Petto di pollo alla piastra';
      if (hasTofu && hasVeggies) return 'Tofu saltato con verdure';
      if (hasLegumes && hasVeggies) return 'Vellutata di legumi e verdure';
      if (hasEggs && hasVeggies) return 'Frittata di verdure';
      if (hasEggs && hasPotatoes) return 'Frittata di patate';
      if (hasVeggies && hasBread) return 'Verdure grigliate con pane';
      if (hasVeggies) return 'Verdure miste al vapore';
      if (hasPotatoes) return 'Patate al forno';
    }

    // Fallback generico ma più descrittivo
    const primary = mainIngredients[0];
    const others = mainIngredients.slice(1, 3);
    if (others.length > 0) {
      return `${primary.charAt(0).toUpperCase() + primary.slice(1)} con ${others.join(' e ')}`;
    }
    return `${primary.charAt(0).toUpperCase() + primary.slice(1)}`;
  };

  // Genera istruzioni specifiche e coese per gli ingredienti del pasto
  const generateInstructions = (mealKey: MealKey, portions: MealPortion[]): string[] => {
    const steps: string[] = [];
    const lowerNames = portions.map(p => p.foodName.toLowerCase());
    const isBreakfast = mealKey === 'colazione';
    const isSnack = mealKey.includes('spuntino');
    const isMainMeal = mealKey === 'pranzo' || mealKey === 'cena';

    // Identifica cosa c'è nel pasto
    const hasEggs = lowerNames.some(n => n.includes('uova') || n.includes('uovo'));
    const hasChicken = lowerNames.some(n => n.includes('pollo') || n.includes('petto') || n.includes('tacchino'));
    const hasFish = lowerNames.some(n => n.includes('pesce') || n.includes('branzino') || n.includes('salmone') || n.includes('merluzz') || n.includes('tonno') || n.includes('sgombro'));
    const hasPotatoes = lowerNames.some(n => n.includes('patat'));
    const hasRice = lowerNames.some(n => n.includes('riso'));
    const hasPasta = lowerNames.some(n => n.includes('pasta') || n.includes('spaghetti') || n.includes('penne') || n.includes('fusilli') || n.includes('farfalle'));
    const hasBread = lowerNames.some(n => n.includes('pane') || n.includes('gallette') || n.includes('cracker') || n.includes('fette biscottate'));
    const hasLegumes = lowerNames.some(n => n.includes('ceci') || n.includes('lenticch') || n.includes('fagiol') || n.includes('legumin'));
    const hasTofu = lowerNames.some(n => n.includes('tofu') || n.includes('tempeh'));
    const hasZucchini = lowerNames.some(n => n.includes('zucchin'));
    const hasEggplant = lowerNames.some(n => n.includes('melanzan'));
    const hasPeppers = lowerNames.some(n => n.includes('peperon'));
    const hasTomatoes = lowerNames.some(n => n.includes('pomodor') || n.includes('pomodoro'));
    const hasSpinach = lowerNames.some(n => n.includes('spinac'));
    const hasArugula = lowerNames.some(n => n.includes('rucola'));
    const hasLettuce = lowerNames.some(n => n.includes('lattuga') || n.includes('insalata'));
    const hasCarrots = lowerNames.some(n => n.includes('carot'));
    const hasBroccoli = lowerNames.some(n => n.includes('broccol') || n.includes('cavolfior'));
    const hasFennel = lowerNames.some(n => n.includes('finocch'));
    const hasBanana = lowerNames.some(n => n.includes('banana'));
    const hasOrange = lowerNames.some(n => n.includes('aranc'));
    const hasApple = lowerNames.some(n => n.includes('mela'));
    const hasPear = lowerNames.some(n => n.includes('pera'));
    const hasBerries = lowerNames.some(n => n.includes('fragol') || n.includes('mirtill') || n.includes('lampon'));
    const hasNuts = lowerNames.some(n => n.includes('mandorl') || n.includes('noci') || n.includes('nocciol') || n.includes('anacard') || n.includes('pistacch'));
    const hasSeeds = lowerNames.some(n => n.includes('semi') || n.includes('chia') || n.includes('lino') || n.includes('zucca') || n.includes('girasol'));
    const hasYogurt = lowerNames.some(n => n.includes('yogurt'));
    const hasOats = lowerNames.some(n => n.includes('avena') || n.includes('fiocchi') || n.includes('crusca') || n.includes('muesli') || n.includes('granola'));
    const hasOil = lowerNames.some(n => n.includes('olio'));
    const hasFruit = lowerNames.some(n => n.includes('banana') || n.includes('aranc') || n.includes('mela') || n.includes('pera') || n.includes('fragol') || n.includes('mirtill') || n.includes('lampon') || n.includes('kiwi') || n.includes('pesca') || n.includes('albicocc') || n.includes('melone') || n.includes('anguria') || n.includes('uva') || n.includes('mandar'));

    // COLAZIONE - Istruzioni specifiche
    if (isBreakfast) {
      if (hasEggs && hasPotatoes && (hasZucchini || hasSpinach || hasPeppers)) {
        // Frittata di verdure con patate
        steps.push('Pelare e tagliare le patate a cubetti piccoli; lavare e tagliare le verdure a dadini.');
        steps.push('In una padella antiaderente, cuocere le patate con un filo d\'olio per 10 minuti finché dorate; aggiungere le verdure e cuocere 5 minuti.');
        steps.push('Sbattere le uova con un pizzico di sale, versarle nella padella e cuocere a fuoco medio-basso per 8-10 minuti, coprendo con coperchio.');
        steps.push('Girare la frittata aiutandosi con un piatto o coperchio e cuocere dall\'altro lato 3-4 minuti.');
      } else if (hasEggs && hasPotatoes) {
        // Frittata di patate
        steps.push('Pelare e tagliare le patate a fette sottili o cubetti piccoli.');
        steps.push('Cuocere le patate in padella con un filo d\'olio per 10-12 minuti finché tenere e dorate.');
        steps.push('Sbattere le uova con sale, versarle sulle patate e cuocere la frittata 8-10 minuti coperta, poi girare e cuocere 3-4 minuti.');
      } else if (hasEggs && (hasZucchini || hasSpinach || hasPeppers || hasTomatoes)) {
        // Uova con verdure
        steps.push('Lavare e tagliare le verdure a cubetti o striscioline.');
        steps.push('Saltare le verdure in padella con un filo d\'olio per 5-7 minuti finché tenere.');
        steps.push('Sbattere le uova, versarle sulle verdure e strapazzare delicatamente a fuoco medio per 3-4 minuti.');
      } else if (hasEggs && hasBread) {
        // Uova con pane
        steps.push('Cuocere le uova secondo preferenza: sode (8-9 min), in camicia (3-4 min in acqua bollente con aceto), o strapazzate (3-4 min in padella).');
        steps.push('Tostare il pane in padella o tostapane finché dorato e croccante.');
        steps.push('Servire le uova con il pane tostato a lato.');
      } else if (hasEggs) {
        steps.push('Cuocere le uova secondo preferenza: sode (8-9 min in acqua bollente), in camicia (3-4 min), o strapazzate in padella antiaderente (3-4 min).');
      } else if (hasOats && (hasYogurt || hasBanana || hasBerries || hasNuts || hasSeeds)) {
        // Porridge
        steps.push('In un pentolino, cuocere i fiocchi d\'avena con acqua o latte per 5-7 minuti mescolando, finché cremosi.');
        const toppings = [];
        if (hasBanana) toppings.push('banana a fette');
        if (hasBerries) toppings.push('frutti di bosco');
        if (hasNuts) toppings.push('frutta secca tritata');
        if (hasSeeds) toppings.push('semi');
        if (toppings.length > 0) {
          steps.push(`Trasferire in una ciotola e guarnire con ${toppings.join(', ')}.`);
        }
        if (hasYogurt) steps.push('Aggiungere un cucchiaio di yogurt sopra per cremosità.');
      } else if (hasOats) {
        steps.push('Cuocere i fiocchi d\'avena con acqua o latte per 5-7 minuti mescolando, finché cremosi.');
      } else if (hasYogurt && (hasFruit || hasNuts || hasSeeds)) {
        // Yogurt con topping
        const toppings = [];
        if (hasBanana) toppings.push('banana a fette');
        if (hasApple || hasPear) toppings.push('mela/pera a cubetti');
        if (hasBerries) toppings.push('frutti di bosco');
        if (hasOrange) toppings.push('spicchi d\'arancia');
        if (hasNuts) toppings.push('frutta secca tritata');
        if (hasSeeds) toppings.push('semi');
        steps.push(`In una ciotola, versare lo yogurt e guarnire con ${toppings.join(', ')}.`);
      } else if (hasYogurt) {
        steps.push('Versare lo yogurt in una ciotola e gustare al naturale.');
      } else if (hasBread && (hasNuts || hasSeeds) && hasFruit) {
        // Pane con crema e frutta
        steps.push('Tostare il pane o le gallette finché croccanti.');
        steps.push('Spalmare la crema di frutta secca/semi sul pane tostato.');
        steps.push('Guarnire con fette di frutta fresca a piacere.');
      } else if (hasBread && hasNuts) {
        steps.push('Tostare il pane o le gallette e spalmare con crema di frutta secca.');
      } else if (hasBread && hasFruit) {
        steps.push('Tostare il pane e guarnire con fette di frutta fresca o confettura senza zucchero.');
      } else if (hasBread) {
        steps.push('Tostare il pane o le gallette e condire a piacere.');
      } else if (hasFruit && hasNuts) {
        steps.push('Lavare e tagliare la frutta a pezzi; unire la frutta secca e mescolare.');
      } else if (hasFruit) {
        steps.push('Lavare e tagliare la frutta a pezzi; servire in una ciotola.');
      }
    }

    // SPUNTINI - Istruzioni specifiche
    if (isSnack) {
      if (hasFruit && hasNuts) {
        steps.push('Lavare la frutta, tagliarla a pezzi e unire la frutta secca per uno spuntino bilanciato.');
      } else if (hasFruit && hasYogurt) {
        steps.push('Versare lo yogurt in una ciotola e aggiungere la frutta lavata e tagliata a pezzi.');
      } else if (hasBread && hasNuts) {
        steps.push('Spalmare la crema di frutta secca sulle gallette o fette di pane.');
      } else if (hasBread && hasFruit) {
        steps.push('Guarnire le gallette o il pane con fette di frutta fresca.');
      } else if (hasNuts) {
        steps.push('Porzionare la frutta secca in una ciotolina.');
      } else if (hasFruit) {
        steps.push('Lavare la frutta e gustarla intera o tagliata a pezzi.');
      } else if (hasYogurt) {
        steps.push('Versare lo yogurt in una ciotolina.');
      } else if (hasBread) {
        steps.push('Gustare le gallette o il pane nature o con un filo d\'olio.');
      }
    }

    // PRANZO/CENA - Istruzioni specifiche per piatti completi
    if (isMainMeal) {
      if (hasPasta && hasFish && (hasZucchini || hasTomatoes || hasSpinach)) {
        steps.push('Cuocere la pasta in abbondante acqua salata; nel frattempo, saltare il pesce a cubetti con le verdure in padella con olio e aglio per 8-10 minuti.');
        steps.push('Scolare la pasta al dente tenendo da parte acqua di cottura; mantecare in padella con il condimento aggiungendo acqua se serve.');
        steps.push('Servire con prezzemolo fresco e una macinata di pepe.');
      } else if (hasPasta && hasChicken && (hasZucchini || hasTomatoes || hasSpinach)) {
        steps.push('Tagliare il pollo a straccetti e cuocerlo in padella con olio per 6-8 minuti; aggiungere le verdure e cuocere 5-7 minuti.');
        steps.push('Cuocere la pasta, scolarla al dente e mantecare in padella con il condimento.');
      } else if (hasPasta && hasLegumes && (hasZucchini || hasTomatoes || hasSpinach)) {
        steps.push('Saltare le verdure in padella con olio e aglio; aggiungere i legumi sciacquati e scaldare 5 minuti.');
        steps.push('Cuocere la pasta, scolarla e mantecare con il condimento di legumi e verdure.');
      } else if (hasPasta && (hasZucchini || hasTomatoes || hasSpinach || hasPeppers || hasEggplant)) {
        steps.push('Lavare e tagliare le verdure; saltarle in padella con olio e aglio per 10-12 minuti finché tenere.');
        steps.push('Cuocere la pasta al dente, scolarla e mantecare in padella con le verdure aggiungendo acqua di cottura.');
        steps.push('Completare con formaggio grattugiato se tollerato e basilico fresco.');
      } else if (hasPasta && hasFish) {
        steps.push('Cuocere il pesce in padella con olio, aglio e prezzemolo per 8-10 minuti; sfumare con poco vino o limone.');
        steps.push('Cuocere la pasta, scolarla e mantecare con il sugo di pesce.');
      } else if (hasPasta && hasChicken) {
        steps.push('Tagliare il pollo a straccetti, cuocerlo in padella con olio e rosmarino per 8-10 minuti.');
        steps.push('Cuocere la pasta, scolarla e mantecare con il pollo e il suo fondo di cottura.');
      } else if (hasPasta && hasLegumes) {
        steps.push('Scaldare i legumi in padella con olio, aglio e rosmarino per 5-7 minuti.');
        steps.push('Cuocere la pasta, scolarla e mantecare con i legumi aggiungendo acqua di cottura.');
      } else if (hasPasta) {
        steps.push('Cuocere la pasta in abbondante acqua salata; condire con olio EVO, formaggio e pepe.');
      } else if (hasRice && hasFish && (hasZucchini || hasTomatoes || hasSpinach)) {
        steps.push('Cuocere il riso in acqua bollente salata per il tempo indicato; nel frattempo cuocere il pesce con le verdure in padella per 10 minuti.');
        steps.push('Unire il riso scolato al condimento in padella e mantecare 2 minuti.');
      } else if (hasRice && hasChicken && (hasZucchini || hasTomatoes || hasSpinach)) {
        steps.push('Tagliare il pollo a cubetti, rosolarlo in padella con olio per 6-8 minuti; aggiungere le verdure e cuocere 7-8 minuti.');
        steps.push('Cuocere il riso, scolarlo e saltarlo in padella con pollo e verdure per insaporire.');
      } else if (hasRice && hasLegumes && (hasZucchini || hasTomatoes || hasSpinach)) {
        steps.push('Preparare un soffritto con cipolla, carota, sedano; aggiungere le verdure a cubetti, i legumi e cuocere 10 minuti con brodo.');
        steps.push('Unire il riso e cuocere come un risotto aggiungendo brodo caldo poco alla volta per 15-18 minuti.');
      } else if (hasRice && (hasZucchini || hasTomatoes || hasSpinach || hasPeppers)) {
        steps.push('Saltare le verdure in padella con olio per 10 minuti; unire il riso lessato e mantecare 2-3 minuti.');
      } else if (hasRice && hasFish) {
        steps.push('Cuocere il pesce al vapore o in padella con limone e prezzemolo per 8-10 minuti.');
        steps.push('Servire il pesce su letto di riso lessato condito con olio e prezzemolo.');
      } else if (hasRice && hasChicken) {
        steps.push('Cuocere il pollo in padella con olio e spezie per 8-10 minuti; servire con riso lessato.');
      } else if (hasRice && hasLegumes) {
        steps.push('Cuocere riso e legumi separatamente; unire in padella con olio e rosmarino per insaporire 3 minuti.');
      } else if (hasRice) {
        steps.push('Lessare il riso in acqua salata per il tempo indicato; condire con olio EVO.');
      } else if (hasChicken && hasPotatoes && (hasZucchini || hasTomatoes || hasPeppers || hasCarrots)) {
        steps.push('Tagliare patate e verdure a cubetti; disporre su teglia con pollo a pezzi, olio, rosmarino, sale; infornare a 200°C per 35-40 minuti.');
      } else if (hasChicken && hasPotatoes) {
        steps.push('Tagliare le patate a spicchi; disporre su teglia con il pollo, olio, rosmarino, sale; infornare a 200°C per 35-40 minuti finché dorato.');
      } else if (hasChicken && (hasZucchini || hasTomatoes || hasSpinach || hasPeppers)) {
        steps.push('Tagliare il pollo a straccetti e le verdure a pezzi; saltare tutto in padella con olio e aglio per 12-15 minuti finché cotto.');
      } else if (hasChicken) {
        steps.push('Cuocere il petto di pollo in padella antiaderente con un filo d\'olio per 6-8 minuti per lato, finché ben cotto all\'interno.');
      } else if (hasFish && hasPotatoes && (hasZucchini || hasTomatoes || hasPeppers)) {
        steps.push('Disporre filetti di pesce, patate a fette e verdure su teglia; condire con olio, limone, prezzemolo, sale; infornare a 180°C per 20-25 minuti.');
      } else if (hasFish && hasPotatoes) {
        steps.push('Cuocere le patate al forno a 200°C per 25 minuti; aggiungere il pesce negli ultimi 15 minuti con olio, limone, prezzemolo.');
      } else if (hasFish && (hasZucchini || hasTomatoes || hasSpinach || hasPeppers)) {
        steps.push('Saltare le verdure in padella con olio per 8 minuti; adagiare il pesce sopra, coprire e cuocere 8-10 minuti a fuoco medio-basso.');
      } else if (hasFish) {
        steps.push('Cuocere il pesce al vapore per 10-12 minuti o in padella con olio, limone e prezzemolo per 8-10 minuti.');
      } else if (hasTofu && (hasZucchini || hasTomatoes || hasSpinach || hasPeppers)) {
        steps.push('Tagliare il tofu a cubetti, passarlo in poco amido di mais e dorarlo in padella con olio per 5-7 minuti; togliere e saltare le verdure nello stesso tegame, poi riunire tutto.');
      } else if (hasTofu) {
        steps.push('Tagliare il tofu a cubetti e dorarlo in padella con olio per 5-7 minuti.');
      } else if (hasLegumes && (hasZucchini || hasTomatoes || hasSpinach || hasCarrots || hasPotatoes)) {
        steps.push('Preparare un soffritto con cipolla, carota, sedano; aggiungere le verdure a cubetti e i legumi, coprire con brodo e cuocere 20-25 minuti per una zuppa densa.');
      } else if (hasLegumes) {
        steps.push('Scaldare i legumi in padella con olio, aglio, rosmarino e un goccio d\'acqua per 7-8 minuti; schiacciarne qualcuno per addensare.');
      } else if (hasPotatoes && (hasZucchini || hasTomatoes || hasPeppers || hasEggplant)) {
        steps.push('Tagliare patate e verdure a cubetti; cuocere in padella con olio e rosmarino per 20-25 minuti finché tenere e dorate, coprendo inizialmente.');
      } else if (hasPotatoes) {
        steps.push('Lessare o cuocere al vapore le patate per 15-20 minuti; condire con olio EVO, sale e rosmarino.');
      } else if (hasZucchini || hasEggplant || hasPeppers || hasTomatoes || hasSpinach || hasArugula || hasLettuce || hasCarrots || hasBroccoli || hasFennel) {
        // Solo verdure
        const veggies = [];
        if (hasZucchini) veggies.push('zucchine');
        if (hasEggplant) veggies.push('melanzane');
        if (hasPeppers) veggies.push('peperoni');
        if (hasTomatoes) veggies.push('pomodorini');
        if (hasSpinach) veggies.push('spinaci');
        if (hasArugula) veggies.push('rucola');
        if (hasLettuce) veggies.push('lattuga');
        if (hasCarrots) veggies.push('carote');
        if (hasBroccoli) veggies.push('broccoli');
        if (hasFennel) veggies.push('finocchi');
        
        if (hasSpinach || hasArugula || hasLettuce) {
          steps.push(`Lavare bene ${veggies.join(', ')}; tagliare le verdure da cuocere a pezzi e saltarle in padella con olio e aglio per 10 minuti; unire le verdure a foglia crude all'ultimo minuto.`);
        } else {
          steps.push(`Lavare e tagliare ${veggies.join(', ')} a pezzi; saltare in padella con olio, aglio e erbe aromatiche per 12-15 minuti finché tenere ma croccanti.`);
        }
      }
    }

    // Fallback generico se nessuna combinazione specifica matcha
    if (steps.length === 0) {
      const prepItems = [];
      lowerNames.forEach(name => {
        if (name.includes('zucchin') || name.includes('melanzan') || name.includes('peperon')) prepItems.push('lavare e tagliare le verdure a cubetti');
        else if (name.includes('pomodor')) prepItems.push('lavare e tagliare i pomodorini');
        else if (name.includes('spinac') || name.includes('rucola') || name.includes('lattuga')) prepItems.push('lavare bene la verdura a foglia');
        else if (name.includes('carot')) prepItems.push('pelare e grattugiare le carote');
        else if (name.includes('patat')) prepItems.push('pelare e tagliare le patate');
        else if (name.includes('banana')) prepItems.push('sbucciare la banana');
        else if (name.includes('aranc') || name.includes('mela') || name.includes('pera')) prepItems.push('lavare e tagliare la frutta');
        else if (name.includes('pane') || name.includes('gallette')) prepItems.push('tostare il pane');
      });
      if (prepItems.length > 0) {
        steps.push(prepItems.join('; ') + '.');
      } else {
        steps.push('Preparare tutti gli ingredienti pesandoli secondo le quantità indicate.');
      }

      const cookItems = [];
      if (hasEggs) cookItems.push('cuocere le uova secondo preferenza');
      if (hasChicken) cookItems.push('cuocere il pollo in padella 8-10 min per lato');
      if (hasFish) cookItems.push('cuocere il pesce al vapore o in padella 8-10 min');
      if (hasPotatoes) cookItems.push('lessare le patate 15-20 min');
      if (hasRice) cookItems.push('cuocere il riso in acqua bollente');
      if (hasPasta) cookItems.push('cuocere la pasta in abbondante acqua salata');
      if (hasTofu) cookItems.push('dorare il tofu in padella 5-7 min');
      if (hasLegumes) cookItems.push('scaldare i legumi in padella 5-7 min');
      if (cookItems.length > 0) {
        steps.push(cookItems.join('; ') + '.');
      }

      steps.push('Comporre il piatto unendo tutti gli ingredienti preparati.');
      if (!hasOil) steps.push('Condire con olio EVO, sale e spezie tollerate.');
      else steps.push('Regolare di sale e spezie a piacere.');
    }

    return steps;
  };

  // Find or create a recipe from meal ingredients
  const findOrCreateRecipeForMeal = useCallback((mealKey: MealKey, portions: MealPortion[]) => {
    // 1. Filtra ingredienti validi per ricetta
    // Si affida a filterPoolByMealSuitability in mealGenerator.ts per l'esclusione bulgur da colazione
    // (mealSuitability: 'lunch_dinner' definito in foodsData.ts line 263)
    const validPortions = portions.filter(p => p.grams > 0 || (p.unitValue !== undefined && p.unitValue > 0));

    if (validPortions.length === 0) return null;

    // 2. Cerca ricetta esistente in RECIPES_DATABASE che matchi
    const matchingRecipe = findMatchingRecipe(mealKey, validPortions);
    if (matchingRecipe) return matchingRecipe;

    // 3. Crea nuova ricetta "virtuale" dal pasto
    const recipeName = generateRecipeName(mealKey, validPortions);
    const newRecipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> = {
      name: recipeName,
      mealType: mealKey,
      servings: 1,
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      difficulty: 'easy',
      tags: ['auto-generated', 'from-meal'],
      isCustom: true,
      sourceDayIndex: -1,
      portions: validPortions.map(p => ({
        ...p,
        recipeId: `meal-${mealKey}-${Date.now()}`
      })),
      instructions: generateInstructions(mealKey, validPortions),
    };

    return newRecipe;
  }, []);

  // Derived values from meal - defined before callbacks that use them
  const mealDisplayName = MEAL_DISPLAY_NAMES[meal.key] || meal.key;

  // Find or create the recipe for the current meal to display its name
  const currentRecipe = useMemo(
    () => findOrCreateRecipeForMeal(meal.key as MealKey, meal.portions),
    [findOrCreateRecipeForMeal, meal.key, meal.portions]
  );
  const recipeDisplayName = currentRecipe?.name ?? mealDisplayName;

  const handleViewRecipe = useCallback((mealKey: MealKey) => {
    const recipe = findOrCreateRecipeForMeal(mealKey, meal.portions);
    if (recipe) {
      // Se è ricetta predefinita, naviga direttamente
      if (!recipe.isCustom) {
        const recipeIndex = RECIPES_DATABASE.findIndex(r => r.name === recipe.name && r.mealType === mealKey);
        if (recipeIndex !== -1) {
          const backRef = { source: 'mealCard' as const, targetId: `predefined-${recipeIndex}`, mealKey };
          localStorage.setItem('foodmapper_recipe_back_ref', JSON.stringify(backRef));
          navigateTo(`/recipes/predefined-${recipeIndex}`);
          return;
        }
      }

      // Se è ricetta custom/auto-generata, salva temporaneamente e naviga
      const tempRecipeId = `temp-${Date.now()}`;
      localStorage.setItem(`foodmapper_temp_recipe_${tempRecipeId}`, JSON.stringify(recipe));
      const backRef = { source: 'mealCard' as const, targetId: tempRecipeId, mealKey };
      localStorage.setItem('foodmapper_recipe_back_ref', JSON.stringify(backRef));
      navigateTo(`/recipes/${tempRecipeId}`);
    } else {
      localStorage.removeItem('foodmapper_recipe_back_ref');
      navigateTo('/recipes');
    }
  }, [navigateTo, meal.portions, meal.key]);

  // Navigate to the recipe only if the clicked ingredient is part of the current meal's recipe
  const handleViewIngredientRecipe = useCallback((foodName: string) => {
    const ingredientName = foodName.toLowerCase().trim();

    const recipe = currentRecipe;
    if (!recipe) return;

    const isPartOfRecipe = recipe.portions.some(portion => {
      const portionName = portion.foodName.toLowerCase().trim();
      // Exact match
      if (portionName === ingredientName) return true;
      // Partial match: ingredient is contained in portion name (e.g., "arancia" in "arancia rossa")
      if (portionName.includes(ingredientName) && ingredientName.length >= 3) return true;
      // Partial match: portion name is contained in ingredient (e.g., "mela" in "mela golden")
      if (ingredientName.includes(portionName) && portionName.length >= 3) return true;
      return false;
    });

    if (!isPartOfRecipe) return;

    // Navigate to the recipe
    if (!recipe.isCustom) {
      const recipeIndex = RECIPES_DATABASE.findIndex(r => r.name === recipe.name && r.mealType === recipe.mealType);
      if (recipeIndex !== -1) {
        // Store back navigation reference (for "Torna al pasto" button)
        const backRef = {
          source: 'mealCard' as const,
          targetId: `predefined-${recipeIndex}`,
          mealKey: meal.key as MealKey,
        };
        localStorage.setItem('foodmapper_recipe_back_ref', JSON.stringify(backRef));
        navigateTo(`/recipes/predefined-${recipeIndex}`);
      }
    } else {
      const tempRecipeId = `temp-${Date.now()}`;
      localStorage.setItem(`foodmapper_temp_recipe_${tempRecipeId}`, JSON.stringify(recipe));
      const backRef = {
        source: 'mealCard' as const,
        targetId: tempRecipeId,
        mealKey: meal.key as MealKey,
      };
      localStorage.setItem('foodmapper_recipe_back_ref', JSON.stringify(backRef));
      navigateTo(`/recipes/${tempRecipeId}`);
    }
  }, [navigateTo, meal.key, currentRecipe]);

  const handlePortionChange = useCallback((index: number, value: number) => {
    setEditedPortions(prev => {
      const newPortions = [...prev];
      if (!newPortions[index]) {
        newPortions[index] = {} as Partial<MealPortion>;
      }
      newPortions[index].grams = value;
      return newPortions;
    });
  }, []);

  const handleSaveEdits = useCallback(() => {
    onModify(editedPortions);
    setIsEditing(false);
  }, [editedPortions, onModify]);

  const handleCancelEdits = useCallback(() => {
    setIsEditing(false);
    setEditedPortions([]);
  }, []);

  const handleCopyMeal = useCallback(() => {
    const mealText = formatMealForCopy(meal, mealDisplayName, phase);

    navigator.clipboard.writeText(mealText).then(() => {
      showToast(t('diet_meal_copied', { defaultValue: 'Pasto copiato!' }), 'success');
    }).catch(() => {
      showToast(t('diet_meal_copy_error', { defaultValue: 'Errore nella copia' }), 'error');
    });
  }, [meal, mealDisplayName, phase, showToast, t]);

  return (
    <div id={id} className="p-5 sm:p-6 rounded-2xl border border-(--border) bg-(--code-bg) shadow-md transition-all hover:border-(--accent)/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 mb-4 border-b border-(--border)">
        <div className="flex items-center gap-2.5">
          <div
            onClick={() => handleViewRecipe(meal.key as MealKey)}
            className="cursor-pointer group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleViewRecipe(meal.key as MealKey); }}
            title={t('diet_view_recipe', { defaultValue: 'Visualizza ricetta' })}
          >
            <strong className="block text-base sm:text-lg font-bold text-(--text-h) group-hover:text-(--accent) group-hover:underline transition-colors">
              {recipeDisplayName}
            </strong>
            <span className="text-xs text-(--text) opacity-80">
              {meal.portions.length} {t('diet_ingredients_count', { defaultValue: 'ingredienti' })} • {t('diet_click_for_recipe', { defaultValue: 'Clicca per la ricetta' })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-(--accent) bg-(--accent)/10 px-3 py-1 rounded-full border border-(--accent)/20 shadow-2xs">
            {formatNum(meal.totalNutrition.calories)} {t('unit_calories')}
          </span>
          {meal.isConfirmed && (
            <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
              ✓ {t('diet_meal_confirmed', { defaultValue: 'Confermata' })}
            </span>
          )}
        </div>
      </div>
      
      {/* Portions / Ingredients List */}
      {!isEditing ? (
        <div className="space-y-2.5 mb-5">
          {meal.portions
            .filter(p => {
              // Escludi porzioni con grams = 0 e nessun unitValue valido
              if (p.grams === 0) {
                if (p.unitValue === undefined || p.unitValue === 0) return false;
              }
              // Per unità con unitValue = 0, escludi esplicitamente
              if (p.unitValue !== undefined && p.unitValue === 0) return false;
              // Escludi cucchiai con grammi = 0
              if (p.unit?.includes('cucchiai') && p.grams === 0) return false;
              return true;
            })
            .map((portion, i) => (
              <div key={i} className="p-3 rounded-xl bg-(--bg) border border-(--border) flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-2xs">
                <span className="flex items-center gap-2 text-sm font-medium text-(--text-h)">
                  {portion.reintroduced && (
                    <span title={t('diet_reintroduced')} className="cursor-help text-xs bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-bold">
                      ⚠️ {t('diet_reintroduced_short', { defaultValue: 'Reintrodotto' })}
                    </span>
                  )}
                  <span
                    onClick={() => handleViewIngredientRecipe(portion.foodName)}
                    className="cursor-pointer hover:text-(--accent) hover:underline"
                  >
                    {cleanFoodName(portion.foodName)}
                  </span>
                  {portion.testGroup && (
                    <span className="text-[11px] text-(--text) opacity-70 bg-(--code-bg) px-2 py-0.5 rounded-md border border-(--border)">
                      FODMAP: {t(`fodmap_${portion.testGroup}`)}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-(--text) font-semibold self-end sm:self-center">
                  <span className="px-2.5 py-1 rounded-lg bg-(--code-bg) border border-(--border) text-(--text-h)">
                    {formatPortionDisplay(portion, getUnitDisplay).amountStr}
                  </span>
                  <span className="opacity-70">
                    {formatNum(portion.nutrition.calories)} {t('unit_calories')}
                  </span>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="space-y-3 mb-5 p-4 rounded-xl bg-(--bg) border border-(--border)">
          <h4 className="text-xs font-bold text-(--text-h) uppercase tracking-wider mb-2">
            {t('diet_edit_portions', { defaultValue: 'Modifica Porzioni (grammi)' })}
          </h4>
          {meal.portions
            .filter(p => {
              // Escludi porzioni con grams = 0 e nessun unitValue valido
              if (p.grams === 0) {
                if (p.unitValue === undefined || p.unitValue === 0) return false;
              }
              // Per unità con unitValue = 0, escludi esplicitamente
              if (p.unitValue !== undefined && p.unitValue === 0) return false;
              // Escludi cucchiai con grammi = 0
              if (p.unit?.includes('cucchiai') && p.grams === 0) return false;
              return true;
            })
            .map((portion, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 pb-2 border-b border-(--border) last:border-b-0">
                <span className="flex-1 text-sm text-(--text-h) font-medium">
                  {portion.reintroduced && <span title={t('diet_reintroduced')} className="cursor-help text-xs">⚠️ </span>}
                  {cleanFoodName(portion.foodName)}
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="number"
                    min="1"
                    value={editedPortions[i]?.grams ?? portion.grams}
                    onChange={(e) => handlePortionChange(i, parseInt(e.target.value) || portion.grams)}
                    className="w-24 px-3 py-1.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) text-sm font-bold shadow-xs focus:ring-2 focus:ring-(--accent)"
                  />
                  <span className="text-xs text-(--text)">{t('unit_grams')}</span>
                </div>
              </div>
            ))}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={handleCancelEdits}
              className="px-4 py-2 rounded-xl bg-(--code-bg) border border-(--border) text-(--text) text-xs font-semibold hover:bg-(--accent)/10 transition cursor-pointer"
            >
              {t('diet_cancel')}
            </button>
            <button
              onClick={handleSaveEdits}
              className="px-4 py-2 rounded-xl bg-(--accent) text-white text-xs font-semibold hover:bg-(--accent-hover) transition shadow-sm cursor-pointer"
              disabled={isModifying}
            >
              {t('diet_save')}
            </button>
          </div>
        </div>
      )}
      
      {/* Nutritional Summary Footer */}
      <div className="p-3.5 rounded-xl bg-(--bg) border border-(--border) grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-4">
        <div className="flex flex-col">
          <span className="text-(--text) opacity-70">{t('diet_target_protein')}</span>
          <span className="font-bold text-(--text-h)">{formatNum(meal.totalNutrition.protein, 1)} {t('unit_grams')}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-(--text) opacity-70">{t('diet_target_carbs')}</span>
          <span className="font-bold text-(--text-h)">{formatNum(meal.totalNutrition.carbs, 1)} {t('unit_grams')}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-(--text) opacity-70">{t('diet_target_fats')}</span>
          <span className="font-bold text-(--text-h)">{formatNum(meal.totalNutrition.fat, 1)} {t('unit_grams')}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-(--text) opacity-70">{t('diet_fiber_short')}</span>
          <span className="font-bold text-(--text-h)">{formatNum(meal.totalNutrition.fiber, 1)} {t('unit_grams')}</span>
        </div>
        {(meal.totalNutrition.sugar > 0 || meal.totalNutrition.sodium > 0) && (
          <div className="col-span-2 sm:col-span-4 pt-2 border-t border-(--border) flex flex-wrap gap-4 text-[11px] text-(--text)">
            {meal.totalNutrition.sugar > 0 && (
              <span>🍬 {t('diet_sugar_short')}: {formatNum(meal.totalNutrition.sugar, 1)} {t('unit_grams')}</span>
            )}
            {meal.totalNutrition.sodium > 0 && (
              <span>🧂 {t('diet_sodium_short')}: {formatNum(meal.totalNutrition.sodium, 1)} {t('unit_milligrams')}</span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {!meal.isConfirmed && !effectiveIsConfirming ? (
          <button
            onClick={async () => {
              setLocalIsConfirming(true);
              try {
                await onConfirm();
                showToast(t('diet_meal_confirmed'), 'success');
                onConfirmed?.();
              } finally {
                setLocalIsConfirming(false);
              }
            }}
            disabled={effectiveIsConfirming}
            className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all text-xs sm:text-sm text-center shadow-sm cursor-pointer disabled:opacity-50"
          >
            ✓ {t('diet_confirm_meal')}
          </button>
        ) : meal.isConfirmed ? (
          <button
            onClick={() => onUnconfirm?.()}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-green-500/20 text-green-600 font-bold text-center border border-green-500/30 hover:bg-green-500/30 transition-colors cursor-pointer"
          >
            ↺ {t('diet_unconfirm_meal', { defaultValue: 'Annulla conferma' })}
          </button>
        ) : (
          <span className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-(--accent) text-white animate-pulse font-bold text-center">
            {t('diet_confirming')}
          </span>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMeal}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-(--bg) border border-(--border) text-(--text-h) text-xs sm:text-sm font-semibold hover:border-(--accent) hover:text-(--accent) transition-all flex items-center justify-center gap-1 cursor-pointer"
            aria-label={t('diet_copy_meal', { defaultValue: 'Copia pasto' })}
          >
            📋 {t('diet_copy', { defaultValue: 'Copia' })}
          </button>

          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditedPortions(meal.portions.map(p => ({ grams: p.grams })));
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-(--bg) border border-(--border) text-(--text-h) text-xs sm:text-sm font-semibold hover:border-(--accent) hover:text-(--accent) transition-all flex items-center justify-center gap-1 cursor-pointer"
              aria-label={t('diet_edit', { defaultValue: 'Modifica' })}
            >
              ✏️ {t('diet_edit', { defaultValue: 'Modifica' })}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
