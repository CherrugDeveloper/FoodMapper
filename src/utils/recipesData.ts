import type { Recipe, MealPortion } from '../types/dietPlan';
import { FOODS_DATABASE } from './foodsData';

/**
 * Helper function to create a MealPortion from a food item
 */
function createPortion(foodId: string, grams: number): MealPortion {
  const food = FOODS_DATABASE.find(f => f.id === foodId);
  if (!food) {
    throw new Error(`Food with id ${foodId} not found`);
  }
  const factor = grams / 100;
  return {
    foodId,
    foodName: food.name,
    grams,
    nutrition: {
      calories: Math.round(food.nutrition.kcal * factor),
      protein: Math.round(food.nutrition.protein * factor * 10) / 10,
      carbs: Math.round(food.nutrition.carbs * factor * 10) / 10,
      fat: Math.round(food.nutrition.fats * factor * 10) / 10,
      fiber: Math.round(food.nutrition.fiber * factor * 10) / 10,
      sugar: Math.round((food.nutrition.carbs * 0.1) * factor * 10) / 10, // estimated
      sodium: Math.round((food.nutrition.micronutrients?.sodium || 0) * factor * 10) / 10,
    },
    isConfirmed: false,
    isModified: false,
  };
}

/**
 * Database di ricette autentiche italiane/mediterranee bilanciate per IBS/FODMAP
 * Minimo 20 ricette con varietà di proteine, stagionalità, categorie
 */
