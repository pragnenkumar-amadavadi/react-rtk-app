import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../tests/utils'
import CandidateStatusControl from './CandidateStatusControl.component'

const baseProps = {
  status: 'applied' as const,
  onStatusChange: jest.fn(),
}

describe('CandidateStatusControl', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders the current status chip', () => {
    renderWithTheme(<CandidateStatusControl {...baseProps} />)
    expect(screen.getByText('Applied')).toBeInTheDocument()
  })

  it('offers the sensible next stages for "applied"', () => {
    renderWithTheme(<CandidateStatusControl {...baseProps} />)
    expect(screen.getByRole('button', { name: 'Move to Screening' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reject' })).toBeInTheDocument()
  })

  it('offers the sensible next stages for "offer"', () => {
    renderWithTheme(<CandidateStatusControl {...baseProps} status="offer" />)
    expect(screen.getByRole('button', { name: 'Mark as Hired' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reject' })).toBeInTheDocument()
  })

  it('shows no action buttons for a terminal status', () => {
    renderWithTheme(<CandidateStatusControl {...baseProps} status="hired" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onStatusChange with the target status when an action is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<CandidateStatusControl {...baseProps} />)
    await user.click(screen.getByRole('button', { name: 'Move to Screening' }))
    expect(baseProps.onStatusChange).toHaveBeenCalledWith('screening')
  })

  it('disables action buttons while updating', () => {
    renderWithTheme(<CandidateStatusControl {...baseProps} isUpdating />)
    expect(screen.getByRole('button', { name: 'Move to Screening' })).toBeDisabled()
  })
})
