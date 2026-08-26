import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../tests/utils'
import AppNav from './AppNav.component'

const baseProps = {
  onCandidatesHover: jest.fn(),
  onJobsHover: jest.fn(),
  onDashboardHover: jest.fn(),
}

describe('AppNav', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders links for candidates, jobs, and dashboard', () => {
    renderWithTheme(<AppNav {...baseProps} />)
    expect(screen.getByRole('link', { name: 'Candidates' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Jobs' })).toHaveAttribute('href', '/jobs')
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard')
  })

  it('calls onDashboardHover when the Dashboard link is hovered', async () => {
    const user = userEvent.setup()
    renderWithTheme(<AppNav {...baseProps} />)
    await user.hover(screen.getByRole('link', { name: 'Dashboard' }))
    expect(baseProps.onDashboardHover).toHaveBeenCalledTimes(1)
  })

  it('renders the color scheme toggle', () => {
    renderWithTheme(<AppNav {...baseProps} />)
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()
  })
})
