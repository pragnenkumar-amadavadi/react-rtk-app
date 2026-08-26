import { screen } from '@testing-library/react'
import { toCandidateId, type Candidate } from '@repo/types'
import { renderWithTheme } from '../../tests/utils'
import JobApplicants from './JobApplicants.component'

const mockApplicants: Candidate[] = [
  {
    id: toCandidateId(3),
    name: 'Sam King',
    email: 'sam@example.com',
    phone: '+1-555-000-1111',
    position: 'Backend Engineer',
    status: 'applied',
    experience: 5,
    location: 'Chicago, IL',
    avatarUrl: '',
    appliedAt: '2026-06-01T00:00:00Z',
  },
]

const baseProps = { applicants: mockApplicants, isLoading: false, isError: false }

describe('JobApplicants', () => {
  it('renders the applicant count in the title', () => {
    renderWithTheme(<JobApplicants {...baseProps} />)
    expect(screen.getByText('Applicants (1)')).toBeInTheDocument()
  })

  it('renders a card linking to the candidate detail page for each applicant', () => {
    renderWithTheme(<JobApplicants {...baseProps} />)
    expect(screen.getByText('Sam King')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sam king/i })).toHaveAttribute('href', '/candidates/3')
  })

  it('shows an empty state when there are no applicants', () => {
    renderWithTheme(<JobApplicants {...baseProps} applicants={[]} />)
    expect(screen.getByText('Applicants (0)')).toBeInTheDocument()
    expect(screen.getByText(/no applicants yet/i)).toBeInTheDocument()
  })

  it('shows a spinner when isLoading is true', async () => {
    renderWithTheme(<JobApplicants {...baseProps} isLoading applicants={[]} />)
    expect(await screen.findByRole('progressbar')).toBeInTheDocument()
  })

  it('shows an error alert when isError is true', async () => {
    renderWithTheme(<JobApplicants {...baseProps} isError applicants={[]} />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
