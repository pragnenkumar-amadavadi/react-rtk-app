import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import theme from '@repo/ui/theme'
import { handlers } from '../../../mocks/handlers'
import CandidateListPage from './CandidateListPage.component'

// Only config.ts is stubbed (it's the sole file allowed to touch import.meta.env).
// Everything else — axiosClient, candidatesApi, candidateQueries, useCandidateList —
// runs for real, with MSW intercepting the actual HTTP calls at the network layer.
jest.mock('@repo/api-client/config', () => ({ API_BASE_URL: '/api' }))

jest.mock('react-virtuoso', () => ({
  Virtuoso: ({
    data,
    itemContent,
    components,
  }: {
    data: unknown[]
    itemContent: (index: number, item: unknown) => React.ReactNode
    components?: { Footer?: React.ComponentType }
  }) => {
    const Footer = components?.Footer
    return (
      <div>
        {data.map((item, i) => (
          <div key={i}>{itemContent(i, item)}</div>
        ))}
        {Footer && <Footer />}
      </div>
    )
  },
}))

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 0 } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider theme={theme} defaultColorScheme="light">
        <CssBaseline />
        <MemoryRouter>
          <CandidateListPage />
        </MemoryRouter>
      </CssVarsProvider>
    </QueryClientProvider>,
  )
}

describe('CandidateListPage (integration)', () => {
  it('loads and displays candidates from the mocked API', async () => {
    renderPage()

    expect(await screen.findByText('Ava Johnson')).toBeInTheDocument()
    expect(screen.getByText('ava.johnson0@example.com')).toBeInTheDocument()
    expect(screen.getByText('Showing 20 candidates')).toBeInTheDocument()
  })

  it('submits the Add Candidate form and shows the new candidate after refetch', async () => {
    const user = userEvent.setup()
    renderPage()

    await screen.findByText('Ava Johnson')

    await user.click(screen.getByRole('button', { name: 'Add Candidate' }))
    const dialog = await screen.findByRole('dialog')

    await user.type(within(dialog).getByLabelText(/Full Name/), 'Nina Patel')
    await user.type(within(dialog).getByLabelText(/Email/), 'nina.patel@example.com')
    await user.type(within(dialog).getByLabelText(/Phone/), '555-4242')
    await user.type(within(dialog).getByLabelText(/Location/), 'Boston, MA')

    await user.click(within(dialog).getByLabelText(/Position/))
    await user.click(await screen.findByRole('option', { name: 'Backend Engineer' }))

    const experienceInput = within(dialog).getByLabelText(/Experience/)
    await user.clear(experienceInput)
    await user.type(experienceInput, '3')

    await user.click(within(dialog).getByRole('button', { name: 'Add Candidate' }))

    expect(await screen.findByText('Nina Patel')).toBeInTheDocument()
    expect(screen.getByText('nina.patel@example.com')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('shows an error alert when the API responds with a server error', async () => {
    server.use(
      http.get('/api/candidates', () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent(/failed to load candidates/i)
  })
})
