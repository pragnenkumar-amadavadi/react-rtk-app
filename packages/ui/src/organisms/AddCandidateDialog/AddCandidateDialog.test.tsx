import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../tests/utils'
import AddCandidateDialog from './AddCandidateDialog.component'

const baseProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
}

describe('AddCandidateDialog', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('when closed', () => {
    it('does not mount the dialog', () => {
      renderWithTheme(<AddCandidateDialog {...baseProps} open={false} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('when open', () => {
    it('renders the dialog title', () => {
      renderWithTheme(<AddCandidateDialog {...baseProps} />)
      expect(screen.getByRole('heading', { name: /add candidate/i })).toBeInTheDocument()
    })

    it('renders text inputs for name, email, phone, and location', () => {
      renderWithTheme(<AddCandidateDialog {...baseProps} />)
      expect(screen.getByRole('textbox', { name: /full name/i })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /^email/i })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /phone/i })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /location/i })).toBeInTheDocument()
    })

    it('renders the experience number input', () => {
      renderWithTheme(<AddCandidateDialog {...baseProps} />)
      expect(screen.getByRole('spinbutton', { name: /experience/i })).toBeInTheDocument()
    })

    it('renders Cancel and Add Candidate buttons', () => {
      renderWithTheme(<AddCandidateDialog {...baseProps} />)
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /add candidate/i })).toBeInTheDocument()
    })

    it('calls onClose when Cancel is clicked', async () => {
      const user = userEvent.setup()
      renderWithTheme(<AddCandidateDialog {...baseProps} />)
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(baseProps.onClose).toHaveBeenCalledTimes(1)
    })

    describe('form validation', () => {
      it('blocks submit and shows name error when name is empty', async () => {
        const user = userEvent.setup()
        renderWithTheme(<AddCandidateDialog {...baseProps} />)
        await user.click(screen.getByRole('button', { name: /add candidate/i }))
        expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument()
        expect(baseProps.onSubmit).not.toHaveBeenCalled()
      })

      it('shows name error when name has fewer than 2 characters', async () => {
        const user = userEvent.setup()
        renderWithTheme(<AddCandidateDialog {...baseProps} />)
        await user.type(screen.getByRole('textbox', { name: /full name/i }), 'J')
        await user.click(screen.getByRole('button', { name: /add candidate/i }))
        expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument()
      })

      it('shows email error when email format is invalid', async () => {
        const user = userEvent.setup()
        renderWithTheme(<AddCandidateDialog {...baseProps} />)
        await user.type(screen.getByRole('textbox', { name: /full name/i }), 'Jane Doe')
        await user.type(screen.getByRole('textbox', { name: /^email/i }), 'not-an-email')
        await user.click(screen.getByRole('button', { name: /add candidate/i }))
        expect(await screen.findByText(/valid email/i)).toBeInTheDocument()
        expect(baseProps.onSubmit).not.toHaveBeenCalled()
      })

      it('shows phone error when phone is fewer than 7 characters', async () => {
        const user = userEvent.setup()
        renderWithTheme(<AddCandidateDialog {...baseProps} />)
        await user.type(screen.getByRole('textbox', { name: /full name/i }), 'Jane Doe')
        await user.type(screen.getByRole('textbox', { name: /^email/i }), 'jane@example.com')
        await user.type(screen.getByRole('textbox', { name: /phone/i }), '123')
        await user.click(screen.getByRole('button', { name: /add candidate/i }))
        expect(await screen.findByText(/valid phone number/i)).toBeInTheDocument()
        expect(baseProps.onSubmit).not.toHaveBeenCalled()
      })

      it('shows location error when location is empty', async () => {
        const user = userEvent.setup()
        renderWithTheme(<AddCandidateDialog {...baseProps} />)
        await user.type(screen.getByRole('textbox', { name: /full name/i }), 'Jane Doe')
        await user.type(screen.getByRole('textbox', { name: /^email/i }), 'jane@example.com')
        await user.type(screen.getByRole('textbox', { name: /phone/i }), '+1-555-000-0000')
        // location intentionally left empty
        await user.click(screen.getByRole('button', { name: /add candidate/i }))
        expect(await screen.findByText(/location is required/i)).toBeInTheDocument()
        expect(baseProps.onSubmit).not.toHaveBeenCalled()
      })

      it('shows position error when no position is selected', async () => {
        const user = userEvent.setup()
        renderWithTheme(<AddCandidateDialog {...baseProps} />)
        await user.type(screen.getByRole('textbox', { name: /full name/i }), 'Jane Doe')
        await user.type(screen.getByRole('textbox', { name: /^email/i }), 'jane@example.com')
        await user.type(screen.getByRole('textbox', { name: /phone/i }), '+1-555-000-0000')
        await user.type(screen.getByRole('textbox', { name: /location/i }), 'Austin, TX')
        // position select intentionally left empty
        await user.click(screen.getByRole('button', { name: /add candidate/i }))
        expect(await screen.findByText(/position is required/i)).toBeInTheDocument()
        expect(baseProps.onSubmit).not.toHaveBeenCalled()
      })

      it('shows experience error when experience is negative', async () => {
        const user = userEvent.setup()
        renderWithTheme(<AddCandidateDialog {...baseProps} />)
        const experienceInput = screen.getByRole('spinbutton', { name: /experience/i })
        await user.clear(experienceInput)
        await user.type(experienceInput, '-1')
        await user.click(screen.getByRole('button', { name: /add candidate/i }))
        expect(await screen.findByText(/cannot be negative/i)).toBeInTheDocument()
        expect(baseProps.onSubmit).not.toHaveBeenCalled()
      })

      it('shows experience error when experience exceeds 50 years', async () => {
        const user = userEvent.setup()
        renderWithTheme(<AddCandidateDialog {...baseProps} />)
        const experienceInput = screen.getByRole('spinbutton', { name: /experience/i })
        await user.clear(experienceInput)
        await user.type(experienceInput, '51')
        await user.click(screen.getByRole('button', { name: /add candidate/i }))
        expect(await screen.findByText(/50 or fewer years/i)).toBeInTheDocument()
        expect(baseProps.onSubmit).not.toHaveBeenCalled()
      })

      it('clears the name error once a valid name is typed', async () => {
        const user = userEvent.setup()
        renderWithTheme(<AddCandidateDialog {...baseProps} />)

        // Trigger the name error
        await user.click(screen.getByRole('button', { name: /add candidate/i }))
        expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument()

        // Correct the field — react-hook-form revalidates on change after first submit
        await user.type(screen.getByRole('textbox', { name: /full name/i }), 'Jane Doe')
        await waitFor(() => {
          expect(screen.queryByText(/at least 2 characters/i)).not.toBeInTheDocument()
        })
      })

      it('clears the email error once a valid email is typed', async () => {
        const user = userEvent.setup()
        renderWithTheme(<AddCandidateDialog {...baseProps} />)

        await user.type(screen.getByRole('textbox', { name: /full name/i }), 'Jane Doe')
        await user.type(screen.getByRole('textbox', { name: /^email/i }), 'bad')
        await user.click(screen.getByRole('button', { name: /add candidate/i }))
        expect(await screen.findByText(/valid email/i)).toBeInTheDocument()

        // Fix the email
        await user.clear(screen.getByRole('textbox', { name: /^email/i }))
        await user.type(screen.getByRole('textbox', { name: /^email/i }), 'jane@example.com')
        await waitFor(() => {
          expect(screen.queryByText(/valid email/i)).not.toBeInTheDocument()
        })
      })
    })

    it('calls onSubmit when all required fields are filled correctly', async () => {
      const user = userEvent.setup()
      renderWithTheme(<AddCandidateDialog {...baseProps} />)

      await user.type(screen.getByRole('textbox', { name: /full name/i }), 'Jane Doe')
      await user.type(screen.getByRole('textbox', { name: /^email/i }), 'jane@example.com')
      await user.type(screen.getByRole('textbox', { name: /phone/i }), '+1-555-000-0000')
      await user.type(screen.getByRole('textbox', { name: /location/i }), 'Austin, TX')

      // Open the Position select and pick an option
      await user.click(screen.getByRole('combobox', { name: /position/i }))
      await user.click(screen.getByRole('option', { name: 'Frontend Engineer' }))

      await user.click(screen.getByRole('button', { name: /add candidate/i }))

      await waitFor(() => {
        expect(baseProps.onSubmit).toHaveBeenCalledTimes(1)
      })
      expect(baseProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Jane Doe',
          email: 'jane@example.com',
          position: 'Frontend Engineer',
        }),
      )
    })
  })
})
