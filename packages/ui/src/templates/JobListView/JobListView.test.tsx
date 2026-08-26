import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../tests/utils'
import { toJobId, type Job } from '@repo/types'
import JobListView from './JobListView.component'

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
  {
    id: toJobId(2),
    title: 'Product Designer',
    company: 'Beta Inc',
    location: 'New York',
    type: 'contract',
    salary: '$80,000 / yr',
    description: 'Design things.',
    requirements: ['Figma'],
    postedAt: '2026-06-02T00:00:00Z',
  },
]

const baseProps = {
  jobs: mockJobs,
  isLoading: false,
  isError: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  onLoadMore: jest.fn(),
  onCardHover: jest.fn(),
}

describe('JobListView', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders the page title', () => {
    renderWithTheme(<JobListView {...baseProps} />)
    expect(screen.getByRole('heading', { name: /^jobs$/i })).toBeInTheDocument()
  })

  it('renders job cards when data is loaded', () => {
    renderWithTheme(<JobListView {...baseProps} />)
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Product Designer')).toBeInTheDocument()
  })

  it('shows loading text while fetching', async () => {
    renderWithTheme(<JobListView {...baseProps} jobs={[]} isLoading />)
    expect(await screen.findByText('Loading jobs…')).toBeInTheDocument()
  })

  it('shows an error alert when isError is true', async () => {
    renderWithTheme(<JobListView {...baseProps} jobs={[]} isError />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(await screen.findByText(/failed to load jobs/i)).toBeInTheDocument()
  })

  it('shows an empty state when jobs list is empty', () => {
    renderWithTheme(<JobListView {...baseProps} jobs={[]} />)
    expect(screen.getByText('No jobs available.')).toBeInTheDocument()
  })

  it('does not render the Load More button when hasNextPage is false', () => {
    renderWithTheme(<JobListView {...baseProps} hasNextPage={false} />)
    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument()
  })

  it('renders the Load More button when hasNextPage is true', () => {
    renderWithTheme(<JobListView {...baseProps} hasNextPage />)
    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument()
  })

  it('calls onLoadMore when Load More is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<JobListView {...baseProps} hasNextPage />)
    await user.click(screen.getByRole('button', { name: /load more/i }))
    expect(baseProps.onLoadMore).toHaveBeenCalledTimes(1)
  })

  it('disables Load More while the next page is fetching', () => {
    renderWithTheme(<JobListView {...baseProps} hasNextPage isFetchingNextPage />)
    expect(screen.getByRole('button', { name: /loading…/i })).toBeDisabled()
  })

  it('calls onCardHover with the job id when a card link is hovered', async () => {
    const user = userEvent.setup()
    renderWithTheme(<JobListView {...baseProps} />)
    // First link belongs to the first job card
    await user.hover(screen.getAllByRole('link')[0])
    expect(baseProps.onCardHover).toHaveBeenCalledWith(1)
  })
})
