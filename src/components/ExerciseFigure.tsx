export type ExerciseAnim =
  | 'walk'
  | 'squat'
  | 'twist'
  | 'swim'
  | 'breathe'
  | 'rest'
  | 'free'
  | 'pushup'
  | 'plank'
  | 'lunge'
  | 'jump'
  | 'curl'
  | 'press'
  | 'row'
  | 'calf';

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

  const standingBody = (
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

  const groundLine = (
    <line x1="10" y1="58" x2="54" y2="58" className="stroke-(--border)" strokeWidth="2" strokeLinecap="round" />
  );

  switch (anim) {
    case 'walk':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <g className="fm-anim fm-anim-bob">{standingBody}</g>
          {groundLine}
        </svg>
      );
    case 'squat':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <g className="fm-anim fm-anim-squat">{standingBody}</g>
          {groundLine}
        </svg>
      );
    case 'pushup':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <g className="fm-anim fm-anim-pushup">
            <circle cx="46" cy="26" r="5" className={`${stroke} fill-none`} strokeWidth="2.5" />
            <line x1="42" y1="30" x2="24" y2="38" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="42" y1="30" x2="54" y2="42" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="38" x2="12" y2="34" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="38" x2="12" y2="42" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="42" y1="30" x2="34" y2="46" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="34" y1="46" x2="44" y2="54" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {groundLine}
        </svg>
      );
    case 'plank':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <g className="fm-anim fm-anim-plank">
            <circle cx="52" cy="26" r="5" className={`${stroke} fill-none`} strokeWidth="2.5" />
            <line x1="48" y1="30" x2="20" y2="36" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="48" y1="30" x2="56" y2="40" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="36" x2="10" y2="34" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="36" x2="10" y2="38" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="26" y1="35" x2="24" y2="48" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="48" x2="34" y2="52" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {groundLine}
        </svg>
      );
    case 'lunge':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <g className="fm-anim fm-anim-lunge">
            <circle cx="34" cy="12" r="6" className={`${stroke} fill-none`} strokeWidth="2.5" />
            <line x1="34" y1="18" x2="28" y2="38" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="34" y1="24" x2="46" y2="30" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="34" y1="24" x2="22" y2="28" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="28" y1="38" x2="40" y2="52" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="28" y1="38" x2="14" y2="48" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {groundLine}
        </svg>
      );
    case 'jump':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <g className="fm-anim fm-anim-jump">
            <circle cx="32" cy="16" r="6" className={`${stroke} fill-none`} strokeWidth="2.5" />
            <line x1="32" y1="22" x2="32" y2="38" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="26" x2="18" y2="22" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="26" x2="46" y2="22" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="38" x2="22" y2="52" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="38" x2="42" y2="52" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {groundLine}
        </svg>
      );
    case 'curl':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <g className="fm-anim fm-anim-curl">
            <circle cx="32" cy="12" r="6" className={`${stroke} fill-none`} strokeWidth="2.5" />
            <line x1="32" y1="18" x2="32" y2="38" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="24" x2="18" y2="34" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="24" x2="46" y2="34" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="18" y1="34" x2="14" y2="44" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="46" y1="34" x2="50" y2="44" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="12" cy="48" r="4" className="stroke-(--accent) fill-none" strokeWidth="2.5" />
            <circle cx="52" cy="48" r="4" className="stroke-(--accent) fill-none" strokeWidth="2.5" />
          </g>
          {groundLine}
        </svg>
      );
    case 'press':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <g className="fm-anim fm-anim-press">
            <circle cx="32" cy="18" r="6" className={`${stroke} fill-none`} strokeWidth="2.5" />
            <line x1="32" y1="24" x2="32" y2="42" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="28" x2="18" y2="24" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="28" x2="46" y2="24" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="18" y1="24" x2="16" y2="10" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="46" y1="24" x2="48" y2="10" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="16" cy="6" r="4" className="stroke-(--accent) fill-none" strokeWidth="2.5" />
            <circle cx="48" cy="6" r="4" className="stroke-(--accent) fill-none" strokeWidth="2.5" />
          </g>
          {groundLine}
        </svg>
      );
    case 'row':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <g className="fm-anim fm-anim-row">
            <circle cx="20" cy="20" r="5" className={`${stroke} fill-none`} strokeWidth="2.5" />
            <line x1="24" y1="24" x2="48" y2="28" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="48" y1="28" x2="58" y2="18" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="48" y1="28" x2="58" y2="38" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="24" x2="18" y2="36" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="24" x2="32" y2="36" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {groundLine}
        </svg>
      );
    case 'calf':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <g className="fm-anim fm-anim-calf">
            <circle cx="32" cy="12" r="6" className={`${stroke} fill-none`} strokeWidth="2.5" />
            <line x1="32" y1="18" x2="32" y2="38" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="24" x2="18" y2="32" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="24" x2="46" y2="32" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="38" x2="24" y2="54" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="38" x2="40" y2="54" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="22" y1="56" x2="26" y2="60" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="42" y1="56" x2="38" y2="60" className={stroke} strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {groundLine}
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
          <g className="fm-anim fm-anim-bob">{standingBody}</g>
          {groundLine}
        </svg>
      );
  }
}
