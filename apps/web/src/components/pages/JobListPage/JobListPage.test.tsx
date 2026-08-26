import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../../tests/utils'
import { useJobsQuery, usePrefetchJob } from '../../../features/jobs/jobQueries'
import JobListPage from './JobListPage.component'

jest.mock('../../../features/jobs/jobQueries', () => ({
  useJobsQuery: jest.fn(),
  usePrefetchJob: jest.fn(),
}))

import { toJobId, type Job } from '@repo/types'

const mockJobs: Job[] = [
  {
    id: toJobId(1),
    title: 'Software Engineer',
    company: 'Acme Corp',
    location: 'Remote',
    type: 'full-time',
    salary: '$90,000 / yr',
    description: 'Build things.',
    requirements: ['React'],
    postedAt: '2026-06-01T00:00:00Z',
  },
]

const mockFetchNextPage = jest.fn()
const mockPrefetchJob = jest.fn()

const baseQuery = {
  data: { pages: [{ data: mockJobs, total: 1, page: 1, limit: 12, hasMore: false }], pageParams: [1] },
  isLoading: false,
  isError: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: mockFetchNextPage,
}

describe('JobListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useJobsQuery).mockReturnValue(baseQuery as unknown as ReturnType<typeof useJobsQuery>)
    jest.mocked(usePrefetchJob).mockReturnValue(mockPrefetchJob)
  })

  it('renders the jobs page title', () => {
    renderWithTheme(<JobListPage />)
    expect(screen.getByRole('heading', { name: /^jobs$/i })).toBeInTheDocument()
  })

  it('shows loading text when data is being fetched', async () => {
    jest.mocked(useJobsQuery).mockReturnValue({ ...baseQuery, data: undefined, isLoading: true } as unknown as ReturnType<typeof useJobsQuery>)
    renderWithTheme(<JobListPage />)
    expect(await screen.findByText('Loading jobs…')).toBeInTheDocument()
  })

  it('shows error alert when the query fails', async () => {
    jest.mocked(useJobsQuery).mockReturnValue({ ...baseQuery, data: undefined, isError: true } as unknown as ReturnType<typeof useJobsQuery>)
    renderWithTheme(<JobListPage />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('renders job cards from query data', async () => {
    renderWithTheme(<JobListPage />)
    expect(await screen.findByText('Software Engineer')).toBeInTheDocument()
  })

  it('renders the Load More button when hasNextPage is true', async () => {
    jest.mocked(useJobsQuery).mockReturnValue({ ...baseQuery, hasNextPage: true } as unknown as ReturnType<typeof useJobsQuery>)
    renderWithTheme(<JobListPage />)
    expect(await screen.findByRole('button', { name: /load more/i })).toBeInTheDocument()
  })

  it('calls fetchNextPage when Load More is clicked', async () => {
    jest.mocked(useJobsQuery).mockReturnValue({ ...baseQuery, hasNextPage: true } as unknown as ReturnType<typeof useJobsQuery>)
    const user = userEvent.setup()
    renderWithTheme(<JobListPage />)
    await user.click(screen.getByRole('button', { name: /load more/i }))
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1)
  })
})
