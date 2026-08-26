import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../tests/utils'
import { useDashboardStatsQuery } from '../../../features/dashboard/dashboardQueries'
import DashboardPage from './DashboardPage.component'

jest.mock('../../../features/dashboard/dashboardQueries', () => ({
  useDashboardStatsQuery: jest.fn(),
}))

import type { DashboardStats } from '@repo/types'

const mockStats: DashboardStats = {
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

describe('DashboardPage', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders the dashboard title', () => {
    jest.mocked(useDashboardStatsQuery).mockReturnValue({
      data: mockStats,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useDashboardStatsQuery>)
    renderWithTheme(<DashboardPage />)
    expect(screen.getByRole('heading', { name: /^dashboard$/i })).toBeInTheDocument()
  })

  it('shows loading text when data is being fetched', () => {
    jest.mocked(useDashboardStatsQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof useDashboardStatsQuery>)
    renderWithTheme(<DashboardPage />)
    expect(screen.getByText('Loading dashboard…')).toBeInTheDocument()
  })

  it('shows an error alert when the query fails', () => {
    jest.mocked(useDashboardStatsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as unknown as ReturnType<typeof useDashboardStatsQuery>)
    renderWithTheme(<DashboardPage />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders stats from query data', () => {
    jest.mocked(useDashboardStatsQuery).mockReturnValue({
      data: mockStats,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useDashboardStatsQuery>)
    renderWithTheme(<DashboardPage />)
    expect(screen.getByText('69')).toBeInTheDocument()
    expect(screen.getByText('Open candidates')).toBeInTheDocument()
  })
})
