import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toCandidateId } from '@repo/types'
import { renderWithTheme } from '../../../tests/utils'
import { useCandidateList } from '../../../features/candidates/useCandidateList'
import {
  usePrefetchCandidate,
  useBulkUpdateCandidateStatusMutation,
} from '../../../features/candidates/candidateQueries'
import CandidateListPage from './CandidateListPage.component'

// Factory prevents Jest from loading the real module chain (→ axiosClient → config → import.meta.env)
jest.mock('../../../features/candidates/useCandidateList', () => ({
  useCandidateList: jest.fn(),
}))

jest.mock('../../../features/candidates/candidateQueries', () => ({
  usePrefetchCandidate: jest.fn(),
  useBulkUpdateCandidateStatusMutation: jest.fn(),
}))

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
        {data.map((item, i) => (
          <div key={i}>{itemContent(i, item)}</div>
        ))}
        {Footer && <Footer />}
      </div>
    )
  },
}))

const mockHookBase = {
  candidates: [],
  total: 0,
  isLoading: false,
  hasMore: false,
  isError: false,
  loadMore: jest.fn(),
  addCandidate: jest.fn(),
  status: [],
  onSearchChange: jest.fn(),
  onStatusChange: jest.fn(),
  selectedIds: new Set<ReturnType<typeof toCandidateId>>(),
  toggleSelect: jest.fn(),
  selectAllVisible: jest.fn(),
  clearSelection: jest.fn(),
}

const mockBulkMutate = jest.fn()

describe('CandidateListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useCandidateList).mockReturnValue(mockHookBase)
    jest.mocked(usePrefetchCandidate).mockReturnValue(jest.fn())
    jest.mocked(useBulkUpdateCandidateStatusMutation).mockReturnValue({
      mutate: mockBulkMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useBulkUpdateCandidateStatusMutation>)
  })

  it('renders the page title', () => {
    renderWithTheme(<CandidateListPage />)
    expect(screen.getByText('Candidate List')).toBeInTheDocument()
  })

  it('passes isLoading state to the view — shows skeleton when loading', async () => {
    jest.mocked(useCandidateList).mockReturnValue({ ...mockHookBase, isLoading: true })
    renderWithTheme(<CandidateListPage />)
    expect(await screen.findByText('Loading candidates…')).toBeInTheDocument()
  })

  it('shows error alert when the hook reports an error', async () => {
    jest.mocked(useCandidateList).mockReturnValue({ ...mockHookBase, isError: true })
    renderWithTheme(<CandidateListPage />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('opens the dialog when Add Candidate is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<CandidateListPage />)
    await user.click(screen.getByRole('button', { name: /add candidate/i }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('calls the bulk mutation with selected ids and clears selection on success', async () => {
    const user = userEvent.setup()
    jest.mocked(useCandidateList).mockReturnValue({
      ...mockHookBase,
      selectedIds: new Set([toCandidateId(1), toCandidateId(2)]),
    })
    renderWithTheme(<CandidateListPage />)

    await user.click(screen.getByRole('button', { name: /move to/i }))
    await user.click(await screen.findByRole('menuitem', { name: 'Rejected' }))

    expect(mockBulkMutate).toHaveBeenCalledWith(
      { ids: [1, 2], status: 'rejected' },
      { onSuccess: mockHookBase.clearSelection },
    )
  })
})
