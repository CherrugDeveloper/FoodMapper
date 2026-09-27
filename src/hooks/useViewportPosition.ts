import { useState, useEffect, useCallback } from 'react';

interface ViewportPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

interface UseViewportPositionOptions {
  triggerRef: React.RefObject<HTMLElement | null>;
  popupRef: React.RefObject<HTMLElement | null>;
  preferredPlacement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  boundaryPadding?: number;
}

export function useViewportPosition({
  triggerRef,
  popupRef,
  preferredPlacement = 'top',
  offset = 8,
  boundaryPadding = 8,
}: UseViewportPositionOptions): ViewportPosition {
  const [position, setPosition] = useState<ViewportPosition>({
    top: 0,
    left: 0,
    placement: preferredPlacement,
  });

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !popupRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Try preferred placement first
    let placement = preferredPlacement;
    let top = 0;
    let left = 0;

    const tryPlacement = (p: 'top' | 'bottom' | 'left' | 'right'): { top: number; left: number; fits: boolean } => {
      let t = 0;
      let l = 0;
      let fits = true;

      switch (p) {
        case 'top':
          t = triggerRect.top - popupRect.height - offset;
          l = triggerRect.left + triggerRect.width / 2 - popupRect.width / 2;
          fits = t >= boundaryPadding && 
                 l >= boundaryPadding && 
                 l + popupRect.width <= viewportWidth - boundaryPadding;
          break;
        case 'bottom':
          t = triggerRect.bottom + offset;
          l = triggerRect.left + triggerRect.width / 2 - popupRect.width / 2;
          fits = t + popupRect.height <= viewportHeight - boundaryPadding && 
                 l >= boundaryPadding && 
                 l + popupRect.width <= viewportWidth - boundaryPadding;
          break;
        case 'left':
          t = triggerRect.top + triggerRect.height / 2 - popupRect.height / 2;
          l = triggerRect.left - popupRect.width - offset;
          fits = l >= boundaryPadding && 
                 t >= boundaryPadding && 
                 t + popupRect.height <= viewportHeight - boundaryPadding;
          break;
        case 'right':
          t = triggerRect.top + triggerRect.height / 2 - popupRect.height / 2;
          l = triggerRect.right + offset;
          fits = l + popupRect.width <= viewportWidth - boundaryPadding && 
                 t >= boundaryPadding && 
                 t + popupRect.height <= viewportHeight - boundaryPadding;
          break;
      }

      return { top: t, left: l, fits };
    };

    // Try preferred placement
    const preferred = tryPlacement(preferredPlacement);
    if (preferred.fits) {
      top = preferred.top;
      left = preferred.left;
      placement = preferredPlacement;
    } else {
      // Try all other placements in order of preference
      const placements: ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom', 'right', 'left'];
      for (const p of placements) {
        const result = tryPlacement(p);
        if (result.fits) {
          top = result.top;
          left = result.left;
          placement = p;
          break;
        }
      }

      // If nothing fits, use preferred but clamp to viewport
      if (!placements.some(p => tryPlacement(p).fits)) {
        const result = tryPlacement(preferredPlacement);
        top = Math.max(boundaryPadding, Math.min(result.top, viewportHeight - popupRect.height - boundaryPadding));
        left = Math.max(boundaryPadding, Math.min(result.left, viewportWidth - popupRect.width - boundaryPadding));
        placement = preferredPlacement;
      }
    }

    setPosition({ top, left, placement });
  }, [triggerRef, popupRef, preferredPlacement, offset, boundaryPadding]);

  useEffect(() => {
    calculatePosition();
    
    const handleResize = () => calculatePosition();
    const handleScroll = () => calculatePosition();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [calculatePosition]);

  return position;
}