import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toCandidateId, type Candidate } from '@repo/types'
import { renderWithTheme } from '../../tests/utils'
import CandidateDetailView from './CandidateDetailView.component'

const mockCandidate: Candidate = {
  id: toCandidateId(42),
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '+1-555-987-6543',
  position: 'Product Designer',
  status: 'offer',
  experience: 6,
  location: 'Austin, TX',
  avatarUrl: '',
  appliedAt: '2026-05-15T09:00:00Z',
}

const baseProps = {
  candidate: mockCandidate,
  isLoading: false,
  isError: false,
  onStatusChange: jest.fn(),
}

describe('CandidateDetailView', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders the candidate name', () => {
    renderWithTheme(<CandidateDetailView {...baseProps} />)
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('renders the status chip', () => {
    renderWithTheme(<CandidateDetailView {...baseProps} />)
    expect(screen.getByText('Offer')).toBeInTheDocument()
  })

  it('renders contact details', () => {
    renderWithTheme(<CandidateDetailView {...baseProps} />)
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('+1-555-987-6543')).toBeInTheDocument()
    expect(screen.getByText('Austin, TX')).toBeInTheDocument()
  })

  it('renders position and experience', () => {
    renderWithTheme(<CandidateDetailView {...baseProps} />)
    expect(screen.getByText('Product Designer · 6 yrs exp')).toBeInTheDocument()
  })

  it('renders a back link to the list', () => {
    renderWithTheme(<CandidateDetailView {...baseProps} />)
    expect(screen.getByRole('link', { name: /back to candidates/i })).toBeInTheDocument()
  })

  it('shows a loading spinner when isLoading is true', async () => {
    renderWithTheme(<CandidateDetailView {...baseProps} candidate={undefined} isLoading={true} />)
    expect(await screen.findByRole('progressbar')).toBeInTheDocument()
  })

  it('shows an error alert when isError is true', async () => {
    renderWithTheme(<CandidateDetailView {...baseProps} candidate={undefined} isError={true} />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('offers the next-stage action for the candidate\'s status', () => {
    renderWithTheme(<CandidateDetailView {...baseProps} />)
    expect(screen.getByRole('button', { name: 'Mark as Hired' })).toBeInTheDocument()
  })

  it('calls onStatusChange when a status action is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<CandidateDetailView {...baseProps} />)
    await user.click(screen.getByRole('button', { name: 'Mark as Hired' }))
    expect(baseProps.onStatusChange).toHaveBeenCalledWith('hired')
  })
})