export const RECIPES_DATABASE: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // PRIMI PIATTI
  {
    name: 'Spaghetti alle Zucchine e Menta',
    mealType: 'pranzo',
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    difficulty: 'easy',
    tags: ['vegetarian', 'low-fodmap', 'estivo', 'veloce'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('2', 320), // Riso Bianco (useremo come pasta equivalente)
      createPortion('5', 400), // Zucchine
      createPortion('37', 30), // Olio EVO
      createPortion('50', 20), // Rucola
      createPortion('12', 40), // Parmigiano Reggiano
    ],
    instructions: [
      'Lavare e tagliare le zucchine a cubetti o mezzalune.',
      'In una padella capiente, scaldare metà olio EVO e rosolare le zucchine a fuoco medio-alto per 8-10 minuti finché dorate.',
      'Nel frattempo cuocere la pasta in abbondante acqua salata.',
      'Scolare la pasta tenendo da parte una tazza di acqua di cottura.',
      'Trasferire la pasta nella padella con le zucchine, aggiungere acqua di cottura se serve e mantecare.',
      'Spegnere il fuoco, aggiungere la menta spezzettata, il parmigiano grattugiato e l\'olio rimanente a crudo.',
      'Servire subito con una macinata di pepe nero.',
    ],
  },
  {
    name: 'Risotto alla Zucca e Salvia',
    mealType: 'pranzo',
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    difficulty: 'medium',
    tags: ['vegetarian', 'low-fodmap', 'autunnale', 'comfort-food'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('2', 320), // Riso
      createPortion('25', 500), // Zucca butternut
      createPortion('37', 25), // Olio EVO
      createPortion('12', 50), // Parmigiano Reggiano
      createPortion('44', 5), // Zenzero fresco (grattugiato)
    ],
    instructions: [
      'Tagliare la zucca a cubetti piccoli e cuocerla a vapore o in padella con un filo d\'acqua finché morbida.',
      'Frullare metà zucca con un mestolo di brodo vegetale caldo per ottenere una crema.',
      'In una casseruola, tostare il riso a secco per 2-3 minuti.',
      'Aggiungere la crema di zucca e iniziare ad aggiungere brodo caldo un mestolo alla volta, mescolando.',
      'A metà cottura unire i cubetti di zucca rimasti e lo zenzero grattugiato.',
      'Quando il riso è al dente, mantecare con parmigiano e olio EVO a fuoco spento.',
      'Guarnire con foglie di salvia fritte croccanti in poco olio.',
    ],
  },
  {
    name: 'Pasta al Pomodoro e Basilico (Low-FODMAP)',
    mealType: 'pranzo',
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    difficulty: 'easy',
    tags: ['vegetarian', 'low-fodmap', 'classico', 'veloce', 'estivo'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('2', 320), // Pasta (riso come base)
      createPortion('22', 500), // Pomodori
      createPortion('37', 30), // Olio EVO
      createPortion('12', 30), // Parmigiano Reggiano
    ],
    instructions: [
      'Lavare i pomodori e tagliarli a cubetti.',
      'In una padella larga, scaldare l\'olio EVO e aggiungere i pomodori.',
      'Cuocere a fuoco medio per 15-20 minuti finché si sfaldano e formano un sugo denso.',
      'Salare leggermente e aggiungere foglie di basilico spezzettate a mano.',
      'Cuocere la pasta al dente, scolare e mantecare nel sugo.',
      'Servire con parmigiano grattugiato e un filo d\'olio a crudo.',
    ],
  },
  {
    name: 'Orzotto ai Funghi Porcini e Prezzemolo',
    mealType: 'pranzo',
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 30,
    difficulty: 'medium',
    tags: ['vegetarian', 'autunnale', 'fungo', 'ricco'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('46', 300), // Farro perlato (come orzo)
      createPortion('47', 300), // Broccoli (simuliamo funghi - low FODMAP)
      createPortion('37', 25), // Olio EVO
      createPortion('12', 40), // Parmigiano Reggiano
      createPortion('50', 15), // Rucola (come prezzemolo)
    ],
    instructions: [
      'Pulire i funghi (o broccoli a cimette) e tagliarli a pezzi.',
      'In una casseruola, rosolare i funghi con metà olio finché perdono l\'acqua e si dorano.',
      'Aggiungere il farro e tostarlo 2 minuti.',
      'Bagnare con brodo vegetale caldo un mestolo alla volta, mescolando spesso.',
      'A 5 minuti dalla fine, unire il prezzemolo tritato.',
      'Mantecare con parmigiano e olio rimanente a fuoco spento.',
      'Riposare 2 minuti prima di servire.',
    ],
  },
  {
    name: 'Gnocchi di Patate al Sugo di Pomodoro',
    mealType: 'pranzo',
    servings: 4,
    prepTimeMinutes: 30,
    cookTimeMinutes: 15,
    difficulty: 'medium',
    tags: ['vegetarian', 'low-fodmap', 'tradizionale', 'comfort-food'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('24', 600), // Patate (per gnocchi)
      createPortion('2', 200), // Farina (riso come proxy)
      createPortion('22', 400), // Pomodori per sugo
      createPortion('37', 20), // Olio EVO
      createPortion('12', 30), // Parmigiano Reggiano
    ],
    instructions: [
      'Lessare le patate con la buccia, sbucciarle calde e passarle allo schiacciapatate.',
      'Impastare con farina e un pizzico di sale finché l\'impasto è morbido ma non appiccicoso.',
      'Formare i gnocchi e rigarli con i rebbi di una forchetta.',
      'Per il sugo: cuocere i pomodori a cubetti in padella con olio per 15 min.',
      'Lessare gli gnocchi in acqua bollente salata: salgono a galla quando pronti.',
      'Scolare direttamente nel sugo e mantecare.',
      'Servire con parmigiano e basilico fresco.',
    ],
  },

  // SECONDI PIATTI
  {
    name: 'Branzino al Forno con Patate e Olive',
    mealType: 'cena',
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 35,
    difficulty: 'easy',
    tags: ['pesce', 'low-fodmap', 'forno', 'mediterraneo', 'estivo'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('34', 800), // Pesce azzurro (branzino simile)
      createPortion('24', 600), // Patate
      createPortion('37', 30), // Olio EVO
      createPortion('50', 20), // Rucola (come olive/erbe)
      createPortion('27', 100), // Arance (fette per aromatizzare)
    ],
    instructions: [
      'Pulire il branzino, fare 2-3 tagli trasversali su ogni lato.',
      'Tagliare le patate a spicchi e disporle in una teglia con olio, sale, rosmarino.',
      'Infornare le patate a 200°C per 15 minuti.',
      'Aggiungere il pesce nella teglia, farcire la pancia con fette d\'arancia e erbe.',
      'Irrorare con olio, infornare 20-25 minuti finché la pelle è croccante.',
      'A fine cottura aggiungere olive taggiasche e rucola fresca.',
      'Servire con spicchi di limone.',
    ],
  },
  {
    name: 'Pollo alle Erbe con Finocchi Arrosto',
    mealType: 'cena',
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 40,
    difficulty: 'easy',
    tags: ['pollo', 'low-fodmap', 'forno', 'autunnale', 'proteico'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('33', 600), // Petto di pollo/tacchino
      createPortion('20', 500), // Finocchi
      createPortion('37', 25), // Olio EVO
      createPortion('44', 10), // Zenzero fresco
      createPortion('27', 50), // Arance (succo per marinatura)
    ],
    instructions: [
      'Marinare il pollo a pezzi con succo d\'arancia, olio, zenzero grattugiato, sale, pepe per 30 min.',
      'Tagliare i finocchi a spicchi, condire con olio, sale, pepe.',
      'Disporre pollo e finocchi su teglia, infornare a 190°C per 35-40 min.',
      'A metà cottura girare il pollo e bagnare con il fondo di cottura.',
      'Gli ultimi 5 minuti alzare il grill per dorare la pelle.',
      'Servire con il fondo di cottura filtrato.',
    ],
  },
  {
    name: 'Frittata di Spinaci e Patate',
    mealType: 'cena',
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    difficulty: 'easy',
    tags: ['uova', 'vegetarian', 'low-fodmap', 'veloce', 'economico', 'tutto-anno'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('13', 400), // Uova (circa 8 uova)
      createPortion('19', 300), // Spinaci
      createPortion('24', 300), // Patate
      createPortion('37', 20), // Olio EVO
      createPortion('12', 30), // Parmigiano Reggiano
    ],
    instructions: [
      'Tagliare le patate a cubetti piccoli e cuocerle in padella con olio finché dorate e tenere.',
      'Aggiungere gli spinaci e farli appassire 2-3 minuti.',
      'Sbattere le uova con parmigiano, sale, pepe.',
      'Versare le uova su patate e spinaci, cuocere a fuoco medio-basso con coperchio.',
      'Quando i bordi si staccano, girare la frittata aiutandosi con un piatto.',
      'Cuocere dall\'altro lato 3-4 minuti.',
      'Servire tiepida o fredda, tagliata a spicchi.',
    ],
  },
  {
    name: 'Tofu alla Piastra con Verdure Grigliate',
    mealType: 'cena',
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    difficulty: 'easy',
    tags: ['vegan', 'tofu', 'low-fodmap', 'estivo', 'proteico', 'griglia'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('35', 400), // Tofu sodo
      createPortion('5', 300), // Zucchine
      createPortion('21', 200), // Peperoni
      createPortion('26', 200), // Melanzane
      createPortion('37', 25), // Olio EVO
      createPortion('44', 5), // Zenzero (marinatura)
    ],
    instructions: [
      'Pressare il tofu tra carta assorbente per 15 min, poi tagliarlo a fette spesse 1,5 cm.',
      'Marinare il tofu con olio, zenzero grattugiato, salsa di soia (low-FODMAP), succo limone 30 min.',
      'Tagliare le verdure a fette per il senso della lunghezza.',
      'Grigliare le verdure su piastra rovente 3-4 min per lato.',
      'Grigliare il tofu 2-3 min per lato finché segna le righe.',
      'Condire tutto con olio a crudo, sale, pepe, erbe fresche.',
      'Servire con riso basmati o quinoa.',
    ],
  },
  {
    name: 'Merluzzo al Vapore con Patate e Carote',
    mealType: 'cena',
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    difficulty: 'easy',
    tags: ['pesce', 'low-fodmap', 'vapore', 'leggero', 'dietetico', 'tutto-anno'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('34', 600), // Pesce bianco (merluzzo simile a pesce azzurro)
      createPortion('24', 400), // Patate
      createPortion('6', 300), // Carote
      createPortion('37', 20), // Olio EVO
      createPortion('44', 5), // Zenzero
      createPortion('27', 50), // Limone (arance come proxy)
    ],
    instructions: [
      'Tagliare patate e carote a cubetti/ bastoncini, cuocere a vapore 15 min.',
      'Posizionare i filetti di merluzzo nel cestello vapore sopra le verdure.',
      'Aggiungere fette di zenzero e limone sul pesce.',
      'Cuocere a vapore 10-12 minuti finché il pesce si sfalda.',
      'Condire verdure e pesce con olio EVO a crudo, sale, pepe.',
      'Guarnire con prezzemolo tritato.',
      'Servire subito caldo.',
    ],
  },
  {
    name: 'Involtini di Tacchino con Spinaci e Carote',
    mealType: 'cena',
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    difficulty: 'medium',
    tags: ['pollo', 'low-fodmap', 'ripieno', 'proteico', 'elegante'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('33', 500), // Petto tacchino (fette sottili)
      createPortion('19', 200), // Spinaci
      createPortion('6', 150), // Carote (julienne)
      createPortion('12', 40), // Parmigiano
      createPortion('37', 20), // Olio EVO
    ],
    instructions: [
      'Battere le fette di tacchino tra due fogli di carta forno per assottigliarle.',
      'Saltare spinaci e carote julienne in padella con poco olio, sale, pepe.',
      'Far raffreddare, mescolare con parmigiano grattugiato.',
      'Farcire ogni fetta di tacchino, arrotolare e fermare con stuzzicadenti.',
      'Rosolare gli involtini in padella con olio su tutti i lati.',
      'Sfumare con poco brodo vegetale, coprire e cuocere 15-20 min.',
      'Servire affettati con il fondo di cottura.',
    ],
  },

  // CONTORNI
  {
    name: 'Insalata di Finocchi, Arance e Olive',
    mealType: 'pranzo',
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 0,
    difficulty: 'easy',
    tags: ['vegan', 'low-fodmap', 'crudo', 'invernale', 'fresco', 'vitamina-c'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('20', 400), // Finocchi
      createPortion('27', 300), // Arance
      createPortion('50', 50), // Rucola (come olive/erbe)
      createPortion('37', 25), // Olio EVO
      createPortion('38', 20), // Mandorle (come pinoli)
    ],
    instructions: [
      'Affettare i finocchi sottilissimi con mandolina.',
      'Pelare le arance a vivo, ricavare gli spicchi senza pelle bianca.',
      'Unire finocchi, arance, rucola in una ciotola capiente.',
      'Condire con olio EVO, sale, pepe, succo di un\'arancia.',
      'Aggiungere mandorle tostate tritate grossolanamente.',
      'Mescolare delicatamente e servire subito.',
    ],
  },
  {
    name: 'Zucchine Grigliate alla Menta',
    mealType: 'pranzo',
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    difficulty: 'easy',
    tags: ['vegan', 'low-fodmap', 'estivo', 'griglia', 'veloce', 'contorno'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('5', 600), // Zucchine
      createPortion('37', 20), // Olio EVO
      createPortion('44', 5), // Zenzero (come menta - fresco)
    ],
    instructions: [
      'Lavare le zucchine, tagliarle per il lungo a fette spesse ½ cm.',
      'Scaldare bene una piastra o griglia.',
      'Grigliare le zucchine 3-4 min per lato finché hanno i segni della griglia.',
      'Disporre su piatto da portata, condire con olio, sale, pepe.',
      'Aggiungere menta fresca tritata (o zenzero grattugiato per variante).',
      'Lasciare insaporire 10 minuti a temperatura ambiente.',
      'Servire tiepide o a temperatura ambiente.',
    ],
  },
  {
    name: 'Peperonata Light (senza cipolla)',
    mealType: 'cena',
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    difficulty: 'easy',
    tags: ['vegan', 'low-fodmap', 'estivo', 'conserve', 'meal-prep'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('21', 600), // Peperoni (rossi, gialli, verdi)
      createPortion('22', 300), // Pomodori
      createPortion('37', 25), // Olio EVO
      createPortion('44', 5), // Zenzero (come basilico)
    ],
    instructions: [
      'Lavare i peperoni, togliere semi e filamenti bianchi, tagliarli a strisce.',
      'Tagliare i pomodori a cubetti.',
      'In padella capiente, scaldare olio e aggiungere i peperoni.',
      'Cuocere a fuoco medio 10 min, poi aggiungere pomodori.',
      'Proseguire cottura 20 min finché peperoni sono morbidi e sugo denso.',
      'Aggiungere basilico/zenzero fresco tritato a fine cottura.',
      'Ottima calda, tiepida o fredda. Si conserva 3 giorni in frigo.',
    ],
  },
  {
    name: 'Cavolfiore Arrosto con Curcuma e Mandorle',
    mealType: 'cena',
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    difficulty: 'easy',
    tags: ['vegan', 'low-fodmap*', 'autunnale', 'forno', 'anti-infiammatorio', '*porzione-controllata'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('23', 500), // Cavolfiore (porzione controllata - high FODMAP)
      createPortion('37', 20), // Olio EVO
      createPortion('60', 5), // Curcuma in polvere
      createPortion('38', 30), // Mandorle
      createPortion('44', 5), // Zenzero fresco
    ],
    instructions: [
      'Dividere il cavolfiore in cimette di dimensioni simili.',
      'In una ciotola, mescolare olio, curcuma, zenzero grattugiato, sale, pepe.',
      'Condire le cimette con il mix di spezie e olio.',
      'Disporre su teglia con carta forno, infornare a 200°C per 20-25 min.',
      'A metà cottura girare e aggiungere le mandorle a lamelle.',
      'Cuocere finché dorato e croccante ai bordi.',
      'Servire come contorno o piatto unico con cereali.',
    ],
  },
  {
    name: 'Spinaci Saltati con Uvetta e Pinoli',
    mealType: 'pranzo',
    servings: 4,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    difficulty: 'easy',
    tags: ['vegetarian', 'low-fodmap', 'veloce', 'ferro', 'tutto-anno'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('19', 500), // Spinaci freschi
      createPortion('37', 15), // Olio EVO
      createPortion('38', 20), // Mandorle (come pinoli)
      createPortion('54', 30), // Prugne secche (come uvetta - high FODMAP, porzione piccola)
    ],
    instructions: [
      'Lavare bene gli spinaci, scolarli mantenendo un po\' d\'acqua.',
      'In padella larga, scaldare olio e aggiungere spinaci a manciate.',
      'Saltare 2-3 min finché appassiti ma ancora verdi brillanti.',
      'Aggiungere mandorle tostate e uvetta/prugne tritate.',
      'Saltare 1 minuto, regolare sale e pepe.',
      'Servire subito come contorno ricco di ferro.',
    ],
  },

  // COLAZIONI
  {
    name: 'Porridge di Avena con Frutti di Bosco e Mandorle',
    mealType: 'colazione',
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    difficulty: 'easy',
    tags: ['vegetarian', 'low-fodmap', 'vegan*', 'colazione', 'fibre', 'antiossidanti', '*latte-vegetale'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('3', 80), // Avena in fiocchi
      createPortion('66', 400), // Latte di avena
      createPortion('9', 150), // Fragole e mirtilli
      createPortion('38', 20), // Mandorle
      createPortion('39', 10), // Semi di chia
      createPortion('43', 10), // Sciroppo d'acero
    ],
    instructions: [
      'In un pentolino, portare a ebollizione il latte d\'avena con l\'avena.',
      'Cuocere 5-7 minuti mescolando finché cremoso.',
      'Aggiungere i semi di chia negli ultimi 2 minuti.',
      'Versare nelle ciotole, guarnire con frutti di bosco freschi.',
      'Aggiungere mandorle tritate e sciroppo d\'acero.',
      'Variante vegana: usare latte vegetale, ometti miele.',
    ],
  },
  {
    name: 'Yogurt Greco con Kiwi, Miele e Noci',
    mealType: 'colazione',
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    difficulty: 'easy',
    tags: ['vegetarian', 'low-fodmap', 'proteico', 'veloce', 'probiotici', 'tutto-anno'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('36', 300), // Yogurt greco senza lattosio
      createPortion('28', 200), // Kiwi
      createPortion('42', 20), // Miele (porzione controllata - high FODMAP)
      createPortion('68', 30), // Noci
      createPortion('39', 10), // Semi di chia
    ],
    instructions: [
      'Versare lo yogurt nelle ciotole.',
      'Sbucciare e tagliare i kiwi a fette o cubetti.',
      'Distribuire la frutta sullo yogurt.',
      'Cospargere con noci tritate grossolanamente e semi di chia.',
      'Irrorare con miele (o sciroppo d\'acero per low-FODMAP stretto).',
      'Servire subito per mantenere la croccantezza.',
    ],
  },
  {
    name: 'Uova Strapazzate con Spinaci e Pomodorini',
    mealType: 'colazione',
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    difficulty: 'easy',
    tags: ['vegetarian', 'low-fodmap', 'proteico', 'savory-breakfast', 'veloce'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('13', 200), // Uova (4 uova)
      createPortion('19', 100), // Spinaci
      createPortion('22', 100), // Pomodori (pomodorini)
      createPortion('37', 10), // Olio EVO
      createPortion('12', 15), // Parmigiano
    ],
    instructions: [
      'Lavare spinaci e pomodorini, tagliare i pomodorini a metà.',
      'Saltare spinaci e pomodorini in padella antiaderente con poco olio 2-3 min.',
      'Sbattere le uova con sale, pepe, parmigiano.',
      'Versare le uova nella padella, cuocere a fuoco medio-basso mescolando delicatamente.',
      'Togliere dal fuoco quando ancora leggermente cremose (continuano a cuocere).',
      'Servire subito con pane gluten-free tostato.',
    ],
  },
  {
    name: 'Pancake di Banana e Avena (Senza Farina)',
    mealType: 'colazione',
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    difficulty: 'easy',
    tags: ['vegetarian', 'low-fodmap*', 'senza-glutine', 'senza-zucchero', '*banana-matura', 'colazione-weekend'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('29', 200), // Banana soda (2 medie)
      createPortion('3', 60), // Avena in fiocchi (frullata)
      createPortion('13', 100), // Uova (2 uova)
      createPortion('37', 10), // Olio per padella
      createPortion('9', 100), // Fragole (topping)
      createPortion('43', 15), // Sciroppo d'acero
    ],
    instructions: [
      'Frullare banana, avena e uova finché liscio. Lasciare riposare 5 min.',
      'Scaldare padella antiaderente con goccia d\'olio.',
      'Versare un mestolino per pancake, cuocere 2-3 min per lato finché bolle in superficie.',
      'Girare delicatamente, cuocere altro minuto.',
      'Servire impilati con fragole a fette e sciroppo d\'acero.',
      'Nota: banana deve essere soda (non troppo matura) per low-FODMAP.',
    ],
  },
  {
    name: 'Toast di Pane GF con Avocado, Uovo e Pomodorini',
    mealType: 'colazione',
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 5,
    difficulty: 'easy',
    tags: ['vegetarian', 'low-fodmap', 'proteico', 'grassi-sani', 'veloce', 'trendy'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('18', 100), // Pane gluten-free (2 fette)
      createPortion('13', 100), // Uova (2 uova)
      createPortion('22', 100), // Pomodorini
      createPortion('37', 10), // Olio EVO
      // Avocado non nel database - useremo mandorle come grassi sani proxy
      createPortion('38', 15), // Mandorle
    ],
    instructions: [
      'Tostare le fette di pane gluten-free.',
      'Cuocere le uova all\'occhio di bue o strapazzate.',
      'Tagliare pomodorini a metà, condire con olio, sale, pepe.',
      'Spalmare avocado schiacciato sul pane (o crema di mandorle).',
      'Adagiare l\'uovo, pomodorini, mandorle a lamelle.',
      'Condire con pepe nero, peperoncino se piace, olio a crudo.',
    ],
  },

  // SPUNTINI
  {
    name: 'Hummus di Ceci con Crudità (Low-FODMAP)',
    mealType: 'spuntino',
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    difficulty: 'easy',
    tags: ['vegan', 'low-fodmap*', 'proteico', 'fibre', '*ceci-in-scatola-scolati', 'aperitivo'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('14', 200), // Legumi (ceci in scatola scolati - low FODMAP se ben risciacquati)
      createPortion('37', 30), // Olio EVO
      createPortion('39', 15), // Semi di sesamo (tahini proxy)
      createPortion('27', 30), // Limone (arance come proxy succo)
      createPortion('6', 100), // Carote (crudità)
      createPortion('20', 100), // Finocchi (crudità)
      createPortion('49', 100), // Cetrioli (crudità)
    ],
    instructions: [
      'Scolare e risciacquare molto bene i ceci in scatola sotto acqua corrente.',
      'Frullare ceci con olio, tahini (semi sesamo), succo limone, sale, cumino finché cremoso.',
      'Aggiungere acqua se troppo denso.',
      'Tagliare carote, finocchi, cetrioli a bastoncini per intingere.',
      'Servire hummus con filo d\'olio, paprika, prezzemolo.',
      'Nota: ceci in scatola ben scolati sono low-FODMAP fino a ¼ tazza a porzione.',
    ],
  },
  {
    name: 'Energy Balls Datteri, Cacao e Mandorle',
    mealType: 'spuntino',
    servings: 12, // 12 palline
    prepTimeMinutes: 15,
    cookTimeMinutes: 0,
    difficulty: 'easy',
    tags: ['vegan', 'low-fodmap*', 'senza-cottura', 'energetico', '*datteri-porzione-piccola', 'meal-prep'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('54', 100), // Prugne secche (come datteri - high FODMAP, porzione controllata)
      createPortion('38', 80), // Mandorle
      createPortion('41', 20), // Cioccolato fondente (cacao)
      createPortion('39', 15), // Semi di chia
      createPortion('60', 2), // Curcuma (opzionale, anti-infiammatorio)
    ],
    instructions: [
      'Frullare prugne/secche e mandorle nel mixer finché si forma un impasto appiccicoso.',
      'Aggiungere cioccolato tritato, semi di chia, curcuma, frullare ancora.',
      'Formare 12 palline grandi come una noce.',
      'Rotolare in cacao amaro o mandorle tritate.',
      'Raffreddare in frigo 30 min prima di servire.',
      'Si conservano 1 settimana in frigo in contenitore ermetico.',
      'Porzione: 1-2 palline per spuntino (FODMAP controllati).',
    ],
  },
  {
    name: 'Yogurt con Granola Home-made e Frutta',
    mealType: 'spuntino',
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 20,
    difficulty: 'easy',
    tags: ['vegetarian', 'low-fodmap', 'proteico', 'croccante', 'personalizzabile'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('36', 200), // Yogurt greco senza lattosio
      createPortion('3', 40), // Avena (per granola)
      createPortion('38', 20), // Mandorle (granola)
      createPortion('39', 10), // Semi chia (granola)
      createPortion('37', 10), // Olio (granola)
      createPortion('43', 10), // Sciroppo acero (granola)
      createPortion('9', 100), // Fragole/mirtilli
    ],
    instructions: [
      'Per granola: mescolare avena, mandorle tritate, semi chia, olio, sciroppo acero.',
      'Stendere su teglia, infornare 160°C 15-20 min mescolando a metà, finché dorata.',
      'Far raffreddare completamente (diventa croccante).',
      'Versare yogurt in ciotole, aggiungere frutta fresca.',
      'Cospargere generosamente con granola home-made.',
      'Granola si conserva 2 settimane in barattolo ermetico.',
    ],
  },
  {
    name: 'Fette di Mela al Forno con Cannella',
    mealType: 'spuntino',
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    difficulty: 'easy',
    tags: ['vegan', 'low-fodmap*', 'forno', 'autunnale', '*mela-porzione-piccola', 'comfort-food'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('8', 200), // Mele (porzione controllata - high FODMAP)
      createPortion('38', 20), // Mandorle (come noci per topping)
      createPortion('37', 10), // Olio EVO
      // Cannella non nel database
    ],
    instructions: [
      'Preriscaldare forno a 180°C.',
      'Lavare mele, togliere il torsolo, affettare spesse ½ cm.',
      'Disporre su teglia con carta forno, spennellare con poco olio.',
      'Spolverare generosamente con cannella.',
      'Infornare 20-25 min finché morbide e leggermente caramellate.',
      'Girare a metà cottura.',
      'Servire tiepide con mandorle tritate. Ottime anche fredde.',
    ],
  },

  // DOLCI
  {
    name: 'Torta di Carote e Mandorle (Senza Farina)',
    mealType: 'spuntino',
    servings: 8,
    prepTimeMinutes: 20,
    cookTimeMinutes: 40,
    difficulty: 'medium',
    tags: ['vegetarian', 'low-fodmap', 'senza-glutine', 'senza-lattosio', 'carote', 'mandorle', 'torta-salutare'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('6', 300), // Carote grattugiate
      createPortion('38', 200), // Mandorle tritate (farina di mandorle)
      createPortion('13', 200), // Uova (4 uova)
      createPortion('43', 80), // Sciroppo d'acero
      createPortion('37', 30), // Olio EVO
      createPortion('39', 20), // Semi di chia (leganti)
      createPortion('41', 30), // Cioccolato fondente (gocce)
    ],
    instructions: [
      'Grattugiare finemente le carote crude.',
      'Montare uova con sciroppo d\'acero finché chiare e spumose.',
      'Aggiungere olio a filo, poi mandorle, carote, semi chia, lievito.',
      'Incorporare gocce di cioccolato.',
      'Versare in stampo 22cm foderato carta forno.',
      'Infornare 180°C 35-40 min (stecchino asciutto).',
      'Far raffreddare nello stampo, poi sformare.',
    ],
  },
  {
    name: 'Mousse al Cioccolato Fondente e Avocado',
    mealType: 'spuntino',
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    difficulty: 'easy',
    tags: ['vegan', 'low-fodmap', 'senza-cottura', 'cioccolato', 'avocado', 'grassi-sani', 'veloce'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('41', 100), // Cioccolato fondente ≥70%
      createPortion('38', 50), // Mandorle (come avocado - grassi sani)
      createPortion('66', 100), // Latte avena
      createPortion('43', 20), // Sciroppo acero
      createPortion('9', 50), // Fragole (guarnizione)
    ],
    instructions: [
      'Sciogliere il cioccolato a bagnomaria o microonde a bassa potenza.',
      'Frullare mandorle (avocado) con latte avena e sciroppo acero finché liscissimo.',
      'Incorporare il cioccolato fuso tiepido, frullare ancora.',
      'Versare in coppette, raffreddare in frigo 2 ore minimo.',
      'Guarnire con fragole fresche e scaglie di cioccolato.',
      'Texture cremosa grazie ai grassi sani, zero panna.',
    ],
  },
  {
    name: 'Crostata di Frutta di Stagione su Base di Avena',
    mealType: 'spuntino',
    servings: 8,
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    difficulty: 'medium',
    tags: ['vegetarian', 'low-fodmap*', 'senza-glutine', 'frutta-stagionale', '*frutta-low-fodmap', 'dolce-festa'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('3', 150), // Avena (base)
      createPortion('38', 80), // Mandorle (base)
      createPortion('37', 50), // Olio (base)
      createPortion('43', 40), // Sciroppo acero (base)
      createPortion('9', 200), // Fragole/mirtilli (riempimento)
      createPortion('27', 150), // Arance/kiwi (riempimento)
      createPortion('36', 200), // Yogurt (crema)
    ],
    instructions: [
      'Frullare avena e mandorle, mescolare con olio e sciroppo per base.',
      'Pressare in stampo 24cm foderato, infornare 180°C 15 min.',
      'Far raffreddare completamente.',
      'Mescolare yogurt con poco sciroppo acero per crema.',
      'Spalmare crema su base, decorare con frutta di stagione a fette.',
      'Spennellare frutta con poco sciroppo diluito per lucidare.',
      'Raffreddare 1 ora prima di tagliare.',
    ],
  },
  {
    name: 'Gelato alla Banana e Burro di Arachidi (Nice Cream)',
    mealType: 'spuntino',
    servings: 4,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    difficulty: 'easy',
    tags: ['vegan', 'low-fodmap*', 'senza-gelatiera', '*banana-soda', 'burro-arachidi', 'estivo', 'veloce'],
    isCustom: false,
    sourceDayIndex: -1,
    portions: [
      createPortion('29', 300), // Banane sode (3 medie), congelate a fette
      createPortion('38', 40), // Mandorle (come burro arachidi)
      createPortion('41', 20), // Cioccolato fondente (scaglie)
      createPortion('66', 50), // Latte avena (se serve per frullare)
    ],
    instructions: [
      'Congelare banane a fette almeno 4 ore (meglio una notte).',
      'Frullare banane congelate con mandorle e latte avena finché cremoso.',
      'Aggiungere scaglie di cioccolato, dare ultimi colpi di frullatore.',
      'Servire subito per consistenza soft-serve.',
      'Oppure congelare 1-2 ore per consistenza più soda.',
      'Variante: aggiungere cacao amaro per versione cioccolato.',
    ],
  },
];

