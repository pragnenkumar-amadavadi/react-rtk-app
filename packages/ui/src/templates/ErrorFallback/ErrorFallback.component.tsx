import type { Props } from './ErrorFallback.types';
import { PageContainer, ErrorIcon, Heading, Message, RetryButton } from './ErrorFallback.styled';

export default function ErrorFallback({ error, onRetry }: Props) {
  return (
    <PageContainer>
      <ErrorIcon />
      <Heading variant="h5">Something went wrong</Heading>
      <Message variant="body2">{error.message}</Message>
      <RetryButton variant="contained" onClick={onRetry}>
        Try again
      </RetryButton>
    </PageContainer>
  );
}
