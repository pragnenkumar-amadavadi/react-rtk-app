import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SpeedIcon from '@mui/icons-material/Speed';
import { usePerformanceMarks } from '../../../features/performance/usePerformanceMarks';
import { useWebVitals } from '../../../features/performance/useWebVitals';
import {
  DashboardRoot,
  EmptyState,
  MarkEntryRow,
  MetricRow,
  Panel,
  RatingChip,
  SectionTitle,
  ToggleButton,
} from './PerformanceDashboard.styled';

const VITAL_NAMES = ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'] as const;

export default function PerformanceDashboard() {
  const [open, setOpen] = useState(false);
  const vitals = useWebVitals();
  const marks = usePerformanceMarks();

  return (
    <DashboardRoot>
      <ToggleButton onClick={() => setOpen((prev) => !prev)} size="small" aria-label="Toggle performance dashboard">
        {open ? <CloseIcon fontSize="small" /> : <SpeedIcon fontSize="small" />}
      </ToggleButton>
      {open && (
        <Panel>
          <SectionTitle>Web Vitals</SectionTitle>
          {VITAL_NAMES.map((name) => {
            const reading = vitals[name];
            return (
              <MetricRow key={name}>
                <span>{name}</span>
                {reading ? (
                  <RatingChip
                    label={reading.value.toFixed(name === 'CLS' ? 3 : 0)}
                    $rating={reading.rating}
                    size="small"
                  />
                ) : (
                  <EmptyState>—</EmptyState>
                )}
              </MetricRow>
            );
          })}

          <SectionTitle>Marks &amp; Measures</SectionTitle>
          {marks.length === 0 && <EmptyState>No marks recorded yet</EmptyState>}
          {marks
            .slice()
            .reverse()
            .map((entry, index) => (
              <MarkEntryRow key={`${entry.name}-${entry.startTime}-${index}`}>
                <span>{entry.name}</span>
                <span>{entry.duration ? `${entry.duration.toFixed(1)}ms` : `${entry.startTime.toFixed(0)}ms`}</span>
              </MarkEntryRow>
            ))}
        </Panel>
      )}
    </DashboardRoot>
  );
}
