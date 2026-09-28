const fs = require('fs');

// Italian translations for foods 69-90 (already in IT file)
const itFoods = {
  '69': { name: 'Avocado fresco', alt: 'Olio EVO, semi di chia o purea di banana verde' },
  '70': { name: 'Funghi Porcini freschi', alt: 'Funghi champignon in scatola scolati o broccoli (cimette)' },
  '71': { name: 'Limone e succo di limone', alt: '' },
  '72': { name: 'Olive verdi e nere', alt: '' },
  '73': { name: 'Pinoli', alt: '' },
  '74': { name: 'Farina di Riso', alt: '' },
  '75': { name: 'Cannella in polvere', alt: '' },
  '76': { name: 'Prezzemolo fresco', alt: '' },
  '77': { name: 'Basilico fresco', alt: '' },
  '78': { name: 'Menta fresca', alt: '' },
  '79': { name: 'Salvia fresca', alt: '' },
  '80': { name: 'Pepe nero macinato', alt: '' },
  '81': { name: 'Paprica dolce', alt: '' },
  '82': { name: 'Cumino in polvere', alt: '' },
  '83': { name: 'Olio di Sesamo / Tahina', alt: '' },
  '84': { name: 'Salsa di Soia Tamari GF', alt: '' },
  '85': { name: 'Latte di Cocco per cucina', alt: '' },
  '86': { name: 'Sedano (coste fresche)', alt: 'Finocchio o carote croccanti' },
  '87': { name: 'Anacardi al naturale', alt: 'Noci, semi di chia o arachidi' },
  '88': { name: 'Formaggio Feta / Caprino stagionato', alt: '' },
  '89': { name: 'Lenticchie rosse decorticate cotte', alt: 'Tofu sodo, uova o tempeh' },
  '90': { name: 'Saccarosio / Zucchero da tavola', alt: 'Sciroppo d\'acero' }
};

// English translations for foods 69-90
const enFoods = {
  '69': { name: 'Fresh Avocado', alt: 'EVO oil, chia seeds or green banana puree' },
  '70': { name: 'Fresh Porcini Mushrooms', alt: 'Canned champignons (drained) or broccoli (florets)' },
  '71': { name: 'Lemon and Lemon Juice', alt: '' },
  '72': { name: 'Green and Black Olives', alt: '' },
  '73': { name: 'Pine Nuts', alt: '' },
  '74': { name: 'Rice Flour', alt: '' },
  '75': { name: 'Ground Cinnamon', alt: '' },
  '76': { name: 'Fresh Parsley', alt: '' },
  '77': { name: 'Fresh Basil', alt: '' },
  '78': { name: 'Fresh Mint', alt: '' },
  '79': { name: 'Fresh Sage', alt: '' },
  '80': { name: 'Ground Black Pepper', alt: '' },
  '81': { name: 'Sweet Paprika', alt: '' },
  '82': { name: 'Ground Cumin', alt: '' },
  '83': { name: 'Sesame Oil / Tahini', alt: '' },
  '84': { name: 'Soy Sauce Tamari GF', alt: '' },
  '85': { name: 'Coconut Milk for Cooking', alt: '' },
  '86': { name: 'Celery (fresh stalks)', alt: 'Fennel or crunchy carrots' },
  '87': { name: 'Raw Cashews', alt: 'Walnuts, chia seeds or peanuts' },
  '88': { name: 'Feta Cheese / Aged Goat Cheese', alt: '' },
  '89': { name: 'Cooked Decorticated Red Lentils', alt: 'Firm tofu, eggs or tempeh' },
  '90': { name: 'Sucrose / Table Sugar', alt: 'Maple syrup' }
};

// German translations for foods 69-90
const deFoods = {
  '69': { name: 'Frische Avocado', alt: 'Olivenöl, Chiasamen oder grüne Bananenpüree' },
  '70': { name: 'Frische Steinpilze', alt: 'Dose Champignons (abgetropft) oder Brokkoli (Röschen)' },
  '71': { name: 'Zitrone und Zitronensaft', alt: '' },
  '72': { name: 'Grüne und schwarze Oliven', alt: '' },
  '73': { name: 'Pinienkerne', alt: '' },
  '74': { name: 'Reismehl', alt: '' },
  '75': { name: 'Zimtpulver', alt: '' },
  '76': { name: 'Frische Petersilie', alt: '' },
  '77': { name: 'Frisches Basilikum', alt: '' },
  '78': { name: 'Frische Minze', alt: '' },
  '79': { name: 'Frischer Salbei', alt: '' },
  '80': { name: 'Gemahlener schwarzer Pfeffer', alt: '' },
  '81': { name: 'Süße Paprika', alt: '' },
  '82': { name: 'Gemahlener Kreuzkümmel', alt: '' },
  '83': { name: 'Sesamöl / Tahini', alt: '' },
  '84': { name: 'Sojasoße Tamari GF', alt: '' },
  '85': { name: 'Kokosmilch zum Kochen', alt: '' },
  '86': { name: 'Sellerie (frische Stängel)', alt: 'Fenchel oder knackige Möhren' },
  '87': { name: 'Rohe Cashewkerne', alt: 'Walnüsse, Chiasamen oder Erdnüsse' },
  '88': { name: 'Feta-Käse / gereifter Ziegenkäse', alt: '' },
  '89': { name: 'Gekochte geschälte rote Linsen', alt: 'Fester Tofu, Eier oder Tempeh' },
  '90': { name: 'Saccharose / Haushaltszucker', alt: 'Ahornsirup' }
};

