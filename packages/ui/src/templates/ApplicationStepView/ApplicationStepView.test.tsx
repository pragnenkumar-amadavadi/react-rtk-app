import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../tests/utils'
import ApplicationStepView from './ApplicationStepView.component'

const steps = ['Your Name', 'Experience', 'Offer']

const baseProps = {
  jobTitle: 'Software Engineer at Acme Corp',
  stepIndex: 0,
  steps,
  fieldConfig: { name: 'name', label: 'Full Name', type: 'text' as const },
  submitLabel: 'Next',
  onSubmit: jest.fn(),
}

describe('ApplicationStepView', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders the job title', () => {
    renderWithTheme(<ApplicationStepView {...baseProps} />)
    expect(screen.getByText('Software Engineer at Acme Corp')).toBeInTheDocument()
  })

  it('renders all step labels in the indicator', () => {
    renderWithTheme(<ApplicationStepView {...baseProps} />)
    expect(screen.getByText('Your Name')).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Offer')).toBeInTheDocument()
  })

  it('renders the form field label', () => {
    renderWithTheme(<ApplicationStepView {...baseProps} />)
    expect(screen.getByRole('textbox', { name: /full name/i })).toBeInTheDocument()
  })

  it('renders the submit button with the configured label', () => {
    renderWithTheme(<ApplicationStepView {...baseProps} />)
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('calls onSubmit with the typed value when the form is submitted', async () => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()
    renderWithTheme(<ApplicationStepView {...baseProps} onSubmit={onSubmit} />)
    await user.type(screen.getByRole('textbox', { name: /full name/i }), 'Jane Doe')
    await user.click(screen.getByRole('button', { name: /next/i }))
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Jane Doe')
    })
  })

  it('renders a number spinbutton for number-type fields', () => {
    renderWithTheme(
      <ApplicationStepView
        {...baseProps}
        stepIndex={1}
        fieldConfig={{ name: 'experience', label: 'Years of Experience', type: 'number' }}
        submitLabel="Next"
      />,
    )
    expect(screen.getByRole('spinbutton', { name: /years of experience/i })).toBeInTheDocument()
  })
})
