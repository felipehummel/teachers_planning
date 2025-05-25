import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UploadedFiles } from './UploadedFiles'
import { UploadedFile } from '@/lib/internal_api'

describe('UploadedFiles', () => {
  const mockSetSelectedFile = vi.fn()
  const mockRemoveFile = vi.fn()

  const mockFiles: UploadedFile[] = [
    {
      name: 'file1.pdf',
      isLoading: false,
      hasError: false,
    },
    {
      name: 'file2.pdf',
      isLoading: true,
      hasError: false,
    },
    {
      name: 'file3.pdf',
      isLoading: false,
      hasError: true,
    },
  ]

  it('renders nothing when there are no files', () => {
    const { container } = render(
      <UploadedFiles
        uploadedFiles={[]}
        setSelectedFile={mockSetSelectedFile}
        removeFile={mockRemoveFile}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the file list correctly', () => {
    render(
      <UploadedFiles
        uploadedFiles={mockFiles}
        setSelectedFile={mockSetSelectedFile}
        removeFile={mockRemoveFile}
      />
    )

    mockFiles.forEach(file => {
      expect(screen.getByText(file.name)).toBeInTheDocument()
    })
  })

  it('shows loading spinner when file is loading', () => {
    render(
      <UploadedFiles
        uploadedFiles={mockFiles}
        setSelectedFile={mockSetSelectedFile}
        removeFile={mockRemoveFile}
      />
    )

    const loadingFile = mockFiles.find(f => f.isLoading)
    expect(screen.getByText(loadingFile!.name)).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('calls setSelectedFile when clicking the view button', () => {
    render(
      <UploadedFiles
        uploadedFiles={mockFiles}
        setSelectedFile={mockSetSelectedFile}
        removeFile={mockRemoveFile}
      />
    )

    const viewButton = screen.getAllByTitle('Ver resumo')[0]
    fireEvent.click(viewButton)

    expect(mockSetSelectedFile).toHaveBeenCalledWith(mockFiles[0])
  })

  it('calls removeFile when clicking the remove button', () => {
    render(
      <UploadedFiles
        uploadedFiles={mockFiles}
        setSelectedFile={mockSetSelectedFile}
        removeFile={mockRemoveFile}
      />
    )

    const removeButton = screen.getAllByTitle('Remover arquivo')[0]
    fireEvent.click(removeButton)

    expect(mockRemoveFile).toHaveBeenCalledWith(mockFiles[0].name)
  })
})
