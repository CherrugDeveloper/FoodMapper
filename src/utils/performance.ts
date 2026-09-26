export function measurePerformance(label: string, fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.debug(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
}

export function usePerformanceMonitor() {
  // This would be used in a component to monitor performance
  // For now, it's a placeholder for future implementation
  return {
    measure: measurePerformance
  };
}

export function createPerformanceMark(name: string): void {
  performance.mark(name);
}

export function measurePerformanceBetween(startMark: string, endMark: string, measureName: string): number {
  performance.mark(endMark);
  performance.measure(measureName, startMark, endMark);
  const measures = performance.getEntriesByName(measureName, 'measure');
  if (measures.length > 0) {
    return measures[measures.length - 1].duration;
  }
  return 0;
}