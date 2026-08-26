import { screen } from '@testing-library/react'
import type { DashboardStats } from '@repo/types'
import { renderWithTheme } from '../../tests/utils'
import DashboardView from './DashboardView.component'

const stats: DashboardStats = {
  openCandidates: 69,
  openJobs: 30,
  hiredThisMonth: 1,
  candidateStatusCounts: {
    applied: 22,
    screening: 22,
    interview: 14,
    offer: 11,
    hired: 13,
    rejected: 18,
  },
}

describe('DashboardView', () => {
  it('renders the page title', () => {
    renderWithTheme(<DashboardView stats={stats} isLoading={false} isError={false} />)
    expect(screen.getByRole('heading', { name: /^dashboard$/i })).toBeInTheDocument()
  })

  it('renders the stat tiles', () => {
    renderWithTheme(<DashboardView stats={stats} isLoading={false} isError={false} />)
    expect(screen.getByText('Open candidates')).toBeInTheDocument()
    expect(screen.getByText('69')).toBeInTheDocument()
    expect(screen.getByText('Open jobs')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('Hired this month')).toBeInTheDocument()
  })

  it('renders the status funnel chart', () => {
    renderWithTheme(<DashboardView stats={stats} isLoading={false} isError={false} />)
    expect(screen.getByText('Candidate status funnel')).toBeInTheDocument()
    expect(screen.getByText('Applied')).toBeInTheDocument()
  })

  it('shows loading text while fetching', () => {
    renderWithTheme(<DashboardView stats={undefined} isLoading isError={false} />)
    expect(screen.getByText('Loading dashboard…')).toBeInTheDocument()
  })

  it('shows an error alert when isError is true', () => {
    renderWithTheme(<DashboardView stats={undefined} isLoading={false} isError />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/failed to load dashboard stats/i)).toBeInTheDocument()
  })
})
