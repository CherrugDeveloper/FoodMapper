export interface FoodItem {
  id: string;
  name: string;
  category: 'Carboidrati/Cereali' | 'Proteine/Formaggi' | 'Verdura' | 'Frutta' | 'Condimenti/Altro';
  fodmapLevel: 'low' | 'high';
  triggerGroup?: 'Fruttani' | 'Lattosio' | 'Fruttosio' | 'Galattani' | 'Polioli';
  alternative?: string;
}

export const FOODS_DATABASE: FoodItem[] = [
  // CEREALI E CARBOIDRATI
  { id: '1', name: 'Pane di Frumento / Pasta comune', category: 'Carboidrati/Cereali', fodmapLevel: 'high', triggerGroup: 'Fruttani', alternative: 'Riso, avena, quinoa o prodotti certificati Gluten-Free' },
  { id: '2', name: 'Riso Bianco e Integrale', category: 'Carboidrati/Cereali', fodmapLevel: 'low' },
  { id: '3', name: 'Avena in fiocchi', category: 'Carboidrati/Cereali', fodmapLevel: 'low' },
  
  // VERDURA
  { id: '4', name: 'Aglio e Cipolla', category: 'Verdura', fodmapLevel: 'high', triggerGroup: 'Fruttani', alternative: 'Erba cipollina o olio infuso all\'aglio (i FODMAP non sono solubili nei grassi)' },
  { id: '5', name: 'Zucchine', category: 'Verdura', fodmapLevel: 'low' },
  { id: '6', name: 'Carote', category: 'Verdura', fodmapLevel: 'low' },
  { id: '7', name: 'Carciofi e Scalogno', category: 'Verdura', fodmapLevel: 'high', triggerGroup: 'Fruttani', alternative: 'Finocchi (porzione moderata) o ravanelli' },

  // FRUTTA
  { id: '8', name: 'Mele e Pere', category: 'Frutta', fodmapLevel: 'high', triggerGroup: 'Fruttosio', alternative: 'Fragole, mirtilli, arance o kiwi' },
  { id: '9', name: 'Fragole e Mirtilli', category: 'Frutta', fodmapLevel: 'low' },
  { id: '10', name: 'Anguria', category: 'Frutta', fodmapLevel: 'high', triggerGroup: 'Polioli', alternative: 'Melone cantalupo (in porzioni controllate)' },

  // LATTIOSI E PROTEINE
  { id: '11', name: 'Latte vaccino e Formaggi freschi', category: 'Proteine/Formaggi', fodmapLevel: 'high', triggerGroup: 'Lattosio', alternative: 'Latte senza lattosio o formaggi stagionati (Parmigiano Reggiano)' },
  { id: '12', name: 'Parmigiano Reggiano / Grana Padano', category: 'Proteine/Formaggi', fodmapLevel: 'low' },
  { id: '13', name: 'Uova e Carne fresca', category: 'Proteine/Formaggi', fodmapLevel: 'low' },
  { id: '14', name: 'Legumi (Fagioli, Lenticchie comuni)', category: 'Proteine/Formaggi', fodmapLevel: 'high', triggerGroup: 'Galattani', alternative: 'Tofu sodo o lenticchie in scatola scolate e risciacquate molto bene' }
];
