import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { setupServer } from 'msw/node'
import { http, HttpResponse, delay } from 'msw'
import theme from '@repo/ui/theme'
import { handlers } from '../../../mocks/handlers'
import CandidateDetailPage from './CandidateDetailPage.component'

// Only config.ts is stubbed — the real axiosClient/candidatesApi/candidateQueries
// chain runs, with MSW intercepting the actual HTTP calls at the network layer.
jest.mock('@repo/api-client/config', () => ({ API_BASE_URL: '/api' }))

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderPage(id: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 0 } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider theme={theme} defaultColorScheme="light">
        <CssBaseline />
        <MemoryRouter initialEntries={[`/candidates/${id}`]}>
          <Routes>
            <Route path="/candidates/:id" element={<CandidateDetailPage />} />
          </Routes>
        </MemoryRouter>
      </CssVarsProvider>
    </QueryClientProvider>,
  )
}

describe('CandidateDetailPage — status mutation (optimistic)', () => {
  // Candidate id 1 (Ava Johnson) is seeded with status "applied" — next stages
  // offered are "Move to Screening" and "Reject".
  it('updates the status chip immediately, before the request resolves', async () => {
    server.use(
      http.patch('/api/candidates/:id/status', async ({ request }) => {
        await delay(100)
        const { status } = (await request.json()) as { status: string }
        return HttpResponse.json({ id: 1, status })
      }),
    )

    const user = userEvent.setup()
    renderPage('1')

    await screen.findByText('Ava Johnson')
    expect(screen.getByText('Applied', { selector: '.MuiChip-label' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Move to Screening' }))

    // No waitFor — this must already be true before the delayed response settles.
    expect(screen.getByText('Screening', { selector: '.MuiChip-label' })).toBeInTheDocument()
  })

  it('rolls back to the previous status when the request fails', async () => {
    server.use(
      http.patch('/api/candidates/:id/status', () => HttpResponse.json({ message: 'Server error' }, { status: 500 })),
    )

    const user = userEvent.setup()
    renderPage('1')

    await screen.findByText('Ava Johnson')
    expect(screen.getByText('Applied', { selector: '.MuiChip-label' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Move to Screening' }))

    // The mocked failure resolves synchronously, so by the time the click settles the
    // mutation may already be rolled back — what matters is the end state, not the
    // transient optimistic frame (covered by the delayed-response test above).
    expect(await screen.findByText('Applied', { selector: '.MuiChip-label' })).toBeInTheDocument()
    expect(screen.queryByText('Screening', { selector: '.MuiChip-label' })).not.toBeInTheDocument()
  })
})

describe('CandidateDetailPage — status history', () => {
  // Runs against the real (un-overridden) handlers, so both the status PATCH
  // and the status-history GET it triggers a refetch of are exercised for real.
  it('shows the new transition after a real status change, without a manual reload', async () => {
    const user = userEvent.setup()
    renderPage('1')

    await screen.findByText('Ava Johnson')
    expect(screen.getByText(/no status changes yet/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Move to Screening' }))

    // Once the history entry lands, the header's own status chip has already
    // rolled forward to "Screening" — so "Applied" (chip-label only, not the
    // unrelated "Applied" field label) can only be the entry's fromStatus chip,
    // and "Screening" now matches twice: the header chip and the entry's toStatus chip.
    await screen.findByText('Applied', { selector: '.MuiChip-label' })
    expect(screen.getAllByText('Screening', { selector: '.MuiChip-label' })).toHaveLength(2)
    expect(screen.queryByText(/no status changes yet/i)).not.toBeInTheDocument()
  })
})