/**
 * Categorie per filtraggio
 */
export const RECIPE_CATEGORIES = [
  'Primi',
  'Secondi',
  'Contorni',
  'Colazioni',
  'Spuntini',
  'Dolci',
] as const;

export type RecipeCategory = typeof RECIPE_CATEGORIES[number];

/**
 * Mappa ricetta -> categoria
 */
export const RECIPE_CATEGORY_MAP: Record<string, RecipeCategory> = {
  'Spaghetti alle Zucchine e Menta': 'Primi',
  'Risotto alla Zucca e Salvia': 'Primi',
  'Pasta al Pomodoro e Basilico (Low-FODMAP)': 'Primi',
  'Orzotto ai Funghi Porcini e Prezzemolo': 'Primi',
  'Gnocchi di Patate al Sugo di Pomodoro': 'Primi',
  'Branzino al Forno con Patate e Olive': 'Secondi',
  'Pollo alle Erbe con Finocchi Arrosto': 'Secondi',
  'Frittata di Spinaci e Patate': 'Secondi',
  'Tofu alla Piastra con Verdure Grigliate': 'Secondi',
  'Merluzzo al Vapore con Patate e Carote': 'Secondi',
  'Involtini di Tacchino con Spinaci e Carote': 'Secondi',
  'Insalata di Finocchi, Arance e Olive': 'Contorni',
  'Zucchine Grigliate alla Menta': 'Contorni',
  'Peperonata Light (senza cipolla)': 'Contorni',
  'Cavolfiore Arrosto con Curcuma e Mandorle': 'Contorni',
  'Spinaci Saltati con Uvetta e Pinoli': 'Contorni',
  'Porridge di Avena con Frutti di Bosco e Mandorle': 'Colazioni',
  'Yogurt Greco con Kiwi, Miele e Noci': 'Colazioni',
  'Uova Strapazzate con Spinaci e Pomodorini': 'Colazioni',
  'Pancake di Banana e Avena (Senza Farina)': 'Colazioni',
  'Toast di Pane GF con Avocado, Uovo e Pomodorini': 'Colazioni',
  'Hummus di Ceci con Crudità (Low-FODMAP)': 'Spuntini',
  'Energy Balls Datteri, Cacao e Mandorle': 'Spuntini',
  'Yogurt con Granola Home-made e Frutta': 'Spuntini',
  'Fette di Mela al Forno con Cannella': 'Spuntini',
  'Torta di Carote e Mandorle (Senza Farina)': 'Dolci',
  'Mousse al Cioccolato Fondente e Avocado': 'Dolci',
  'Crostata di Frutta di Stagione su Base di Avena': 'Dolci',
  'Gelato alla Banana e Burro di Arachidi (Nice Cream)': 'Dolci',
};

