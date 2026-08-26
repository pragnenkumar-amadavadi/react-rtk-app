import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../tests/utils'
import ColorSchemeToggle from './ColorSchemeToggle.component'

describe('ColorSchemeToggle', () => {
  it('renders a button to switch to dark mode when starting in light mode', () => {
    renderWithTheme(<ColorSchemeToggle />)
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()
  })

  it('switches the label after being clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<ColorSchemeToggle />)
    await user.click(screen.getByRole('button', { name: /switch to dark mode/i }))
    expect(await screen.findByRole('button', { name: /switch to light mode/i })).toBeInTheDocument()
  })
})
