import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../tests/utils'
import ErrorFallback from './ErrorFallback.component'

describe('ErrorFallback', () => {
  it('renders the error message', () => {
    renderWithTheme(<ErrorFallback error={new Error('Boom')} onRetry={jest.fn()} />)
    expect(screen.getByText('Boom')).toBeInTheDocument()
  })

  it('calls onRetry when the retry button is clicked', async () => {
    const user = userEvent.setup()
    const onRetry = jest.fn()
    renderWithTheme(<ErrorFallback error={new Error('Boom')} onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: /try again/i }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
