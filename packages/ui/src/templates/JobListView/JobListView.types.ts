import type { Job, JobId } from '@repo/types';

export interface Props {
  jobs: Job[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onCardHover: (id: JobId) => void;
}
