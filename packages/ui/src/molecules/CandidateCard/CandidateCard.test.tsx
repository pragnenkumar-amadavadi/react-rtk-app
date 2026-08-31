import { screen } from '@testing-library/react'
import { toCandidateId, type Candidate } from '@repo/types'
import { renderWithTheme } from '../../tests/utils'
import CandidateCard from './CandidateCard.component'

const mockCandidate: Candidate = {
  id: toCandidateId(1),
  name: 'Alice Johnson',
  email: 'alice@example.com',
  phone: '+1-555-123-4567',
  position: 'Frontend Engineer',
  status: 'interview',
  experience: 4,
  location: 'San Francisco, CA',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  appliedAt: '2026-06-15T12:00:00Z',
}

describe('CandidateCard', () => {
  it('renders the candidate name', () => {
    renderWithTheme(<CandidateCard candidate={mockCandidate} />)
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
  })

  it('renders the email', () => {
    renderWithTheme(<CandidateCard candidate={mockCandidate} />)
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
  })

  it('renders the phone number', () => {
    renderWithTheme(<CandidateCard candidate={mockCandidate} />)
    expect(screen.getByText('+1-555-123-4567')).toBeInTheDocument()
  })

  it('renders the location', () => {
    renderWithTheme(<CandidateCard candidate={mockCandidate} />)
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument()
  })

  it('renders position and experience', () => {
    renderWithTheme(<CandidateCard candidate={mockCandidate} />)
    expect(screen.getByText('Frontend Engineer · 4y exp')).toBeInTheDocument()
  })

  it('renders the applied date', () => {
    renderWithTheme(<CandidateCard candidate={mockCandidate} />)
    // toLocaleDateString output varies by platform; just assert the prefix is there
    expect(screen.getByText(/^Applied /)).toBeInTheDocument()
  })

  it('renders the status chip with correct label', () => {
    renderWithTheme(<CandidateCard candidate={mockCandidate} />)
    expect(screen.getByText('Interview')).toBeInTheDocument()
  })

  it('renders the avatar with the candidate photo and name as alt text', () => {
    renderWithTheme(<CandidateCard candidate={mockCandidate} />)
    const avatar = screen.getByRole('img', { name: 'Alice Johnson' })
    expect(avatar).toHaveAttribute('src', mockCandidate.avatarUrl)
  })
})
