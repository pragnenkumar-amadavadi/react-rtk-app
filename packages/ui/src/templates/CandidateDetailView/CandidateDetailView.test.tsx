import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toCandidateId, type Candidate, type CandidateNote, type CandidateStatusHistoryEntry } from '@repo/types'
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

const mockNotes: CandidateNote[] = [
  { id: 1, candidateId: toCandidateId(42), body: 'Great communicator.', createdAt: '2026-05-16T10:00:00Z' },
]

// Deliberately avoids 'applied' (collides with the "Applied" contact-grid
// field label) and 'offer' (collides with mockCandidate's own status chip).
const mockStatusHistory: CandidateStatusHistoryEntry[] = [
  { id: 2, candidateId: toCandidateId(42), fromStatus: 'hired', toStatus: 'rejected', changedAt: '2026-05-17T10:00:00Z' },
  { id: 1, candidateId: toCandidateId(42), fromStatus: 'screening', toStatus: 'interview', changedAt: '2026-05-15T09:00:00Z' },
]

const baseProps = {
  candidate: mockCandidate,
  isLoading: false,
  isError: false,
  onStatusChange: jest.fn(),
  statusHistory: mockStatusHistory,
  statusHistoryLoading: false,
  notes: mockNotes,
  notesLoading: false,
  notesSubmitting: false,
  onAddNote: jest.fn(),
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

  it('renders the status history section with existing transitions', () => {
    renderWithTheme(<CandidateDetailView {...baseProps} />)
    expect(screen.getByText('Status History')).toBeInTheDocument()
    expect(screen.getByText('Screening')).toBeInTheDocument()
    expect(screen.getByText('Interview')).toBeInTheDocument()
    expect(screen.getByText('Hired')).toBeInTheDocument()
    expect(screen.getByText('Rejected')).toBeInTheDocument()
  })

  it('renders the notes section with existing notes', () => {
    renderWithTheme(<CandidateDetailView {...baseProps} />)
    expect(screen.getByText('Notes')).toBeInTheDocument()
    expect(screen.getByText('Great communicator.')).toBeInTheDocument()
  })

  it('calls onAddNote with the trimmed input when the note form is submitted', async () => {
    const onAddNote = jest.fn()
    const user = userEvent.setup()
    renderWithTheme(<CandidateDetailView {...baseProps} onAddNote={onAddNote} />)

    await user.type(screen.getByPlaceholderText(/add a note/i), '  Follow up next week  ')
    await user.click(screen.getByRole('button', { name: /add note/i }))

    expect(onAddNote).toHaveBeenCalledWith('Follow up next week')
  })
})
