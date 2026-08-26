import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../tests/utils'
import ApplicationForm from './ApplicationForm.component'
import type { FieldConfig } from './ApplicationForm.types'

const textField: FieldConfig = { name: 'name', label: 'Full Name', type: 'text' }
const numberField: FieldConfig = { name: 'experience', label: 'Years of Experience', type: 'number' }

describe('ApplicationForm — text field', () => {
  it('renders a textbox with the configured label', () => {
    renderWithTheme(
      <ApplicationForm fieldConfig={textField} onSubmit={jest.fn()} submitLabel="Next" />,
    )
    expect(screen.getByRole('textbox', { name: /full name/i })).toBeInTheDocument()
  })

  it('shows "This field is required" and blocks onSubmit when submitted empty', async () => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()
    renderWithTheme(
      <ApplicationForm fieldConfig={textField} onSubmit={onSubmit} submitLabel="Next" />,
    )
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(await screen.findByText('This field is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('clears the required error once valid text is typed', async () => {
    const user = userEvent.setup()
    renderWithTheme(
      <ApplicationForm fieldConfig={textField} onSubmit={jest.fn()} submitLabel="Next" />,
    )
    // Trigger the error
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(await screen.findByText('This field is required')).toBeInTheDocument()

    // Correct the field — react-hook-form revalidates on change after first failed submit
    await user.type(screen.getByRole('textbox', { name: /full name/i }), 'Jane Doe')
    await waitFor(() => {
      expect(screen.queryByText('This field is required')).not.toBeInTheDocument()
    })
  })

  it('calls onSubmit with the typed value when valid', async () => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()
    renderWithTheme(
      <ApplicationForm fieldConfig={textField} onSubmit={onSubmit} submitLabel="Next" />,
    )
    await user.type(screen.getByRole('textbox', { name: /full name/i }), 'Jane Doe')
    await user.click(screen.getByRole('button', { name: /next/i }))
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Jane Doe')
    })
  })

  it('pre-fills the input from defaultValue', () => {
    renderWithTheme(
      <ApplicationForm
        fieldConfig={textField}
        defaultValue="Pre-filled"
        onSubmit={jest.fn()}
        submitLabel="Next"
      />,
    )
    expect(screen.getByRole('textbox', { name: /full name/i })).toHaveValue('Pre-filled')
  })
})

describe('ApplicationForm — number field', () => {
  it('renders a spinbutton with the configured label', () => {
    renderWithTheme(
      <ApplicationForm fieldConfig={numberField} onSubmit={jest.fn()} submitLabel="Next" />,
    )
    expect(screen.getByRole('spinbutton', { name: /years of experience/i })).toBeInTheDocument()
  })

  it('shows "Must be 0 or greater" and blocks onSubmit when a negative number is entered', async () => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()
    renderWithTheme(
      <ApplicationForm fieldConfig={numberField} onSubmit={onSubmit} submitLabel="Next" />,
    )
    await user.type(screen.getByRole('spinbutton', { name: /years of experience/i }), '-1')
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(await screen.findByText('Must be 0 or greater')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('clears the negative-number error once a valid value is entered', async () => {
    const user = userEvent.setup()
    renderWithTheme(
      <ApplicationForm fieldConfig={numberField} onSubmit={jest.fn()} submitLabel="Next" />,
    )
    const input = screen.getByRole('spinbutton', { name: /years of experience/i })

    // Trigger the error
    await user.type(input, '-1')
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(await screen.findByText('Must be 0 or greater')).toBeInTheDocument()

    // Fix the value
    await user.clear(input)
    await user.type(input, '5')
    await waitFor(() => {
      expect(screen.queryByText('Must be 0 or greater')).not.toBeInTheDocument()
    })
  })

  it('calls onSubmit with the entered number as a string when valid', async () => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()
    renderWithTheme(
      <ApplicationForm fieldConfig={numberField} onSubmit={onSubmit} submitLabel="Next" />,
    )
    await user.type(screen.getByRole('spinbutton', { name: /years of experience/i }), '5')
    await user.click(screen.getByRole('button', { name: /next/i }))
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('5')
    })
  })
})

describe('ApplicationForm — loading state', () => {
  it('disables the submit button and shows "Submitting…" when isLoading', () => {
    renderWithTheme(
      <ApplicationForm
        fieldConfig={textField}
        onSubmit={jest.fn()}
        submitLabel="Next"
        isLoading
      />,
    )
    const button = screen.getByRole('button', { name: /submitting/i })
    expect(button).toBeDisabled()
  })
})
