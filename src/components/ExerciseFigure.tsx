export type ExerciseAnim = 'walk' | 'squat' | 'twist' | 'swim' | 'breathe' | 'rest' | 'free';

interface ExerciseFigureProps {
  anim: ExerciseAnim;
  className?: string;
}

/**
 * Figura stilizzata animata via CSS (keyframes fm-* in index.css).
 * Ogni variante rappresenta il movimento chiave dell'esercizio.
 */
export default function ExerciseFigure({ anim, className = 'w-20 h-20' }: ExerciseFigureProps) {
  const stroke = 'stroke-(--text-h)';

  const body = (
    <>
      {/* testa */}
      <circle cx="32" cy="12" r="6" className={`${stroke} fill-none`} strokeWidth="2.5" />
      {/* torso */}
      <line x1="32" y1="18" x2="32" y2="38" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
      {/* braccia */}
      <line x1="32" y1="24" x2="18" y2="34" className={`${stroke} ${anim === 'walk' ? 'fm-anim fm-anim-swing-a' : ''}`} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="24" x2="46" y2="34" className={`${stroke} ${anim === 'walk' ? 'fm-anim fm-anim-swing-b' : ''}`} strokeWidth="2.5" strokeLinecap="round" />
      {/* gambe */}
      <line x1="32" y1="38" x2="20" y2="56" className={`${stroke} ${anim === 'walk' ? 'fm-anim fm-anim-swing-b' : ''}`} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="38" x2="44" y2="56" className={`${stroke} ${anim === 'walk' ? 'fm-anim fm-anim-swing-a' : ''}`} strokeWidth="2.5" strokeLinecap="round" />
    </>
  );

  switch (anim) {
    case 'walk':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <g className="fm-anim fm-anim-bob">{body}</g>
          <line x1="10" y1="58" x2="54" y2="58" className="stroke-(--border)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'squat':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <g className="fm-anim fm-anim-squat">{body}</g>
          <line x1="10" y1="58" x2="54" y2="58" className="stroke-(--border)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'twist':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* posizione seduta: gambe piegate fisse, torso che ruota */}
          <line x1="18" y1="58" x2="46" y2="58" className="stroke-(--border)" strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="44" x2="16" y2="58" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="38" y1="44" x2="48" y2="58" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
          <g className="fm-anim fm-anim-twist">
            <line x1="32" y1="44" x2="32" y2="22" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="32" cy="15" r="6" className={`${stroke} fill-none`} strokeWidth="2.5" />
            <line x1="32" y1="28" x2="20" y2="36" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="28" x2="44" y2="36" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );
    case 'swim':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* figura orizzontale che nuota */}
          <g className="fm-anim fm-anim-swim">
            <circle cx="14" cy="30" r="5" className={`${stroke} fill-none`} strokeWidth="2.5" />
            <line x1="19" y1="30" x2="44" y2="30" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="44" y1="30" x2="56" y2="24" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="44" y1="30" x2="56" y2="36" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="30" x2="30" y2="20" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <path d="M8 46 q4 -4 8 0 t8 0 t8 0 t8 0 t8 0 t8 0" className="stroke-(--accent) fill-none" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'breathe':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* figura seduta + diaframma che si espande */}
          <circle cx="32" cy="12" r="6" className={`${stroke} fill-none`} strokeWidth="2.5" />
          <line x1="32" y1="18" x2="32" y2="40" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="30" r="8" className="fm-anim fm-anim-breathe stroke-(--accent) fill-none" strokeWidth="2" />
          <line x1="26" y1="42" x2="16" y2="56" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="38" y1="42" x2="48" y2="56" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'rest':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* figura sdraiata + Zzz */}
          <circle cx="12" cy="44" r="5" className={`${stroke} fill-none`} strokeWidth="2.5" />
          <line x1="17" y1="44" x2="48" y2="44" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="22" y1="44" x2="30" y2="50" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
          <text x="46" y="24" className="fill-(--accent) fm-anim fm-anim-zzz" fontSize="14" fontWeight="bold">Z</text>
          <text x="38" y="34" className="fill-(--accent) fm-anim fm-anim-zzz" fontSize="11" fontWeight="bold" style={{ animationDelay: '0.6s' }}>z</text>
          <line x1="6" y1="56" x2="58" y2="56" className="stroke-(--border)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <g className="fm-anim fm-anim-bob">{body}</g>
          <line x1="10" y1="58" x2="54" y2="58" className="stroke-(--border)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
