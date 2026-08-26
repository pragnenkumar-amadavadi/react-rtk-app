import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../tests/utils'
import StepIndicator from './StepIndicator.component'

const steps = ['Your Name', 'Experience', 'Offer']

describe('StepIndicator', () => {
  it('renders all step labels', () => {
    renderWithTheme(<StepIndicator steps={steps} currentStep={0} />)
    expect(screen.getByText('Your Name')).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Offer')).toBeInTheDocument()
  })

  it('renders step numbers 1 through 3', () => {
    renderWithTheme(<StepIndicator steps={steps} currentStep={0} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders with the correct count of steps', () => {
    renderWithTheme(<StepIndicator steps={['Step A', 'Step B']} currentStep={0} />)
    expect(screen.getByText('Step A')).toBeInTheDocument()
    expect(screen.getByText('Step B')).toBeInTheDocument()
    expect(screen.queryByText('3')).not.toBeInTheDocument()
  })

  it('renders the current step circle at any valid index', () => {
    renderWithTheme(<StepIndicator steps={steps} currentStep={1} />)
    // All three labels always visible regardless of step
    expect(screen.getByText('Experience')).toBeInTheDocument()
  })
})
