import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toCandidateId, type Candidate } from '@repo/types'
import { renderWithTheme } from '../../../tests/utils'
import {
  useCandidateQuery,
  useUpdateCandidateStatusMutation,
} from '../../../features/candidates/candidateQueries'
import {
  useCandidateNotesQuery,
  useAddCandidateNoteMutation,
} from '../../../features/candidates/candidateNotesQueries'
import { useCandidateStatusHistoryQuery } from '../../../features/candidates/candidateStatusHistoryQueries'
import CandidateDetailPage from './CandidateDetailPage.component'

// Factory prevents loading the real module chain (→ axiosClient → config → import.meta.env)
jest.mock('../../../features/candidates/candidateQueries', () => ({
  useCandidateQuery: jest.fn(),
  useUpdateCandidateStatusMutation: jest.fn(),
}))

jest.mock('../../../features/candidates/candidateNotesQueries', () => ({
  useCandidateNotesQuery: jest.fn(),
  useAddCandidateNoteMutation: jest.fn(),
}))

jest.mock('../../../features/candidates/candidateStatusHistoryQueries', () => ({
  useCandidateStatusHistoryQuery: jest.fn(),
}))

// Provide a fixed :id param without needing a full router setup
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '42' }),
}))

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

const mockQueryBase = { data: undefined, isLoading: false, isError: false }
const mockUpdateStatusMutate = jest.fn()
const mockNotesQueryBase = { data: [], isLoading: false, isError: false }
const mockAddNoteMutationBase = { mutate: jest.fn(), isPending: false }
const mockStatusHistoryQueryBase = { data: [], isLoading: false, isError: false }

describe('CandidateDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useCandidateQuery).mockReturnValue(mockQueryBase as unknown as ReturnType<typeof useCandidateQuery>)
    jest.mocked(useUpdateCandidateStatusMutation).mockReturnValue({
      mutate: mockUpdateStatusMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateCandidateStatusMutation>)
    jest.mocked(useCandidateNotesQuery).mockReturnValue(
      mockNotesQueryBase as unknown as ReturnType<typeof useCandidateNotesQuery>,
    )
    jest.mocked(useAddCandidateNoteMutation).mockReturnValue(
      mockAddNoteMutationBase as unknown as ReturnType<typeof useAddCandidateNoteMutation>,
    )
    jest.mocked(useCandidateStatusHistoryQuery).mockReturnValue(
      mockStatusHistoryQueryBase as unknown as ReturnType<typeof useCandidateStatusHistoryQuery>,
    )
  })

  it('passes isLoading to the view — shows spinner', async () => {
    jest.mocked(useCandidateQuery).mockReturnValue({ ...mockQueryBase, isLoading: true } as unknown as ReturnType<typeof useCandidateQuery>)
    renderWithTheme(<CandidateDetailPage />)
    expect(await screen.findByRole('progressbar')).toBeInTheDocument()
  })

  it('passes isError to the view — shows alert', async () => {
    jest.mocked(useCandidateQuery).mockReturnValue({ ...mockQueryBase, isError: true } as unknown as ReturnType<typeof useCandidateQuery>)
    renderWithTheme(<CandidateDetailPage />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('renders candidate details when data is loaded', async () => {
    jest.mocked(useCandidateQuery).mockReturnValue({ ...mockQueryBase, data: mockCandidate } as unknown as ReturnType<typeof useCandidateQuery>)
    renderWithTheme(<CandidateDetailPage />)
    expect(await screen.findByText('Jane Smith')).toBeInTheDocument()
    expect(await screen.findByText('jane@example.com')).toBeInTheDocument()
  })

  it('passes status history from the query to the view', async () => {
    jest.mocked(useCandidateQuery).mockReturnValue({ ...mockQueryBase, data: mockCandidate } as unknown as ReturnType<typeof useCandidateQuery>)
    jest.mocked(useCandidateStatusHistoryQuery).mockReturnValue({
      ...mockStatusHistoryQueryBase,
      data: [{ id: 1, candidateId: mockCandidate.id, fromStatus: 'applied', toStatus: 'screening', changedAt: '2026-05-15T09:00:00Z' }],
    } as unknown as ReturnType<typeof useCandidateStatusHistoryQuery>)
    renderWithTheme(<CandidateDetailPage />)

    expect(await screen.findByText('Status History')).toBeInTheDocument()
    expect(screen.getByText('Screening')).toBeInTheDocument()
  })

  it('calls the status mutation with the route id and target status', async () => {
    const user = userEvent.setup()
    jest.mocked(useCandidateQuery).mockReturnValue({ ...mockQueryBase, data: mockCandidate } as unknown as ReturnType<typeof useCandidateQuery>)
    renderWithTheme(<CandidateDetailPage />)

    await user.click(await screen.findByRole('button', { name: 'Mark as Hired' }))
    expect(mockUpdateStatusMutate).toHaveBeenCalledWith({ id: '42', status: 'hired' })
  })
})
