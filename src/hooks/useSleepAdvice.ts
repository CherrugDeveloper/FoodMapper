import { useMemo, useCallback } from 'react';
import type { SleepSession, SleepStats, SleepSettings } from './useSleepTracking';
import type { NutritionalResults } from '../utils/nutritionEngine';

// ============================================
// Types
// ============================================

export interface SleepAdvice {
  id: string;
  category: 'schedule' | 'environment' | 'nutrition' | 'routine' | 'supplements' | 'ibs' | 'general';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionable: boolean;
  actionText?: string;
  actionCallback?: () => void;
  evidence: string; // Reference to scientific evidence
  tags: string[];
}

export interface SleepPatternAnalysis {
  avgBedTime: string; // HH:MM
  avgWakeTime: string; // HH:MM
  bedTimeVariability: number; // minutes std dev
  wakeTimeVariability: number; // minutes std dev
  avgDuration: number; // minutes
  avgEfficiency: number; // percentage
  avgQuality: number; // 0-100
  avgLatency: number; // minutes
  deepSleepPct: number;
  remSleepPct: number;
  lightSleepPct: number;
  awakePct: number;
  sleepDebt: number; // minutes
  consistencyScore: number; // 0-100
  chronotype: 'morning' | 'evening' | 'intermediate';
  recommendedBedTime: string;
  recommendedWakeTime: string;
  optimalDuration: number;
}

export interface PersonalizedRecommendations {
  schedule: SleepAdvice[];
  environment: SleepAdvice[];
  nutrition: SleepAdvice[];
  routine: SleepAdvice[];
  supplements: SleepAdvice[];
  ibs: SleepAdvice[];
  general: SleepAdvice[];
  all: SleepAdvice[];
  patternAnalysis: SleepPatternAnalysis;
  getHighPriorityActions: () => SleepAdvice[];
  getNextAction: () => SleepAdvice | null;
}

// ============================================
// Constants
// ============================================

const EVIDENCE_SOURCES = {
  schedule: 'Basato su: Consensus Statement AASM/SRS 2017; Walker MP "Why We Sleep" 2017',
  environment: 'Basato su: NIH Sleep Hygiene Guidelines; Cajochen et al. "Evening light exposure" 2011',
  nutrition: 'Basato su: Afaghi et al. "High-carb meal before sleep" 2007; Peuhkuri et al. "Diet and sleep" 2012',
  routine: 'Basato su: CBT-I protocols; Riemann et al. "Sleep hygiene" 2016',
  supplements: 'Basato su: Buscemi et al. "Melatonin for sleep disorders" 2005; Abbasi et al. "Magnesium" 2012',
  ibs: 'Basato su: Monash University FODMAP Guidelines; Heitkemper et al. "IBS and sleep" 2018',
};

// ============================================
// Helper Functions
// ============================================

const parseTime = (time: string): { hours: number; minutes: number } => {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
};

const formatTime = (hours: number, minutes: number): string => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const timeToMinutes = (time: string): number => {
  const { hours, minutes } = parseTime(time);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return formatTime(h, m);
};

const calculateStdDev = (values: number[]): number => {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
};

const determineChronotype = (avgBedTime: string, avgWakeTime: string): 'morning' | 'evening' | 'intermediate' => {
  const bedMinutes = timeToMinutes(avgBedTime);
  const wakeMinutes = timeToMinutes(avgWakeTime);
  const midSleep = (bedMinutes + (wakeMinutes + (wakeMinutes < bedMinutes ? 24 * 60 : 0))) / 2;
  const midSleepMod = midSleep % (24 * 60);
  
  // Morning: mid-sleep before 3:30 AM, Evening: after 5:30 AM
  if (midSleepMod < 3.5 * 60) return 'morning';
  if (midSleepMod > 5.5 * 60) return 'evening';
  return 'intermediate';
};

// Get bed/wake time from session (derived from startTime/endTime)
const getSessionBedTime = (session: SleepSession): string => {
  return new Date(session.startTime).toTimeString().slice(0, 5);
};

const getSessionWakeTime = (session: SleepSession): string => {
  return session.endTime ? new Date(session.endTime).toTimeString().slice(0, 5) : '06:00';
};

// ============================================
// Main Hook
// ============================================

