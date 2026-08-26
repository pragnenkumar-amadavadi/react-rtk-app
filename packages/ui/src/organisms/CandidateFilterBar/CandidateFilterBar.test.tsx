import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../tests/utils'
import CandidateFilterBar from './CandidateFilterBar.component'

const baseProps = {
  status: [],
  shownCount: 10,
  totalCount: 42,
  isInitialLoading: false,
  onSearchChange: jest.fn(),
  onStatusChange: jest.fn(),
}

describe('CandidateFilterBar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the search input and status chips', () => {
    renderWithTheme(<CandidateFilterBar {...baseProps} />)
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Applied' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Rejected' })).toBeInTheDocument()
  })

  it('shows the shown/total count', () => {
    renderWithTheme(<CandidateFilterBar {...baseProps} />)
    expect(screen.getByText('Showing 10 of 42')).toBeInTheDocument()
  })

  it('shows a loading message while initial loading', () => {
    renderWithTheme(<CandidateFilterBar {...baseProps} isInitialLoading />)
    expect(screen.getByText('Loading candidates…')).toBeInTheDocument()
  })

  it('debounces search input — does not call onSearchChange per keystroke', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    renderWithTheme(<CandidateFilterBar {...baseProps} />)

    await user.type(screen.getByPlaceholderText(/search by name/i), 'Jane')
    expect(baseProps.onSearchChange).not.toHaveBeenCalled()

    jest.advanceTimersByTime(300)
    expect(baseProps.onSearchChange).toHaveBeenLastCalledWith('Jane')
  })

  it('toggles a status filter on chip click', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    renderWithTheme(<CandidateFilterBar {...baseProps} />)
    await user.click(screen.getByRole('button', { name: 'Applied' }))
    expect(baseProps.onStatusChange).toHaveBeenCalledWith(['applied'])
  })

  it('removes a status filter when an active chip is clicked again', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    renderWithTheme(<CandidateFilterBar {...baseProps} status={['applied']} />)
    await user.click(screen.getByRole('button', { name: 'Applied' }))
    expect(baseProps.onStatusChange).toHaveBeenCalledWith([])
  })
})
