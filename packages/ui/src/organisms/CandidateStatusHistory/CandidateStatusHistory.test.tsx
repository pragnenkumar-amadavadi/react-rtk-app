import { screen } from '@testing-library/react'
import { toCandidateId, type CandidateStatusHistoryEntry } from '@repo/types'
import { renderWithTheme } from '../../tests/utils'
import CandidateStatusHistory from './CandidateStatusHistory.component'

const mockHistory: CandidateStatusHistoryEntry[] = [
  { id: 2, candidateId: toCandidateId(1), fromStatus: 'offer', toStatus: 'hired', changedAt: '2026-05-16T10:00:00Z' },
  { id: 1, candidateId: toCandidateId(1), fromStatus: 'applied', toStatus: 'screening', changedAt: '2026-05-15T09:00:00Z' },
]

const baseProps = {
  history: mockHistory,
  isLoading: false,
}

describe('CandidateStatusHistory', () => {
  it('renders the section title', () => {
    renderWithTheme(<CandidateStatusHistory {...baseProps} />)
    expect(screen.getByText('Status History')).toBeInTheDocument()
  })

  it('renders each transition\'s from and to status labels', () => {
    renderWithTheme(<CandidateStatusHistory {...baseProps} />)
    expect(screen.getByText('Offer')).toBeInTheDocument()
    expect(screen.getByText('Hired')).toBeInTheDocument()
    expect(screen.getByText('Applied')).toBeInTheDocument()
    expect(screen.getByText('Screening')).toBeInTheDocument()
  })

  it('shows an empty state when there is no history', () => {
    renderWithTheme(<CandidateStatusHistory {...baseProps} history={[]} />)
    expect(screen.getByText(/no status changes yet/i)).toBeInTheDocument()
  })

  it('shows a spinner when isLoading is true', async () => {
    renderWithTheme(<CandidateStatusHistory {...baseProps} isLoading history={[]} />)
    expect(await screen.findByRole('progressbar')).toBeInTheDocument()
  })
})
