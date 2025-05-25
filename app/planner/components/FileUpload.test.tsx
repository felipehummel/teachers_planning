import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { FileUpload } from './FileUpload'

describe('FileUpload', () => {
  const mockHandleFileUpload = vi.fn()

  beforeEach(() => {
    mockHandleFileUpload.mockClear()
  })

  it('renders upload area with correct text', () => {
    render(<FileUpload handleFileUpload={mockHandleFileUpload} />)

    expect(screen.getByText(/Clique para fazer upload dos seus materiais/i)).toBeInTheDocument()
    expect(screen.getByText(/PDF, DOCX, PPTX/i)).toBeInTheDocument()
  })

  it('handles file upload when files are selected', () => {
    render(<FileUpload handleFileUpload={mockHandleFileUpload} />)

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/Clique para fazer upload dos seus materiais/i)

    fireEvent.change(input, { target: { files: [file] } })

    expect(mockHandleFileUpload).toHaveBeenCalled()
  })

  it('accepts multiple files', () => {
    render(<FileUpload handleFileUpload={mockHandleFileUpload} />)

    const input = screen.getByLabelText(/Clique para fazer upload dos seus materiais/i)
    expect(input).toHaveAttribute('multiple')
  })

  it('accepts only pdf, docx and pptx files', () => {
    render(<FileUpload handleFileUpload={mockHandleFileUpload} />)

    const input = screen.getByLabelText(/Clique para fazer upload dos seus materiais/i)
    expect(input).toHaveAttribute('accept', '.pdf,.docx,.pptx')
  })
})
