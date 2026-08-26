import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../tests/utils'
import BulkStatusToolbar from './BulkStatusToolbar.component'

const baseProps = {
  selectedCount: 4,
  onMoveToStatus: jest.fn(),
  onClear: jest.fn(),
}

describe('BulkStatusToolbar', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders nothing when nothing is selected', () => {
    const { container } = renderWithTheme(<BulkStatusToolbar {...baseProps} selectedCount={0} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the selected count', () => {
    renderWithTheme(<BulkStatusToolbar {...baseProps} />)
    expect(screen.getByText('4 selected')).toBeInTheDocument()
  })

  it('calls onMoveToStatus with the chosen status', async () => {
    const user = userEvent.setup()
    renderWithTheme(<BulkStatusToolbar {...baseProps} />)
    await user.click(screen.getByRole('button', { name: /move to/i }))
    await user.click(await screen.findByRole('menuitem', { name: 'Screening' }))
    expect(baseProps.onMoveToStatus).toHaveBeenCalledWith('screening')
  })

  it('calls onClear when Clear is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<BulkStatusToolbar {...baseProps} />)
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(baseProps.onClear).toHaveBeenCalledTimes(1)
  })

  it('disables the Move to button while updating', () => {
    renderWithTheme(<BulkStatusToolbar {...baseProps} isUpdating />)
    expect(screen.getByRole('button', { name: /move to/i })).toBeDisabled()
  })
})