// Spanish translations for foods 69-90
const esFoods = {
  '69': { name: 'Aguacate fresco', alt: 'Aceite EVO, semillas de chía o puré de plátano verde' },
  '70': { name: 'Champiñones frescos', alt: 'Champiñones en lata escurridos o brócoli (floretes)' },
  '71': { name: 'Limón y jugo de limón', alt: '' },
  '72': { name: 'Aceitunas verdes y negras', alt: '' },
  '73': { name: 'Piñones', alt: '' },
  '74': { name: 'Harina de arroz', alt: '' },
  '75': { name: 'Canela en polvo', alt: '' },
  '76': { name: 'Perejil fresco', alt: '' },
  '77': { name: 'Albahaca fresca', alt: '' },
  '78': { name: 'Mentol fresco', alt: '' },
  '79': { name: 'Salvia fresca', alt: '' },
  '80': { name: 'Pimienta negra molida', alt: '' },
  '81': { name: 'Pimentón dulce', alt: '' },
  '82': { name: 'Comino molido', alt: '' },
  '83': { name: 'Aceite de sésamo / Tahini', alt: '' },
  '84': { name: 'Salsa de soja Tamari GF', alt: '' },
  '85': { name: 'Leche de coco para cocinar', alt: '' },
  '86': { name: 'Apio (tallos frescos)', alt: 'Hinojo o zanahorias crujientes' },
  '87': { name: 'Anacardos naturales', alt: 'Nueces, semillas de chía o cacahuetes' },
  '88': { name: 'Queso Feta / Queso de cabra curado', alt: '' },
  '89': { name: 'Lentejas rojas descascarilladas cocidas', alt: 'Tofu firme, huevos o tempeh' },
  '90': { name: 'Sacarosa / Azúcar de mesa', alt: 'Sirop de arce' }
};

// French translations for foods 69-90
const frFoods = {
  '69': { name: 'Avocat frais', alt: 'Huile EVO, graines de chia ou purée de banane verte' },
  '70': { name: 'Champignons frais', alt: 'Champignons en conserve égouttés ou brocoli (fleurettes)' },
  '71': { name: 'Citron et jus de citron', alt: '' },
  '72': { name: 'Olives vertes et noires', alt: '' },
  '73': { name: 'Pignons de pin', alt: '' },
  '74': { name: 'Farine de riz', alt: '' },
  '75': { name: 'Cannelle en poudre', alt: '' },
  '76': { name: 'Persil frais', alt: '' },
  '77': { name: 'Basilic frais', alt: '' },
  '78': { name: 'Menthe fraîche', alt: '' },
  '79': { name: 'Sauge fraîche', alt: '' },
  '80': { name: 'Poivre noir moulu', alt: '' },
  '81': { name: 'Paprika doux', alt: '' },
  '82': { name: 'Cumin moulu', alt: '' },
  '83': { name: 'Huile de sésame / Tahini', alt: '' },
  '84': { name: 'Sauce soja Tamari GF', alt: '' },
  '85': { name: 'Lait de coco pour la cuisine', alt: '' },
  '86': { name: 'Céleri (branches fraîches)', alt: 'Fenouil ou carottes croquantes' },
  '87': { name: 'Noix de cajou nature', alt: 'Noix, graines de chia ou cacahuètes' },
  '88': { name: 'Fromage Feta / Chèvre affiné', alt: '' },
  '89': { name: 'Lentilles rouges décortiquées cuites', alt: 'Tofu ferme, œufs ou tempeh' },
  '90': { name: 'Saccharose / Sucre de table', alt: 'Sirop d\'érable' }
};

function addFoodsToTranslation(filePath, foods) {
  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);
  
  // Add foods 69-90
  for (const [id, data] of Object.entries(foods)) {
    json.foods[id] = data;
  }
  
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
  console.log('Updated: ' + filePath);
}

addFoodsToTranslation('public/locales/en/translation.json', enFoods);
addFoodsToTranslation('public/locales/de/translation.json', deFoods);
addFoodsToTranslation('public/locales/es/translation.json', esFoods);
addFoodsToTranslation('public/locales/fr/translation.json', frFoods);
console.log('Italian already has foods 69-90');