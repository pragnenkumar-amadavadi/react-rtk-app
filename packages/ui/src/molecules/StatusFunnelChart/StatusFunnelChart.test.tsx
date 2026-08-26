import { screen } from '@testing-library/react'
import type { Candidate } from '@repo/types'
import { renderWithTheme } from '../../tests/utils'
import StatusFunnelChart from './StatusFunnelChart.component'

const counts: Record<Candidate['status'], number> = {
  applied: 22,
  screening: 20,
  interview: 14,
  offer: 11,
  hired: 13,
  rejected: 18,
}

describe('StatusFunnelChart', () => {
  it('renders every pipeline stage label', () => {
    renderWithTheme(<StatusFunnelChart counts={counts} />)
    expect(screen.getByText('Applied')).toBeInTheDocument()
    expect(screen.getByText('Screening')).toBeInTheDocument()
    expect(screen.getByText('Interview')).toBeInTheDocument()
    expect(screen.getByText('Offer')).toBeInTheDocument()
    expect(screen.getByText('Hired')).toBeInTheDocument()
    expect(screen.getByText('Rejected')).toBeInTheDocument()
  })

  it('renders the count for each stage', () => {
    renderWithTheme(<StatusFunnelChart counts={counts} />)
    expect(screen.getByText('22')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('14')).toBeInTheDocument()
    expect(screen.getByText('11')).toBeInTheDocument()
    expect(screen.getByText('13')).toBeInTheDocument()
    expect(screen.getByText('18')).toBeInTheDocument()
  })

  it('renders a stage with zero candidates without crashing', () => {
    renderWithTheme(
      <StatusFunnelChart counts={{ ...counts, rejected: 0 }} />,
    )
    expect(screen.getByText('Rejected')).toBeInTheDocument()
  })
})
