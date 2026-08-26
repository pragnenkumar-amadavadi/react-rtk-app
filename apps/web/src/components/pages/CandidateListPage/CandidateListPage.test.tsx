import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../../tests/utils'
import { useCandidateList } from '../../../features/candidates/useCandidateList'
import CandidateListPage from './CandidateListPage.component'

// Factory prevents Jest from loading the real module chain (→ axiosClient → config → import.meta.env)
jest.mock('../../../features/candidates/useCandidateList', () => ({
  useCandidateList: jest.fn(),
}))

jest.mock('../../../features/candidates/candidateQueries', () => ({
  usePrefetchCandidate: jest.fn(() => jest.fn()),
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
  isLoading: false,
  hasMore: false,
  isError: false,
  loadMore: jest.fn(),
  addCandidate: jest.fn(),
}

describe('CandidateListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useCandidateList).mockReturnValue(mockHookBase)
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
})