export function useSleepAdvice(
  sessions: SleepSession[],
  stats: SleepStats,
  settings: SleepSettings,
  nutritionalResults: NutritionalResults | null,
  ibsSubtype?: string
): PersonalizedRecommendations {
  
  // Analyze sleep patterns
  const patternAnalysis = useMemo((): SleepPatternAnalysis => {
    const completedSessions = sessions.filter(s => s.endTime);
    
    if (completedSessions.length === 0) {
      return {
        avgBedTime: '22:00',
        avgWakeTime: '06:00',
        bedTimeVariability: 0,
        wakeTimeVariability: 0,
        avgDuration: 0,
        avgEfficiency: 0,
        avgQuality: 0,
        avgLatency: 0,
        deepSleepPct: 0,
        remSleepPct: 0,
        lightSleepPct: 0,
        awakePct: 0,
        sleepDebt: 0,
        consistencyScore: 0,
        chronotype: 'intermediate',
        recommendedBedTime: '22:00',
        recommendedWakeTime: '06:00',
        optimalDuration: settings.targetDuration,
      };
    }
    
    // Last 14 days for pattern analysis
    const recentSessions = completedSessions.slice(-14);
    
    const bedTimes = recentSessions.map(s => timeToMinutes(getSessionBedTime(s)));
    const wakeTimes = recentSessions.map(s => {
      const wt = getSessionWakeTime(s);
      let mins = timeToMinutes(wt);
      // Handle next day
      const bedMins = timeToMinutes(getSessionBedTime(s));
      if (mins <= bedMins) mins += 24 * 60;
      return mins;
    });
    
    const avgBedMinutes = Math.round(bedTimes.reduce((a, b) => a + b, 0) / bedTimes.length);
    const avgWakeMinutes = Math.round(wakeTimes.reduce((a, b) => a + b, 0) / wakeTimes.length);
    
    const bedTimeVariability = calculateStdDev(bedTimes);
    const wakeTimeVariability = calculateStdDev(wakeTimes);
    
    const avgDuration = recentSessions.reduce((a, b) => a + b.duration, 0) / recentSessions.length;
    const avgEfficiency = recentSessions.reduce((a, b) => a + b.efficiency, 0) / recentSessions.length;
    const avgQuality = recentSessions.reduce((a, b) => a + b.quality, 0) / recentSessions.length;
    const avgLatency = recentSessions.reduce((a, b) => a + b.sleepLatency, 0) / recentSessions.length;
    
    // Phase percentages
    let totalDeep = 0, totalRem = 0, totalLight = 0, totalAwake = 0, totalSleep = 0;
    recentSessions.forEach(s => {
      s.phases.forEach(p => {
        if (p.phase === 'deep') totalDeep += p.duration;
        else if (p.phase === 'rem') totalRem += p.duration;
        else if (p.phase === 'light') totalLight += p.duration;
        else if (p.phase === 'awake') totalAwake += p.duration;
        if (p.phase !== 'awake') totalSleep += p.duration;
      });
    });
    
    const deepSleepPct = totalSleep > 0 ? (totalDeep / totalSleep) * 100 : 0;
    const remSleepPct = totalSleep > 0 ? (totalRem / totalSleep) * 100 : 0;
    const lightSleepPct = totalSleep > 0 ? (totalLight / totalSleep) * 100 : 0;
    const awakePct = totalSleep > 0 ? (totalAwake / (totalSleep + totalAwake)) * 100 : 0;
    
    const sleepDebt = stats.totalSleepDebt;
    
    // Consistency score (inverse of variability)
    const avgVariability = (bedTimeVariability + wakeTimeVariability) / 2;
    const consistencyScore = Math.max(0, 100 - avgVariability * 2);
    
    const chronotype = determineChronotype(
      minutesToTime(avgBedMinutes),
      minutesToTime(avgWakeMinutes % (24 * 60))
    );
    
    // Calculate optimal schedule based on chronotype and target duration
    let recommendedBedTime: string;
    let recommendedWakeTime: string;
    
    if (chronotype === 'morning') {
      recommendedWakeTime = '05:30';
      recommendedBedTime = minutesToTime(timeToMinutes(recommendedWakeTime) - settings.targetDuration - 15);
    } else if (chronotype === 'evening') {
      recommendedBedTime = '23:30';
      recommendedWakeTime = minutesToTime(timeToMinutes(recommendedBedTime) + settings.targetDuration + 15);
    } else {
      recommendedBedTime = '22:30';
      recommendedWakeTime = minutesToTime(timeToMinutes(recommendedBedTime) + settings.targetDuration + 15);
    }
    
    return {
      avgBedTime: minutesToTime(avgBedMinutes),
      avgWakeTime: minutesToTime(avgWakeMinutes % (24 * 60)),
      bedTimeVariability: Math.round(bedTimeVariability),
      wakeTimeVariability: Math.round(wakeTimeVariability),
      avgDuration: Math.round(avgDuration),
      avgEfficiency: Math.round(avgEfficiency),
      avgQuality: Math.round(avgQuality),
      avgLatency: Math.round(avgLatency),
      deepSleepPct: Math.round(deepSleepPct * 10) / 10,
      remSleepPct: Math.round(remSleepPct * 10) / 10,
      lightSleepPct: Math.round(lightSleepPct * 10) / 10,
      awakePct: Math.round(awakePct * 10) / 10,
      sleepDebt,
      consistencyScore: Math.round(consistencyScore),
      chronotype,
      recommendedBedTime,
      recommendedWakeTime,
      optimalDuration: settings.targetDuration,
    };
  }, [sessions, stats, settings.targetDuration]);

  // Generate advice array
  const advice = useMemo(() => {
    const result: SleepAdvice[] = [];
    const pa = patternAnalysis;
    
    // ========== SCHEDULE RECOMMENDATIONS ==========
    
    if (pa.consistencyScore < 70) {
      result.push({
        id: 'schedule-consistency',
        category: 'schedule',
        priority: 'high',
        title: 'Regolarizza orari sonno',
        description: `I tuoi orari variano di ±${Math.max(pa.bedTimeVariability, pa.wakeTimeVariability)} min. La regolarità è il fattore #1 per qualità sonno.`,
        actionable: true,
        actionText: 'Imposta sveglia costante',
        evidence: EVIDENCE_SOURCES.schedule,
        tags: ['consistency', 'circadian'],
      });
    }
    
    if (pa.avgDuration < settings.targetDuration - 30) {
      const deficit = settings.targetDuration - pa.avgDuration;
      result.push({
        id: 'schedule-duration',
        category: 'schedule',
        priority: 'high',
        title: `Aumenta durata sonno di ${deficit} min`,
        description: `Dormi in media ${Math.round(pa.avgDuration/60)}h ${pa.avgDuration%60}min vs target ${Math.round(settings.targetDuration/60)}h. Il debito accumulato: ${pa.sleepDebt} min.`,
        actionable: true,
        actionText: 'Anticipa orario letto',
        evidence: EVIDENCE_SOURCES.schedule,
        tags: ['duration', 'sleep-debt'],
      });
    }
    
    if (pa.avgLatency > 30) {
      result.push({
        id: 'schedule-latency',
        category: 'schedule',
        priority: 'medium',
        title: 'Riduci latenza addormentamento',
        description: `Impieghi ${pa.avgLatency} min per addormentarti (target <20 min). Prova routine rilassante 30-60 min prima.`,
        actionable: true,
        actionText: 'Attiva wind-down',
        evidence: EVIDENCE_SOURCES.routine,
        tags: ['latency', 'wind-down'],
      });
    }
    
    // Optimal schedule recommendation
    if (pa.avgBedTime !== pa.recommendedBedTime || pa.avgWakeTime !== pa.recommendedWakeTime) {
      result.push({
        id: 'schedule-optimal',
        category: 'schedule',
        priority: 'medium',
        title: 'Orario ottimale per tuo cronotipo',
        description: `Sei ${pa.chronotype === 'morning' ? 'mattiniero' : pa.chronotype === 'evening' ? 'serale' : 'intermedio'}. Orario ideale: ${pa.recommendedBedTime}-${pa.recommendedWakeTime}.`,
        actionable: true,
        actionText: 'Imposta sveglia consigliata',
        evidence: EVIDENCE_SOURCES.schedule,
        tags: ['chronotype', 'optimal-timing'],
      });
    }
    
    // ========== ENVIRONMENT RECOMMENDATIONS ==========
    
    result.push({
      id: 'env-temperature',
      category: 'environment',
      priority: 'high',
      title: 'Temperatura camera 18-20°C',
      description: 'Il corpo deve abbassare la temperatura centrale per iniziare il sonno. Camera troppo calda impedisce sonno profondo.',
      actionable: true,
      actionText: 'Regola termostato',
      evidence: EVIDENCE_SOURCES.environment,
      tags: ['temperature', 'deep-sleep'],
    });
    
    result.push({
      id: 'env-darkness',
      category: 'environment',
      priority: 'high',
      title: 'Buio totale (tapparelle/tende blackout)',
      description: 'Anche minima luce sopprime melatonina. Usa mascherina se necessario. Elimina LED dispositivi.',
      actionable: true,
      actionText: 'Controlla buio camera',
      evidence: EVIDENCE_SOURCES.environment,
      tags: ['darkness', 'melatonin'],
    });
    
    result.push({
      id: 'env-noise',
      category: 'environment',
      priority: 'medium',
      title: 'Riduci rumori o usa white noise',
      description: 'Rumori intermittenti frammentano sonno. White/pink noise maschera suoni ambientali.',
      actionable: true,
      actionText: 'Attiva suoni sonno',
      evidence: EVIDENCE_SOURCES.environment,
      tags: ['noise', 'white-noise'],
    });
    
    // ========== NUTRITION RECOMMENDATIONS ==========
    
    if (nutritionalResults) {
      result.push({
        id: 'nutrition-caffeine',
        category: 'nutrition',
        priority: 'high',
        title: 'Caffeina: stop 8-10h prima letto',
        description: 'Emivita caffeina ~5-6h. Anche se "non ti dà fastidio", riduce sonno profondo del 20%.',
        actionable: true,
        actionText: 'Calcola cutoff caffeina',
        evidence: EVIDENCE_SOURCES.nutrition,
        tags: ['caffeine', 'deep-sleep'],
      });
      
      result.push({
        id: 'nutrition-alcohol',
        category: 'nutrition',
        priority: 'high',
        title: 'Alcol: evita 3-4h prima letto',
        description: 'Alcol aiuta addormentamento ma frammenta seconda metà notte, sopprime REM, peggiora apnee.',
        actionable: true,
        actionText: 'Limita alcol serale',
        evidence: EVIDENCE_SOURCES.nutrition,
        tags: ['alcohol', 'rem-sleep'],
      });
      
      if (nutritionalResults.proteins > 0) {
        result.push({
          id: 'nutrition-protein',
          category: 'nutrition',
          priority: 'low',
          title: 'Proteine serali: triptofano per melatonina',
          description: `Target proteine: ${nutritionalResults.proteins}g. Fonti triptofano (tacchino, uova, latticini, noci) a cena favoriscono sonno.`,
          actionable: false,
          evidence: EVIDENCE_SOURCES.nutrition,
          tags: ['tryptophan', 'melatonin'],
        });
      }
      
      if (nutritionalResults.fiber < 25) {
        result.push({
          id: 'nutrition-fiber',
          category: 'nutrition',
          priority: 'medium',
          title: 'Aumenta fibre per sonno profondo',
          description: 'Studio: maggior apporto fibre → più sonno profondo, meno risvegli. Target: 25-30g/die.',
          actionable: false,
          evidence: EVIDENCE_SOURCES.nutrition,
          tags: ['fiber', 'deep-sleep'],
        });
      }
    }
    
    // ========== ROUTINE RECOMMENDATIONS ==========
    
    result.push({
      id: 'routine-winddown',
      category: 'routine',
      priority: 'high',
      title: `Routine wind-down ${settings.windDownDuration} min`,
      description: 'Attività rilassanti (lettura, stretching, meditazione, bagno caldo) segnalano al cervello che è ora di dormire. No schermi.',
      actionable: true,
      actionText: 'Avvia wind-down',
      evidence: EVIDENCE_SOURCES.routine,
      tags: ['wind-down', 'relaxation'],
    });
    
    result.push({
      id: 'routine-screens',
      category: 'routine',
      priority: 'high',
      title: 'Niente schermi 60 min prima letto',
      description: 'Luce blu sopprime melatonina 50%+. Usa filtro luce blu o modalità notte se indispensabile.',
      actionable: true,
      actionText: 'Attiva filtro luce blu',
      evidence: EVIDENCE_SOURCES.environment,
      tags: ['blue-light', 'melatonin'],
    });
    
    if (pa.avgLatency > 20) {
      result.push({
        id: 'routine-breathing',
        category: 'routine',
        priority: 'medium',
        title: 'Tecnica 4-7-8 o box breathing',
        description: 'Respirazione diafrattica attiva sistema parasimpatico. 4-7-8: inspira 4, trattieni 7, espira 8. Ripeti 4x.',
        actionable: true,
        actionText: 'Prova respirazione',
        evidence: EVIDENCE_SOURCES.routine,
        tags: ['breathing', 'parasympathetic'],
      });
    }
    
    // ========== SUPPLEMENTS RECOMMENDATIONS ==========
    
    result.push({
      id: 'supp-melatonin',
      category: 'supplements',
      priority: 'low',
      title: 'Melatonina 0.5-1mg 30-60 min prima letto',
      description: 'Utile per jet lag, turnisti, >55 anni. Non usare cronicamente senza medico. Dose bassa più efficace.',
      actionable: false,
      evidence: EVIDENCE_SOURCES.supplements,
      tags: ['melatonin', 'supplement'],
    });
    
    result.push({
      id: 'supp-magnesium',
      category: 'supplements',
      priority: 'medium',
      title: 'Magnesio glicinato/bisglicinato 200-400mg sera',
      description: 'Rilassa muscoli, regola GABA, migliora sonno profondo. Forma glicinato = migliore assorbimento, meno diarrea.',
      actionable: false,
      evidence: EVIDENCE_SOURCES.supplements,
      tags: ['magnesium', 'glycinate', 'deep-sleep'],
    });
    
    result.push({
      id: 'supp-glycine',
      category: 'supplements',
      priority: 'low',
      title: 'Glicina 3g 30 min prima letto',
      description: 'Abbassa temperatura corporea, migliora qualità sonno soggettiva e performance cognitive giorno dopo.',
      actionable: false,
      evidence: EVIDENCE_SOURCES.supplements,
      tags: ['glycine', 'body-temp'],
    });
    
    // Medical disclaimer for supplements
    result.push({
      id: 'supp-disclaimer',
      category: 'supplements',
      priority: 'low',
      title: '⚠️ Consulta medico prima supplementi',
      description: 'Interazioni con farmaci, condizioni renali/epatiche, gravidanza. Questo non è consiglio medico.',
      actionable: false,
      evidence: 'Disclaimer medico obbligatorio',
      tags: ['disclaimer', 'medical'],
    });
    
    // ========== IBS-SPECIFIC RECOMMENDATIONS ==========
    
    if (ibsSubtype) {
      result.push({
        id: 'ibs-position',
        category: 'ibs',
        priority: 'high',
        title: 'Posizione sonno: lato sinistro per reflusso',
        description: 'Dormire sul lato sinistro riduce reflusso notturno (anatomia stomaco-esofago). Usa cuscino wedge se necessario.',
        actionable: true,
        actionText: 'Prova lato sinistro',
        evidence: EVIDENCE_SOURCES.ibs,
        tags: ['reflux', 'position', 'left-side'],
      });
      
      result.push({
        id: 'ibs-meal-timing',
        category: 'ibs',
        priority: 'high',
        title: 'Ultimo pasto 3-4h prima letto',
        description: 'Stomaco vuoto riduce reflusso, fermentazione notturna, gonfiore mattutino. Se fame: spuntino low-FODMAP leggero.',
        actionable: true,
        actionText: 'Pianifica cena anticipata',
        evidence: EVIDENCE_SOURCES.ibs,
        tags: ['meal-timing', 'reflux', 'bloating'],
      });
      
      if (ibsSubtype === 'IBS-C' || ibsSubtype === 'IBS-M') {
        result.push({
          id: 'ibs-constipation',
          category: 'ibs',
          priority: 'medium',
          title: 'Idratazione serale + magnesio per transito',
          description: 'Stipsi notturna disturba sonno. Acqua + magnesio glicinato sera favorisce evacuazione mattutina.',
          actionable: true,
          actionText: 'Bevi acqua + magnesio',
          evidence: EVIDENCE_SOURCES.ibs,
          tags: ['constipation', 'magnesium', 'transit'],
        });
      }
      
      if (ibsSubtype === 'IBS-D' || ibsSubtype === 'IBS-M') {
        result.push({
          id: 'ibs-diarrhea',
          category: 'ibs',
          priority: 'medium',
          title: 'Evita trigger serali: caffeina, alcol, grassi, piccante',
          description: 'Questi stimolano motilità e secrezioni. Cena low-FODMAP, bassa grassa, tiepida riduce urgenza notturna.',
          actionable: true,
          actionText: 'Pianifica cena sicura',
          evidence: EVIDENCE_SOURCES.ibs,
          tags: ['diarrhea', 'triggers', 'low-fodmap'],
        });
      }
      
      result.push({
        id: 'ibs-symptom-tracking',
        category: 'ibs',
        priority: 'medium',
        title: 'Traccia sintomi notturni nel Diario',
        description: 'Correla sonno vs sintomi IBS per identificare pattern. Usa sezione "Sintomi" e "Transito" nel Diario.',
        actionable: true,
        actionText: 'Apri Diario',
        evidence: EVIDENCE_SOURCES.ibs,
        tags: ['tracking', 'correlation'],
      });
    }
    
    // ========== GENERAL RECOMMENDATIONS ==========
    
    if (pa.deepSleepPct < 15) {
      result.push({
        id: 'general-deep-sleep',
        category: 'general',
        priority: 'medium',
        title: 'Aumenta sonno profondo (<15% attuale)',
        description: 'Sonno profondo essenziale per riparazione tessuti, memoria, sistema immunitario. Strategie: esercizio regolare, temperatura fresca, no alcol, magnesio.',
        actionable: false,
        evidence: EVIDENCE_SOURCES.schedule,
        tags: ['deep-sleep', 'recovery'],
      });
    }
    
    if (pa.remSleepPct < 18) {
      result.push({
        id: 'general-rem-sleep',
        category: 'general',
        priority: 'medium',
        title: 'Ottimizza sonno REM (<18% attuale)',
        description: 'REM cruciale per elaborazione emotiva, creatività, memoria. Protetto da: orari regolari, no alcol, gestione stress, durata sufficiente (>7h).',
        actionable: false,
        evidence: EVIDENCE_SOURCES.schedule,
        tags: ['rem-sleep', 'emotional-regulation'],
      });
    }
    
    if (pa.awakePct > 10) {
      result.push({
        id: 'general-awake',
        category: 'general',
        priority: 'medium',
        title: 'Riduci tempo sveglio a letto (>10%)',
        description: 'Tempo sveglio a letto >10% indica insonnia o frammentazione. Terapia: restrizione tempo a letto (CBT-I), esci dal letto se non dormi in 20 min.',
        actionable: true,
        actionText: 'Prova restrizione letto',
        evidence: EVIDENCE_SOURCES.routine,
        tags: ['wake-time', 'cbt-i'],
      });
    }
    
    return result;
  }, [patternAnalysis, settings, nutritionalResults, ibsSubtype]);
  
  // Helper functions — stable because `advice` is memoized
  const getHighPriorityActions = useCallback((): SleepAdvice[] => {
    return advice.filter(a => a.priority === 'high' && a.actionable);
  }, [advice]);

  const getNextAction = useCallback((): SleepAdvice | null => {
    const highPriority = getHighPriorityActions();
    return highPriority.length > 0 ? highPriority[0] : null;
  }, [getHighPriorityActions]);
  
  // Group by category and build recommendations
  const recommendations = useMemo(() => {
    const categoryKeys = ['schedule', 'environment', 'nutrition', 'routine', 'supplements', 'ibs', 'general'] as const;
    
    const grouped = categoryKeys.reduce((acc, cat) => {
      acc[cat] = advice.filter(a => a.category === cat).sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      return acc;
    }, {} as Record<typeof categoryKeys[number], SleepAdvice[]>);
    
    return {
      ...grouped,
      all: [...advice].sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),
      patternAnalysis,
      getHighPriorityActions,
      getNextAction,
    };
  }, [advice, patternAnalysis]);

  return recommendations;
}

