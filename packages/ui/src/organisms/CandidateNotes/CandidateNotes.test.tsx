import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toCandidateId, type CandidateNote } from '@repo/types'
import { renderWithTheme } from '../../tests/utils'
import CandidateNotes from './CandidateNotes.component'

const mockNotes: CandidateNote[] = [
  { id: 2, candidateId: toCandidateId(1), body: 'Second note', createdAt: '2026-05-16T10:00:00Z' },
  { id: 1, candidateId: toCandidateId(1), body: 'First note', createdAt: '2026-05-15T09:00:00Z' },
]

const baseProps = {
  notes: mockNotes,
  isLoading: false,
  isSubmitting: false,
  onAddNote: jest.fn(),
}

describe('CandidateNotes', () => {
  it('renders the section title', () => {
    renderWithTheme(<CandidateNotes {...baseProps} />)
    expect(screen.getByText('Notes')).toBeInTheDocument()
  })

  it('renders each note body', () => {
    renderWithTheme(<CandidateNotes {...baseProps} />)
    expect(screen.getByText('Second note')).toBeInTheDocument()
    expect(screen.getByText('First note')).toBeInTheDocument()
  })

  it('shows an empty state when there are no notes', () => {
    renderWithTheme(<CandidateNotes {...baseProps} notes={[]} />)
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument()
  })

  it('shows a spinner when isLoading is true', async () => {
    renderWithTheme(<CandidateNotes {...baseProps} isLoading notes={[]} />)
    expect(await screen.findByRole('progressbar')).toBeInTheDocument()
  })

  it('disables the submit button while the input is empty', () => {
    renderWithTheme(<CandidateNotes {...baseProps} />)
    expect(screen.getByRole('button', { name: /add note/i })).toBeDisabled()
  })

  it('calls onAddNote with trimmed text and clears the input on submit', async () => {
    const onAddNote = jest.fn()
    const user = userEvent.setup()
    renderWithTheme(<CandidateNotes {...baseProps} onAddNote={onAddNote} />)

    const input = screen.getByPlaceholderText(/add a note/i)
    await user.type(input, '  New note text  ')
    await user.click(screen.getByRole('button', { name: /add note/i }))

    expect(onAddNote).toHaveBeenCalledWith('New note text')
    expect(input).toHaveValue('')
  })

  it('shows "Adding…" and disables the button while isSubmitting is true', () => {
    renderWithTheme(<CandidateNotes {...baseProps} isSubmitting />)
    expect(screen.getByRole('button', { name: /adding…/i })).toBeDisabled()
  })
})
