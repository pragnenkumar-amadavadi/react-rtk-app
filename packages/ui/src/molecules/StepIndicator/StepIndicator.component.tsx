import type { Props } from './StepIndicator.types';
import { StepRow, StepItem, StepCircle, StepLabel, Connector } from './StepIndicator.styled';

export default function StepIndicator({ steps, currentStep }: Props) {
  return (
    <StepRow>
      {steps.map((label, index) => {
        const state =
          index < currentStep ? 'completed' : index === currentStep ? 'current' : 'future';
        return (
          <StepRow key={label} style={{ flex: 1, justifyContent: 'initial' }}>
            <StepItem>
              <StepCircle state={state}>{index + 1}</StepCircle>
              <StepLabel>{label}</StepLabel>
            </StepItem>
            {index < steps.length - 1 && <Connector completed={index < currentStep} />}
          </StepRow>
        );
      })}
    </StepRow>
  );
}
