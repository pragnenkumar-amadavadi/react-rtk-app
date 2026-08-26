import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../../tests/utils'
import { useJobQuery, useSubmitApplicationMutation } from '../../../features/jobs/jobQueries'
import ApplicationPage from './ApplicationPage.component'
import { toJobId, type Job } from '@repo/types'

jest.mock('../../../features/jobs/jobQueries', () => ({
  useJobQuery: jest.fn(),
  useSubmitApplicationMutation: jest.fn(),
}))

let mockNavigate: jest.Mock

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
  useLocation: jest.fn(),
}))

import { useParams, useLocation } from 'react-router-dom'

const mockJob: Job = {
  id: toJobId(5),
  title: 'Frontend Engineer',
  company: 'Acme',
  location: 'Remote',
  type: 'full-time',
  salary: '$100k',
  description: 'Build UIs.',
  requirements: ['React'],
  postedAt: '2026-06-01T00:00:00Z',
}

const mockMutate = jest.fn()

describe('ApplicationPage', () => {
  beforeEach(() => {
    mockNavigate = jest.fn()
    jest.clearAllMocks()
    jest.mocked(useJobQuery).mockReturnValue({ data: mockJob } as unknown as ReturnType<typeof useJobQuery>)
    jest.mocked(useSubmitApplicationMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useSubmitApplicationMutation>)
    jest.mocked(useParams).mockReturnValue({ jobId: '5', step: '1' })
    jest.mocked(useLocation).mockReturnValue({
      state: null,
      pathname: '/jobs/5/apply/1',
      search: '',
      hash: '',
      key: 'default',
    })
  })

  describe('step 1 — Full Name', () => {
    it('renders the Full Name text input', async () => {
      renderWithTheme(<ApplicationPage />)
      expect(await screen.findByRole('textbox', { name: /full name/i })).toBeInTheDocument()
    })

    it('renders the Next button', async () => {
      renderWithTheme(<ApplicationPage />)
      expect(await screen.findByRole('button', { name: /^next$/i })).toBeInTheDocument()
    })

    it('shows a validation error when submitted empty', async () => {
      const user = userEvent.setup()
      renderWithTheme(<ApplicationPage />)
      await user.click(screen.getByRole('button', { name: /^next$/i }))
      await waitFor(() => {
        expect(screen.getByText('This field is required')).toBeInTheDocument()
      })
    })

    it('navigates to step 2 with the typed name in state', async () => {
      const user = userEvent.setup()
      renderWithTheme(<ApplicationPage />)
      await user.type(screen.getByRole('textbox', { name: /full name/i }), 'Jane Doe')
      await user.click(screen.getByRole('button', { name: /^next$/i }))
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/jobs/5/apply/2', {
          state: { name: 'Jane Doe' },
        })
      })
    })
  })

  describe('step 2 — Experience', () => {
    beforeEach(() => {
      jest.mocked(useParams).mockReturnValue({ jobId: '5', step: '2' })
      jest.mocked(useLocation).mockReturnValue({
        state: { name: 'Jane Doe' },
        pathname: '/jobs/5/apply/2',
        search: '',
        hash: '',
        key: 'default',
      })
    })

    it('renders the Years of Experience spinbutton', async () => {
      renderWithTheme(<ApplicationPage />)
      expect(
        await screen.findByRole('spinbutton', { name: /years of experience/i }),
      ).toBeInTheDocument()
    })

    it('navigates to step 3 carrying accumulated state', async () => {
      const user = userEvent.setup()
      renderWithTheme(<ApplicationPage />)
      await user.type(screen.getByRole('spinbutton', { name: /years of experience/i }), '3')
      await user.click(screen.getByRole('button', { name: /^next$/i }))
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/jobs/5/apply/3', {
          state: { name: 'Jane Doe', experience: '3' },
        })
      })
    })
  })

  describe('step 3 — Expected Salary', () => {
    beforeEach(() => {
      jest.mocked(useParams).mockReturnValue({ jobId: '5', step: '3' })
      jest.mocked(useLocation).mockReturnValue({
        state: { name: 'Jane Doe', experience: '3' },
        pathname: '/jobs/5/apply/3',
        search: '',
        hash: '',
        key: 'default',
      })
    })

    it('renders the Expected Annual Salary spinbutton', async () => {
      renderWithTheme(<ApplicationPage />)
      expect(
        await screen.findByRole('spinbutton', { name: /expected annual salary/i }),
      ).toBeInTheDocument()
    })

    it('renders the Submit Application button', async () => {
      renderWithTheme(<ApplicationPage />)
      expect(
        await screen.findByRole('button', { name: /submit application/i }),
      ).toBeInTheDocument()
    })

    it('calls the mutation with all accumulated data when submitted', async () => {
      const user = userEvent.setup()
      renderWithTheme(<ApplicationPage />)
      await user.type(
        screen.getByRole('spinbutton', { name: /expected annual salary/i }),
        '80000',
      )
      await user.click(screen.getByRole('button', { name: /submit application/i }))
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          { jobId: '5', name: 'Jane Doe', experience: 3, expectedSalary: 80000 },
          expect.objectContaining({ onSuccess: expect.any(Function) }),
        )
      })
    })

    it('navigates to the job detail page with applied state after successful submission', async () => {
      mockMutate.mockImplementation((_payload: unknown, callbacks: { onSuccess: () => void }) => {
        callbacks.onSuccess()
      })
      const user = userEvent.setup()
      renderWithTheme(<ApplicationPage />)
      await user.type(
        screen.getByRole('spinbutton', { name: /expected annual salary/i }),
        '80000',
      )
      await user.click(screen.getByRole('button', { name: /submit application/i }))
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/jobs/5', { state: { applied: true } })
      })
    })
  })
})
