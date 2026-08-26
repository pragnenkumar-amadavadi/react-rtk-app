import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '../theme/theme'

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <CssVarsProvider theme={theme} defaultColorScheme="light">
      <CssBaseline />
      <MemoryRouter>{children}</MemoryRouter>
    </CssVarsProvider>
  )
}

export function renderWithTheme(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Wrapper, ...options })
}