// ============================================
// Utility: Calculate optimal bedtime based on wake time
// ============================================

export function calculateOptimalBedtime(
  wakeTime: string,
  _targetDuration: number,
  sleepLatency: number = 15,
  cycles: number = 5
): { bedTime: string; cycles: number; totalMinutes: number } {
  const { hours, minutes } = parseTime(wakeTime);
  const wakeMinutes = hours * 60 + minutes;
  
  const cycleMinutes = 90;
  const totalSleepMinutes = cycles * cycleMinutes;
  const totalMinutes = totalSleepMinutes + sleepLatency;
  
  let bedMinutes = wakeMinutes - totalMinutes;
  if (bedMinutes < 0) bedMinutes += 24 * 60;
  
  return {
    bedTime: minutesToTime(bedMinutes),
    cycles,
    totalMinutes,
  };
}

// ============================================
// Utility: Generate bedtime reminder notification
// ============================================

export function scheduleBedtimeReminder(
  bedtime: string,
  windDownMinutes: number,
  onReminder: () => void
): (() => void) {
  const { hours, minutes } = parseTime(bedtime);
  const bedtimeMinutes = hours * 60 + minutes;
  const reminderMinutes = bedtimeMinutes - windDownMinutes;
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  let delay = reminderMinutes - currentMinutes;
  if (delay <= 0) delay += 24 * 60; // Tomorrow
  
  const timeoutId = setTimeout(onReminder, delay * 60 * 1000);
  
  return () => clearTimeout(timeoutId);
}