import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../tests/utils'
import { toJobId, type Job } from '@repo/types'
import JobCard from './JobCard.component'

const mockJob: Job = {
  id: toJobId(1),
  title: 'Software Engineer',
  company: 'Acme Corp',
  location: 'Remote',
  type: 'full-time',
  salary: '$90,000 – $120,000 / yr',
  description: 'Build great things.',
  requirements: ['TypeScript', 'React'],
  postedAt: '2026-06-01T00:00:00Z',
}

describe('JobCard', () => {
  it('renders the job title', () => {
    renderWithTheme(<JobCard job={mockJob} />)
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
  })

  it('renders the company name', () => {
    renderWithTheme(<JobCard job={mockJob} />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
  })

  it('renders the location', () => {
    renderWithTheme(<JobCard job={mockJob} />)
    expect(screen.getByText('Remote')).toBeInTheDocument()
  })

  it('renders the salary', () => {
    renderWithTheme(<JobCard job={mockJob} />)
    expect(screen.getByText('$90,000 – $120,000 / yr')).toBeInTheDocument()
  })

  it('renders the job type chip', () => {
    renderWithTheme(<JobCard job={mockJob} />)
    expect(screen.getByText('full-time')).toBeInTheDocument()
  })

  it('wraps the card in a link pointing to the job detail page', () => {
    renderWithTheme(<JobCard job={mockJob} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/jobs/1')
  })

  it('calls onHover with the job id when the card is hovered', async () => {
    const onHover = jest.fn()
    const user = userEvent.setup()
    renderWithTheme(<JobCard job={mockJob} onHover={onHover} />)
    await user.hover(screen.getByRole('link'))
    expect(onHover).toHaveBeenCalledWith(1)
    expect(onHover).toHaveBeenCalledTimes(1)
  })

  it('does not crash when onHover is not provided', async () => {
    const user = userEvent.setup()
    renderWithTheme(<JobCard job={mockJob} />)
    await user.hover(screen.getByRole('link'))
    // no error thrown
  })
})
