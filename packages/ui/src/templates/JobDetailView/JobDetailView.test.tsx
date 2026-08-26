import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../tests/utils'
import { toCandidateId, toJobId, type Candidate, type Job } from '@repo/types'
import JobDetailView from './JobDetailView.component'

let mockNavigate: jest.Mock

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const mockJob: Job = {
  id: toJobId(1),
  title: 'Software Engineer',
  company: 'Acme Corp',
  location: 'Remote',
  type: 'full-time',
  salary: '$90,000 – $120,000 / yr',
  description: 'Build great products at scale.',
  requirements: ['5+ years TypeScript', 'React experience'],
  postedAt: '2026-06-01T00:00:00Z',
}

const mockApplicants: Candidate[] = [
  {
    id: toCandidateId(7),
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '+1-555-222-3333',
    position: 'Software Engineer',
    status: 'applied',
    experience: 4,
    location: 'Remote',
    avatarUrl: '',
    appliedAt: '2026-06-05T00:00:00Z',
  },
]

const baseProps = {
  job: mockJob,
  isLoading: false,
  isError: false,
  applicants: [],
  applicantsLoading: false,
  applicantsError: false,
}

describe('JobDetailView', () => {
  beforeEach(() => {
    mockNavigate = jest.fn()
  })

  it('shows a loading spinner when isLoading is true', async () => {
    renderWithTheme(<JobDetailView {...baseProps} job={undefined} isLoading isError={false} />)
    expect(await screen.findByRole('progressbar')).toBeInTheDocument()
  })

  it('shows an error alert when isError is true', async () => {
    renderWithTheme(<JobDetailView {...baseProps} job={undefined} isLoading={false} isError />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(await screen.findByText(/failed to load job details/i)).toBeInTheDocument()
  })

  it('renders the job title and company', () => {
    renderWithTheme(<JobDetailView {...baseProps} />)
    expect(screen.getByRole('heading', { name: 'Software Engineer' })).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
  })

  it('renders the salary', () => {
    renderWithTheme(<JobDetailView {...baseProps} />)
    expect(screen.getByText('$90,000 – $120,000 / yr')).toBeInTheDocument()
  })

  it('renders the job description', () => {
    renderWithTheme(<JobDetailView {...baseProps} />)
    expect(screen.getByText('Build great products at scale.')).toBeInTheDocument()
  })

  it('renders all requirements', () => {
    renderWithTheme(<JobDetailView {...baseProps} />)
    expect(screen.getByText('5+ years TypeScript')).toBeInTheDocument()
    expect(screen.getByText('React experience')).toBeInTheDocument()
  })

  it('renders a back link to the jobs list', () => {
    renderWithTheme(<JobDetailView {...baseProps} />)
    expect(screen.getByRole('link', { name: /back to jobs/i })).toHaveAttribute('href', '/jobs')
  })

  it('renders the Apply Now button when not yet applied', () => {
    renderWithTheme(<JobDetailView {...baseProps} />)
    expect(screen.getByRole('button', { name: /apply now/i })).toBeInTheDocument()
  })

  it('navigates to step 1 when Apply Now is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<JobDetailView {...baseProps} />)
    await user.click(screen.getByRole('button', { name: /apply now/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/jobs/1/apply/1')
  })

  it('shows the success alert when applied is true', async () => {
    renderWithTheme(<JobDetailView {...baseProps} applied />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(await screen.findByText(/successfully applied/i)).toBeInTheDocument()
  })

  it('hides the Apply Now button when applied is true', async () => {
    renderWithTheme(<JobDetailView {...baseProps} applied />)
    // Wait for the applied state to render, then assert the button is absent
    await screen.findByText(/successfully applied/i)
    expect(screen.queryByRole('button', { name: /apply now/i })).not.toBeInTheDocument()
  })

  it('renders the applicant count and cards', () => {
    renderWithTheme(<JobDetailView {...baseProps} applicants={mockApplicants} />)
    expect(screen.getByText('Applicants (1)')).toBeInTheDocument()
    expect(screen.getByText('Priya Patel')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /priya patel/i })).toHaveAttribute('href', '/candidates/7')
  })

  it('shows an empty state when there are no applicants', () => {
    renderWithTheme(<JobDetailView {...baseProps} applicants={[]} />)
    expect(screen.getByText('Applicants (0)')).toBeInTheDocument()
    expect(screen.getByText(/no applicants yet/i)).toBeInTheDocument()
  })

  it('shows a spinner while applicants are loading', async () => {
    renderWithTheme(<JobDetailView {...baseProps} applicantsLoading />)
    expect(await screen.findAllByRole('progressbar')).toHaveLength(1)
  })
})
