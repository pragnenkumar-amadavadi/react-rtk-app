import type { Props } from './StatTile.types';
import { StyledCard, StyledContent, IconBadge, TextBlock, ValueText, LabelText } from './StatTile.styled';

export default function StatTile({ label, value, icon }: Props) {
  return (
    <StyledCard variant="outlined">
      <StyledContent>
        <IconBadge>{icon}</IconBadge>
        <TextBlock>
          <ValueText variant="h4">{value.toLocaleString()}</ValueText>
          <LabelText variant="body2">{label}</LabelText>
        </TextBlock>
      </StyledContent>
    </StyledCard>
  );
}
