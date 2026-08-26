import type { ReactElement } from 'react';
import type { Candidate } from '@repo/types';
import type { Props } from './StatusFunnelChart.types';
import {
  Container,
  Row,
  StageLabel,
  LabelText,
  Track,
  Fill,
  CountText,
  HiredIcon,
  RejectedIcon,
  StyledTooltip,
  type FunnelTone,
} from './StatusFunnelChart.styled';

interface Stage {
  status: Candidate['status'];
  label: string;
  tone: FunnelTone;
  icon?: ReactElement;
}

// In-progress stages are ordinal (funnel order carries meaning) and share one
// hue at increasing intensity; hired/rejected are terminal outcomes and wear
// the reserved good/critical status colors instead of continuing the ramp.
const STAGES: Stage[] = [
  { status: 'applied', label: 'Applied', tone: 'stage1' },
  { status: 'screening', label: 'Screening', tone: 'stage2' },
  { status: 'interview', label: 'Interview', tone: 'stage3' },
  { status: 'offer', label: 'Offer', tone: 'stage4' },
  { status: 'hired', label: 'Hired', tone: 'good', icon: <HiredIcon /> },
  { status: 'rejected', label: 'Rejected', tone: 'critical', icon: <RejectedIcon /> },
];

export default function StatusFunnelChart({ counts }: Props) {
  const maxCount = Math.max(...STAGES.map((stage) => counts[stage.status]), 1);

  return (
    <Container role="img" aria-label="Candidate status funnel">
      {STAGES.map((stage) => {
        const count = counts[stage.status];
        return (
          <StyledTooltip key={stage.status} title={`${stage.label}: ${count} candidates`}>
            <Row tabIndex={0}>
              <StageLabel>
                {stage.icon}
                <LabelText variant="body2">{stage.label}</LabelText>
              </StageLabel>
              <Track>
                <Fill widthPercent={(count / maxCount) * 100} tone={stage.tone} />
              </Track>
              <CountText variant="body2">{count}</CountText>
            </Row>
          </StyledTooltip>
        );
      })}
    </Container>
  );
}