/**
 * Difficoltà con colori per badge
 */
export const DIFFICULTY_COLORS: Record<'easy' | 'medium' | 'hard', string> = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export const DIFFICULTY_LABELS: Record<'easy' | 'medium' | 'hard', { it: string; en: string }> = {
  easy: { it: 'Facile', en: 'Easy' },
  medium: { it: 'Media', en: 'Medium' },
  hard: { it: 'Difficile', en: 'Hard' },
};

/**
 * Calcola macro totali e per porzione da una ricetta
 */
export function calculateRecipeMacros(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> | Recipe) {
  const totalMacros = recipe.portions.reduce(
    (acc, portion) => ({
      calories: acc.calories + portion.nutrition.calories,
      protein: acc.protein + portion.nutrition.protein,
      carbs: acc.carbs + portion.nutrition.carbs,
      fat: acc.fat + portion.nutrition.fat,
      fiber: acc.fiber + portion.nutrition.fiber,
      sugar: acc.sugar + portion.nutrition.sugar,
      sodium: acc.sodium + portion.nutrition.sodium,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 }
  );

  const perServing = {
    calories: Math.round(totalMacros.calories / recipe.servings),
    protein: Math.round((totalMacros.protein / recipe.servings) * 10) / 10,
    carbs: Math.round((totalMacros.carbs / recipe.servings) * 10) / 10,
    fat: Math.round((totalMacros.fat / recipe.servings) * 10) / 10,
    fiber: Math.round((totalMacros.fiber / recipe.servings) * 10) / 10,
    sugar: Math.round((totalMacros.sugar / recipe.servings) * 10) / 10,
    sodium: Math.round((totalMacros.sodium / recipe.servings) * 10) / 10,
  };

  return { total: totalMacros, perServing };
}

/**
 * Verifica se una ricetta è low-FODMAP (tutti ingredienti low FODMAP)
 */
export function isRecipeLowFODMAP(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> | Recipe): boolean {
  return recipe.portions.every(portion => {
    const food = FOODS_DATABASE.find(f => f.id === portion.foodId);
    return food?.fodmapLevel === 'low';
  });
}

/**
 * Ottiene le stagioni coperte dagli ingredienti di una ricetta
 */
export function getRecipeSeasons(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> | Recipe): number[] {
  const months = new Set<number>();
  recipe.portions.forEach(portion => {
    const food = FOODS_DATABASE.find(f => f.id === portion.foodId);
    food?.months?.forEach(m => months.add(m));
  });
  return Array.from(months).sort((a, b) => a - b);
}

/**
 * Ottiene le proteine principali di una ricetta
 */
export function getRecipeProteins(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> | Recipe): string[] {
  const proteins = new Set<string>();
  recipe.portions.forEach(portion => {
    const food = FOODS_DATABASE.find(f => f.id === portion.foodId);
    if (food?.category === 'Proteine/Formaggi') {
      proteins.add(food.name);
    }
  });
  return Array.from(proteins);
}