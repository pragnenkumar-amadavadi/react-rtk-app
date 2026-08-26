import { useEffect, useState } from 'react';
import { PERFORMANCE_MARK_PREFIX } from './usePerformanceMark';

export interface PerformanceMarkEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

const MAX_ENTRIES = 50;

// Third-party libraries (e.g. @emotion/react in dev mode) emit their own
// `performance.mark`/`measure` calls at very high frequency. Observing those
// broadly and re-rendering on each one creates a runaway feedback loop, since
// re-rendering itself produces more of that instrumentation. Only entries
// this app creates itself (see usePerformanceMark) carry this prefix, so
// everything else is ignored.
function isAppEntry(entry: PerformanceEntry): boolean {
  return entry.name.startsWith(PERFORMANCE_MARK_PREFIX);
}

function toEntry(entry: PerformanceEntry): PerformanceMarkEntry {
  return {
    name: entry.name.slice(PERFORMANCE_MARK_PREFIX.length),
    entryType: entry.entryType,
    startTime: entry.startTime,
    duration: entry.duration,
  };
}

export function usePerformanceMarks(): PerformanceMarkEntry[] {
  const [entries, setEntries] = useState<PerformanceMarkEntry[]>(() =>
    [...performance.getEntriesByType('mark'), ...performance.getEntriesByType('measure')]
      .filter(isAppEntry)
      .map(toEntry),
  );

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const appEntries = list.getEntries().filter(isAppEntry).map(toEntry);
      if (appEntries.length === 0) return;
      setEntries((prev) => [...prev, ...appEntries].slice(-MAX_ENTRIES));
    });
    observer.observe({ entryTypes: ['mark', 'measure'] });

    return () => observer.disconnect();
  }, []);

  return entries;
}
