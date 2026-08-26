import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toCandidateId, type Candidate } from '@repo/types'
import { renderWithTheme } from '../../tests/utils'
import CandidateListView from './CandidateListView.component'

// Render all items immediately — jsdom has no real viewport for virtualization
jest.mock('react-virtuoso', () => ({
  Virtuoso: ({
    data,
    itemContent,
    components,
  }: {
    data: unknown[]
    itemContent: (index: number, item: unknown) => React.ReactNode
    components?: { Footer?: React.ComponentType }
  }) => {
    const Footer = components?.Footer
    return (
      <div>
        {(data as Candidate[]).map((item, i) => (
          <div key={item.id ?? i}>{itemContent(i, item)}</div>
        ))}
        {Footer && <Footer />}
      </div>
    )
  },
}))

const mockCandidates: Candidate[] = [
  {
    id: toCandidateId(1),
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1-555-111-1111',
    position: 'Frontend Engineer',
    status: 'interview',
    experience: 4,
    location: 'San Francisco, CA',
    avatarUrl: '',
    appliedAt: '2026-06-01T12:00:00Z',
  },
  {
    id: toCandidateId(2),
    name: 'Bob Martinez',
    email: 'bob@example.com',
    phone: '+1-555-222-2222',
    position: 'Backend Engineer',
    status: 'applied',
    experience: 7,
    location: 'New York, NY',
    avatarUrl: '',
    appliedAt: '2026-06-02T12:00:00Z',
  },
]

const baseProps = {
  candidates: mockCandidates,
  isLoading: false,
  hasMore: false,
  isError: false,
  dialogOpen: false,
  loadMore: jest.fn(),
  onAddClick: jest.fn(),
  onDialogClose: jest.fn(),
  onDialogSubmit: jest.fn(),
  onCardHover: jest.fn(),
}

describe('CandidateListView', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders the page title', () => {
    renderWithTheme(<CandidateListView {...baseProps} />)
    expect(screen.getByText('Candidate List')).toBeInTheDocument()
  })

  it('renders candidate cards when data is loaded', () => {
    renderWithTheme(<CandidateListView {...baseProps} />)
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Bob Martinez')).toBeInTheDocument()
  })

  it('shows the candidate count', () => {
    renderWithTheme(<CandidateListView {...baseProps} />)
    expect(screen.getByText('Showing 2 candidates')).toBeInTheDocument()
  })

  it('shows skeleton placeholders during initial load', async () => {
    renderWithTheme(<CandidateListView {...baseProps} candidates={[]} isLoading={true} />)
    // In skeleton mode, no candidate names should appear
    expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument()
    expect(await screen.findByText('Loading candidates…')).toBeInTheDocument()
  })

  it('shows the error alert when isError is true', async () => {
    renderWithTheme(<CandidateListView {...baseProps} candidates={[]} isError={true} />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(await screen.findByText(/failed to load candidates/i)).toBeInTheDocument()
  })

  it('shows "All candidates loaded" in the footer when hasMore is false', () => {
    renderWithTheme(<CandidateListView {...baseProps} hasMore={false} />)
    expect(screen.getByText('All candidates loaded')).toBeInTheDocument()
  })

  it('does not show the end message while more pages are available', () => {
    renderWithTheme(<CandidateListView {...baseProps} hasMore={true} />)
    expect(screen.queryByText('All candidates loaded')).not.toBeInTheDocument()
  })

  it('calls onAddClick when the Add Candidate button is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<CandidateListView {...baseProps} />)
    await user.click(screen.getByRole('button', { name: /add candidate/i }))
    expect(baseProps.onAddClick).toHaveBeenCalledTimes(1)
  })

  it('renders the dialog when dialogOpen is true', async () => {
    renderWithTheme(<CandidateListView {...baseProps} dialogOpen={true} />)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('calls onCardHover with the candidate id when a card link is hovered', async () => {
    const user = userEvent.setup()
    renderWithTheme(<CandidateListView {...baseProps} />)
    // Each candidate card is wrapped in a CardLink (<a>); first link is Alice (id=1)
    await user.hover(screen.getAllByRole('link')[0])
    expect(baseProps.onCardHover).toHaveBeenCalledWith(1)
  })
})
