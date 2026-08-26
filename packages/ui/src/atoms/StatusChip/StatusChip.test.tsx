import { screen } from '@testing-library/react'
import type { Candidate } from '@repo/types'
import { renderWithTheme } from '../../tests/utils'
import StatusChip from './StatusChip.component'

const cases: Array<[Candidate['status'], string]> = [
  ['applied',   'Applied'],
  ['screening', 'Screening'],
  ['interview', 'Interview'],
  ['offer',     'Offer'],
  ['hired',     'Hired'],
  ['rejected',  'Rejected'],
]

describe('StatusChip', () => {
  it.each(cases)('renders label "%s" for status %s', (status, expectedLabel) => {
    renderWithTheme(<StatusChip status={status} />)
    expect(screen.getByText(expectedLabel)).toBeInTheDocument()
  })
})
