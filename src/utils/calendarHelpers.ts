// Calendar helper utilities for saints and moon phases (Italian calendar conventions)

const SAINTS_MAP: Record<string, string> = {
  '01-01': 'S. Maria Madre di Dio',
  '01-06': 'Epifania del Signore',
  '03-19': 'San Giuseppe',
  '04-25': 'Liberazione / S. Marco',
  '05-01': 'San Giuseppe Artigiano',
  '06-02': 'Festa della Repubblica',
  '06-29': 'Santi Pietro e Paolo',
  '08-15': 'Assunzione di Maria',
  '11-01': 'Tutti i Santi',
  '11-02': 'Commemorazione dei Defunti',
  '12-08': 'Immacolata Concezione',
  '12-25': 'Natale del Signore',
  '12-26': 'Santo Stefano',
  // Common saints by month/day approximation
  '01-17': 'Sant\'Antonio Abate',
  '02-14': 'San Valentino',
  '03-08': 'San Giovanni di Dio',
  '04-23': 'San Giorgio',
  '05-13': 'Beata Vergine di Fatima',
  '06-13': 'Sant\'Antonio di Padova',
  '07-25': 'San Giacomo',
  '08-10': 'San Lorenzo',
  '09-29': 'Santi Arcangeli',
  '10-04': 'San Francesco d\'Assisi',
  '11-11': 'San Martino',
  '12-13': 'Santa Lucia',
};

export const getSaintOfDay = (dateStr: string): string => {
  const [, month, day] = dateStr.split('-');
  const key = `${month}-${day}`;
  if (SAINTS_MAP[key]) return SAINTS_MAP[key];

  // Fallback generic saint generation based on date hash
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const commonSaints = [
    'San Silverio', 'Santa Agnese', 'San Bernardo', 'Santa Chiara', 
    'San Domenico', 'Santa Elena', 'San Felice', 'Santa Giulia',
    'San Leone', 'Santa Martina', 'San Nicola', 'Santa Ottavia',
    'San Pasquale', 'Santa Rita', 'San Simone', 'Santa Teresa',
    'San Urbano', 'Santa Viola', 'San Zeno', 'San Bartolomeo'
  ];
  const index = (dayNum + monthNum * 3) % commonSaints.length;
  return commonSaints[index];
};

export const getMoonPhase = (dateStr: string): { icon: string; name: string } => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const baseDate = new Date(2000, 0, 6); // Known New Moon reference
  const diffDays = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const cycle = 29.53058867;
  const phase = ((diffDays % cycle) + cycle) % cycle;

  if (phase < 1.84 || phase > 27.68) {
    return { icon: '🌑', name: 'Luna Nuova' };
  } else if (phase < 5.53) {
    return { icon: '🌒', name: 'Luna Crescente' };
  } else if (phase < 9.22) {
    return { icon: '🌓', name: 'Primo Quarto' };
  } else if (phase < 12.91) {
    return { icon: '🌔', name: 'Gibbosa Crescente' };
  } else if (phase < 16.61) {
    return { icon: '🌕', name: 'Luna Piena' };
  } else if (phase < 20.30) {
    return { icon: '🌖', name: 'Gibbosa Calante' };
  } else if (phase < 23.99) {
    return { icon: '🌗', name: 'Ultimo Quarto' };
  } else {
    return { icon: '🌘', name: 'Luna Calante' };
  }
};
