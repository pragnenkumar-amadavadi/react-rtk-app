import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../tests/utils'
import { useJobQuery, useJobApplicants } from '../../../features/jobs/jobQueries'
import JobDetailPage from './JobDetailPage.component'
import { toJobId, type Job } from '@repo/types'

jest.mock('../../../features/jobs/jobQueries', () => ({
  useJobQuery: jest.fn(),
  useJobApplicants: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(() => jest.fn()),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}))

import { useParams, useLocation } from 'react-router-dom'

const mockJob: Job = {
  id: toJobId(1),
  title: 'Software Engineer',
  company: 'Acme Corp',
  location: 'Remote',
  type: 'full-time',
  salary: '$90,000 / yr',
  description: 'Build great things.',
  requirements: ['React', 'TypeScript'],
  postedAt: '2026-06-01T00:00:00Z',
}

const mockQueryBase = { data: undefined, isLoading: false, isError: false }
const mockApplicantsQueryBase = { data: undefined, isLoading: false, isError: false }

describe('JobDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useParams).mockReturnValue({ jobId: '1' })
    jest.mocked(useLocation).mockReturnValue({
      state: null,
      pathname: '/jobs/1',
      search: '',
      hash: '',
      key: 'default',
    })
    jest.mocked(useJobQuery).mockReturnValue(mockQueryBase as unknown as ReturnType<typeof useJobQuery>)
    jest.mocked(useJobApplicants).mockReturnValue(
      mockApplicantsQueryBase as unknown as ReturnType<typeof useJobApplicants>,
    )
  })

  it('shows a loading spinner when the query is loading', async () => {
    jest.mocked(useJobQuery).mockReturnValue({ ...mockQueryBase, isLoading: true } as unknown as ReturnType<typeof useJobQuery>)
    renderWithTheme(<JobDetailPage />)
    expect(await screen.findByRole('progressbar')).toBeInTheDocument()
  })

  it('shows an error alert when the query fails', async () => {
    jest.mocked(useJobQuery).mockReturnValue({ ...mockQueryBase, isError: true } as unknown as ReturnType<typeof useJobQuery>)
    renderWithTheme(<JobDetailPage />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('renders job details when data is loaded', async () => {
    jest.mocked(useJobQuery).mockReturnValue({ ...mockQueryBase, data: mockJob } as unknown as ReturnType<typeof useJobQuery>)
    renderWithTheme(<JobDetailPage />)
    expect(await screen.findByRole('heading', { name: 'Software Engineer' })).toBeInTheDocument()
    expect(await screen.findByText('Acme Corp')).toBeInTheDocument()
  })

  it('shows the success alert when location.state.applied is true', async () => {
    jest.mocked(useJobQuery).mockReturnValue({ ...mockQueryBase, data: mockJob } as unknown as ReturnType<typeof useJobQuery>)
    jest.mocked(useLocation).mockReturnValue({
      state: { applied: true },
      pathname: '/jobs/1',
      search: '',
      hash: '',
      key: 'default',
    })
    renderWithTheme(<JobDetailPage />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(await screen.findByText(/successfully applied/i)).toBeInTheDocument()
  })

  it('does not show the success alert when location.state is null', async () => {
    jest.mocked(useJobQuery).mockReturnValue({ ...mockQueryBase, data: mockJob } as unknown as ReturnType<typeof useJobQuery>)
    renderWithTheme(<JobDetailPage />)
    // Wait for the page to settle, then assert absence
    await screen.findByRole('heading', { name: 'Software Engineer' })
    expect(screen.queryByText(/successfully applied/i)).not.toBeInTheDocument()
  })
})
