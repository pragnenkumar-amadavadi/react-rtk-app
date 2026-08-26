import { screen } from '@testing-library/react'
import { toCandidateId, type Candidate } from '@repo/types'
import { renderWithTheme } from '../../../tests/utils'
import { useCandidateQuery } from '../../../features/candidates/candidateQueries'
import {
  useCandidateNotesQuery,
  useAddCandidateNoteMutation,
} from '../../../features/candidates/candidateNotesQueries'
import CandidateDetailPage from './CandidateDetailPage.component'

// Factory prevents loading the real module chain (→ axiosClient → config → import.meta.env)
jest.mock('../../../features/candidates/candidateQueries', () => ({
  useCandidateQuery: jest.fn(),
}))

jest.mock('../../../features/candidates/candidateNotesQueries', () => ({
  useCandidateNotesQuery: jest.fn(),
  useAddCandidateNoteMutation: jest.fn(),
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
const mockNotesQueryBase = { data: [], isLoading: false, isError: false }
const mockAddNoteMutationBase = { mutate: jest.fn(), isPending: false }

describe('CandidateDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useCandidateQuery).mockReturnValue(mockQueryBase as unknown as ReturnType<typeof useCandidateQuery>)
    jest.mocked(useCandidateNotesQuery).mockReturnValue(
      mockNotesQueryBase as unknown as ReturnType<typeof useCandidateNotesQuery>,
    )
    jest.mocked(useAddCandidateNoteMutation).mockReturnValue(
      mockAddNoteMutationBase as unknown as ReturnType<typeof useAddCandidateNoteMutation>,
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
})
