export type Micro = 'potassium' | 'magnesium' | 'calcium' | 'iron' | 'zinc' | 'folate' | 'vitamin_a' | 'vitamin_c' | 'vitamin_d' | 'vitamin_e' | 'b12' | 'omega3' | 'selenium' | 'iodine';

export interface FoodNutrition {
  kcal: number;
  protein: number; // g
  carbs: number;   // g
  fats: number;    // g
  fiber: number;   // g
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'Carboidrati/Cereali' | 'Proteine/Formaggi' | 'Verdura' | 'Frutta' | 'Condimenti/Altro';
  fodmapLevel: 'low' | 'high';
  triggerGroup?: 'Fruttani' | 'Lattosio' | 'Fruttosio' | 'Galattani' | 'Polioli';
  alternative?: string;
  /** Mesi (1-12) di disponibilità tipica del prodotto fresco in ambito mediterraneo. Omesso = disponibile tutto l'anno (conserve, essiccati, allevamento, importazione continua). */
  months?: number[];
  /** Valori nutrizionali indicativi per 100g di parte edibile */
  nutrition: FoodNutrition;
  /** Oligoelementi/micronutrienti di cui l'alimento è fonte rilevante */
  micros?: Micro[];
}

export const FOODS_DATABASE: FoodItem[] = [
  // CEREALI E CARBOIDRATI
  { id: '1', name: 'Pane di Frumento / Pasta comune', category: 'Carboidrati/Cereali', fodmapLevel: 'high', triggerGroup: 'Fruttani', alternative: 'Riso, avena, quinoa o prodotti certificati Gluten-Free', nutrition: { kcal: 290, protein: 9, carbs: 55, fats: 2, fiber: 3 }, micros: ['iron', 'folate'] },
  { id: '2', name: 'Riso Bianco e Integrale', category: 'Carboidrati/Cereali', fodmapLevel: 'low', nutrition: { kcal: 360, protein: 6.7, carbs: 80, fats: 0.4, fiber: 1.3 }, micros: ['magnesium'] },
  { id: '3', name: 'Avena in fiocchi', category: 'Carboidrati/Cereali', fodmapLevel: 'low', nutrition: { kcal: 389, protein: 16.9, carbs: 66, fats: 6.9, fiber: 10.6 }, micros: ['magnesium', 'iron', 'zinc'] },
  { id: '15', name: 'Quinoa', category: 'Carboidrati/Cereali', fodmapLevel: 'low', nutrition: { kcal: 368, protein: 14.1, carbs: 64, fats: 6.1, fiber: 7 }, micros: ['magnesium', 'iron', 'folate'] },
  { id: '16', name: 'Mais / Polenta', category: 'Carboidrati/Cereali', fodmapLevel: 'low', nutrition: { kcal: 365, protein: 9.4, carbs: 74, fats: 4.7, fiber: 7.3 }, micros: ['magnesium'] },
  { id: '17', name: 'Grano Saraceno', category: 'Carboidrati/Cereali', fodmapLevel: 'low', nutrition: { kcal: 343, protein: 13.3, carbs: 71.5, fats: 3.4, fiber: 10 }, micros: ['magnesium', 'iron'] },
  { id: '18', name: 'Pane e Pasta Gluten-Free certificati', category: 'Carboidrati/Cereali', fodmapLevel: 'low', nutrition: { kcal: 260, protein: 5, carbs: 48, fats: 5, fiber: 4 }, micros: ['iron'] },

  // VERDURA
  { id: '4', name: 'Aglio e Cipolla', category: 'Verdura', fodmapLevel: 'high', triggerGroup: 'Fruttani', alternative: 'Erba cipollina o olio infuso all\'aglio (i FODMAP non sono solubili nei grassi)', months: [6, 7, 8, 9, 10], nutrition: { kcal: 45, protein: 1.4, carbs: 10, fats: 0.1, fiber: 1.7 }, micros: ['vitamin_c'] },
  { id: '5', name: 'Zucchine', category: 'Verdura', fodmapLevel: 'low', months: [5, 6, 7, 8, 9], nutrition: { kcal: 17, protein: 1.2, carbs: 3.1, fats: 0.3, fiber: 1 }, micros: ['potassium', 'folate'] },
  { id: '6', name: 'Carote', category: 'Verdura', fodmapLevel: 'low', nutrition: { kcal: 41, protein: 0.9, carbs: 9.6, fats: 0.2, fiber: 2.8 }, micros: ['vitamin_a', 'potassium'] },
  { id: '7', name: 'Carciofi e Scalogno', category: 'Verdura', fodmapLevel: 'high', triggerGroup: 'Fruttani', alternative: 'Finocchi (porzione moderata) o ravanelli', months: [1, 2, 3, 4, 5, 10, 11, 12], nutrition: { kcal: 47, protein: 3.3, carbs: 10.5, fats: 0.2, fiber: 5.4 }, micros: ['folate', 'magnesium', 'potassium'] },
  { id: '19', name: 'Spinaci freschi', category: 'Verdura', fodmapLevel: 'low', months: [1, 2, 3, 4, 5, 9, 10, 11, 12], nutrition: { kcal: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2 }, micros: ['iron', 'folate', 'magnesium', 'vitamin_a'] },
  { id: '20', name: 'Finocchio', category: 'Verdura', fodmapLevel: 'low', months: [1, 2, 3, 4, 9, 10, 11, 12], nutrition: { kcal: 31, protein: 1.2, carbs: 7.3, fats: 0.2, fiber: 3.1 }, micros: ['potassium', 'vitamin_c'] },
  { id: '21', name: 'Peperoni', category: 'Verdura', fodmapLevel: 'low', months: [6, 7, 8, 9, 10], nutrition: { kcal: 26, protein: 1, carbs: 6, fats: 0.3, fiber: 2.1 }, micros: ['vitamin_c', 'vitamin_a'] },
  { id: '22', name: 'Pomodori', category: 'Verdura', fodmapLevel: 'low', months: [6, 7, 8, 9], nutrition: { kcal: 18, protein: 0.9, carbs: 3.9, fats: 0.2, fiber: 1.2 }, micros: ['potassium', 'vitamin_c'] },
  { id: '23', name: 'Cavolfiore', category: 'Verdura', fodmapLevel: 'high', triggerGroup: 'Polioli', alternative: 'Broccoli (cimette) o verza in porzioni controllate', months: [1, 2, 3, 4, 10, 11, 12], nutrition: { kcal: 25, protein: 1.9, carbs: 5, fats: 0.3, fiber: 2 }, micros: ['vitamin_c', 'folate'] },
  { id: '24', name: 'Patate', category: 'Verdura', fodmapLevel: 'low', months: [8, 9, 10], nutrition: { kcal: 77, protein: 2, carbs: 17, fats: 0.1, fiber: 2.2 }, micros: ['potassium', 'vitamin_c'] },
  { id: '25', name: 'Zucca (butternut)', category: 'Verdura', fodmapLevel: 'low', months: [1, 9, 10, 11, 12], nutrition: { kcal: 45, protein: 1, carbs: 11.7, fats: 0.1, fiber: 2 }, micros: ['vitamin_a', 'potassium'] },
  { id: '26', name: 'Melanzane', category: 'Verdura', fodmapLevel: 'low', months: [6, 7, 8, 9], nutrition: { kcal: 25, protein: 1, carbs: 5.9, fats: 0.2, fiber: 3 }, micros: ['potassium', 'folate'] },

  // FRUTTA
  { id: '8', name: 'Mele e Pere', category: 'Frutta', fodmapLevel: 'high', triggerGroup: 'Fruttosio', alternative: 'Fragole, mirtilli, arance o kiwi', months: [1, 2, 8, 9, 10, 11, 12], nutrition: { kcal: 52, protein: 0.3, carbs: 14, fats: 0.2, fiber: 2.4 }, micros: ['vitamin_c', 'potassium'] },
  { id: '9', name: 'Fragole e Mirtilli', category: 'Frutta', fodmapLevel: 'low', months: [4, 5, 6, 7, 8, 9], nutrition: { kcal: 40, protein: 0.7, carbs: 9, fats: 0.3, fiber: 2 }, micros: ['vitamin_c', 'folate'] },
  { id: '10', name: 'Anguria', category: 'Frutta', fodmapLevel: 'high', triggerGroup: 'Polioli', alternative: 'Melone cantalupo (in porzioni controllate)', months: [6, 7, 8, 9], nutrition: { kcal: 30, protein: 0.6, carbs: 7.6, fats: 0.2, fiber: 0.4 }, micros: ['vitamin_a', 'vitamin_c'] },
  { id: '27', name: 'Arance e Mandarini', category: 'Frutta', fodmapLevel: 'low', months: [1, 2, 3, 4, 11, 12], nutrition: { kcal: 47, protein: 0.9, carbs: 11.8, fats: 0.1, fiber: 2.4 }, micros: ['vitamin_c', 'folate'] },
  { id: '28', name: 'Kiwi', category: 'Frutta', fodmapLevel: 'low', months: [1, 2, 3, 11, 12], nutrition: { kcal: 61, protein: 1.1, carbs: 14.7, fats: 0.5, fiber: 3 }, micros: ['vitamin_c'] },
  { id: '29', name: 'Banana (soda, non matura)', category: 'Frutta', fodmapLevel: 'low', nutrition: { kcal: 89, protein: 1.1, carbs: 22.8, fats: 0.3, fiber: 2.6 }, micros: ['potassium', 'magnesium'] },
  { id: '30', name: 'Melone cantalupo', category: 'Frutta', fodmapLevel: 'low', months: [6, 7, 8, 9], nutrition: { kcal: 34, protein: 0.8, carbs: 8.2, fats: 0.2, fiber: 0.9 }, micros: ['vitamin_a', 'potassium'] },
  { id: '31', name: 'Ananas', category: 'Frutta', fodmapLevel: 'low', nutrition: { kcal: 50, protein: 0.5, carbs: 13.1, fats: 0.1, fiber: 1.4 }, micros: ['vitamin_c'] },
  { id: '32', name: 'Ciliegie', category: 'Frutta', fodmapLevel: 'high', triggerGroup: 'Polioli', alternative: 'Uva (porzione controllata) o fragole', months: [5, 6, 7], nutrition: { kcal: 63, protein: 1.1, carbs: 16, fats: 0.2, fiber: 2.1 }, micros: ['potassium', 'vitamin_c'] },

  // LATTIOSI E PROTEINE
  { id: '11', name: 'Latte vaccino e Formaggi freschi', category: 'Proteine/Formaggi', fodmapLevel: 'high', triggerGroup: 'Lattosio', alternative: 'Latte senza lattosio o formaggi stagionati (Parmigiano Reggiano)', nutrition: { kcal: 61, protein: 3.2, carbs: 4.8, fats: 3.3, fiber: 0 }, micros: ['calcium', 'vitamin_d', 'b12'] },
  { id: '12', name: 'Parmigiano Reggiano / Grana Padano', category: 'Proteine/Formaggi', fodmapLevel: 'low', nutrition: { kcal: 431, protein: 38, carbs: 4.1, fats: 29, fiber: 0 }, micros: ['calcium', 'zinc', 'b12'] },
  { id: '13', name: 'Uova e Carne fresca', category: 'Proteine/Formaggi', fodmapLevel: 'low', nutrition: { kcal: 155, protein: 22, carbs: 0.5, fats: 7, fiber: 0 }, micros: ['b12', 'zinc', 'iron', 'selenium'] },
  { id: '14', name: 'Legumi (Fagioli, Lenticchie comuni)', category: 'Proteine/Formaggi', fodmapLevel: 'high', triggerGroup: 'Galattani', alternative: 'Tofu sodo o lenticchie in scatola scolate e risciacquate molto bene', nutrition: { kcal: 116, protein: 9, carbs: 20, fats: 0.4, fiber: 7.9 }, micros: ['iron', 'folate', 'magnesium', 'zinc'] },
  { id: '33', name: 'Petto di Pollo / Tacchino', category: 'Proteine/Formaggi', fodmapLevel: 'low', nutrition: { kcal: 135, protein: 27, carbs: 0, fats: 3, fiber: 0 }, micros: ['zinc', 'b12', 'selenium'] },
  { id: '34', name: 'Pesce azzurro (Sarde, Sgombro)', category: 'Proteine/Formaggi', fodmapLevel: 'low', nutrition: { kcal: 208, protein: 25, carbs: 0, fats: 11.5, fiber: 0 }, micros: ['omega3', 'vitamin_d', 'b12', 'iodine', 'selenium'] },
  { id: '35', name: 'Tofu sodo', category: 'Proteine/Formaggi', fodmapLevel: 'low', nutrition: { kcal: 76, protein: 8, carbs: 1.9, fats: 4.8, fiber: 0.3 }, micros: ['calcium', 'magnesium'] },
  { id: '36', name: 'Yogurt greco senza lattosio', category: 'Proteine/Formaggi', fodmapLevel: 'low', nutrition: { kcal: 59, protein: 10, carbs: 3.6, fats: 0.4, fiber: 0 }, micros: ['calcium', 'b12'] },

  // CONDIMENTI, GRASSI E ALTRI
  { id: '37', name: 'Olio EVO', category: 'Condimenti/Altro', fodmapLevel: 'low', nutrition: { kcal: 884, protein: 0, carbs: 0, fats: 100, fiber: 0 }, micros: ['vitamin_e'] },
  { id: '38', name: 'Mandorle (max ~10)', category: 'Condimenti/Altro', fodmapLevel: 'low', nutrition: { kcal: 579, protein: 21, carbs: 21.6, fats: 49.9, fiber: 12.5 }, micros: ['magnesium', 'vitamin_e', 'calcium'] },
  { id: '39', name: 'Semi di Chia', category: 'Condimenti/Altro', fodmapLevel: 'low', nutrition: { kcal: 486, protein: 16.5, carbs: 42.1, fats: 30.7, fiber: 34.4 }, micros: ['omega3', 'calcium', 'magnesium'] },
  { id: '40', name: 'Semi di Zucca', category: 'Condimenti/Altro', fodmapLevel: 'low', nutrition: { kcal: 559, protein: 30.2, carbs: 10.7, fats: 49, fiber: 6 }, micros: ['magnesium', 'zinc', 'iron'] },
  { id: '41', name: 'Cioccolato fondente ≥70%', category: 'Condimenti/Altro', fodmapLevel: 'low', nutrition: { kcal: 598, protein: 7.8, carbs: 45.9, fats: 42.6, fiber: 10.9 }, micros: ['magnesium', 'iron', 'zinc'] },
  { id: '42', name: 'Miele', category: 'Condimenti/Altro', fodmapLevel: 'high', triggerGroup: 'Fruttosio', alternative: 'Sciroppo d\'acero o zucchero da tavola (saccarosio)', nutrition: { kcal: 304, protein: 0.3, carbs: 82.4, fats: 0, fiber: 0.2 } },
  { id: '43', name: 'Sciroppo d\'Acero', category: 'Condimenti/Altro', fodmapLevel: 'low', nutrition: { kcal: 260, protein: 0, carbs: 67, fats: 0.1, fiber: 0 }, micros: ['zinc'] },
  { id: '44', name: 'Zenzero fresco', category: 'Condimenti/Altro', fodmapLevel: 'low', nutrition: { kcal: 80, protein: 1.8, carbs: 17.8, fats: 0.8, fiber: 2 }, micros: ['potassium', 'magnesium'] }
];
