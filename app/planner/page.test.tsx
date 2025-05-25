import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PlannerPage from './page'
import { fetchStreamedPlan, summarizeFile } from '../../lib/internal_api'

vi.mock('../../lib/internal_api', () => ({
  fetchStreamedPlan: vi.fn(),
  summarizeFile: vi.fn(),
}))

describe('PlannerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render main components', () => {
    render(<PlannerPage />)

    expect(screen.getByText('Planejador de Aulas')).toBeDefined()
    expect(screen.getByText('Faça upload dos seus materiais')).toBeDefined()
    expect(screen.getByText('Como você quer seu plano de aula?')).toBeDefined()
    expect(screen.getByPlaceholderText(/Plano de aula sobre fotossíntese/)).toBeDefined()
  })

  it('should handle file upload', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })

    vi.mocked(summarizeFile).mockResolvedValueOnce({
      summary: 'Test summary',
      hasError: false,
    })

    render(<PlannerPage />)

    const input = screen
      .getByText('Clique para fazer upload dos seus materiais')
      .closest('label')
      ?.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [mockFile] } })

    await waitFor(() => {
      expect(summarizeFile).toHaveBeenCalledWith(mockFile)
      expect(screen.getByText('test.pdf')).toBeDefined()
    })
  })

  it('should handle form submission', async () => {
    render(<PlannerPage />)

    const textarea = screen.getByPlaceholderText(/Plano de aula sobre fotossíntese/)
    const submitButton = screen.getByText('Criar Plano')

    fireEvent.change(textarea, { target: { value: 'Test input' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(fetchStreamedPlan).toHaveBeenCalledWith(
        expect.objectContaining({
          userMessage: 'Test input',
          uploadedFiles: [],
          weekDaysCount: 5,
          weeks: 1,
        }),
        expect.any(Function),
        expect.any(Function)
      )
    })
  })

  it('should handle file upload error', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })

    vi.mocked(summarizeFile).mockResolvedValueOnce({
      summary: '',
      hasError: true,
    })

    render(<PlannerPage />)

    const input = screen
      .getByText('Clique para fazer upload dos seus materiais')
      .closest('label')
      ?.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [mockFile] } })

    await waitFor(() => {
      const errorIcon = screen
        .getByText('test.pdf')
        .closest('div')
        ?.parentElement?.querySelector('.text-red-500')
      expect(errorIcon).toBeDefined()
    })
  })

  it('should update selected days', () => {
    render(<PlannerPage />)

    const sundayButton = screen.getByText('Dom')
    fireEvent.click(sundayButton)

    expect(sundayButton).toHaveClass('bg-primary')
  })

  it('should update weeks count', () => {
    render(<PlannerPage />)

    const weeksInput = screen.getByRole('slider')
    fireEvent.change(weeksInput, { target: { value: '2' } })

    expect(screen.getByText('2 semanas')).toBeDefined()
  })
})
