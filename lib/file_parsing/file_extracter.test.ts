import { describe, expect, test, vi } from 'vitest'
import { extractTextFromFile } from './file_extracter'
import { extractTextFromPDFFile } from './pdf'
import { extractTextFromDOCXFile } from './docx'
import { extractTextFromPPTXFile } from './pptx'

global.File = class File {
  name: string
  type: string
  content: any[]
  constructor(content: any[], name: string, options: { type: string }) {
    this.content = content
    this.name = name
    this.type = options.type
  }
} as any

vi.mock('./pdf', () => ({
  extractTextFromPDFFile: vi.fn().mockResolvedValue({ text: 'PDF content' }),
}))

vi.mock('./docx', () => ({
  extractTextFromDOCXFile: vi.fn().mockResolvedValue({ text: 'DOCX content' }),
}))

vi.mock('./pptx', () => ({
  extractTextFromPPTXFile: vi.fn().mockResolvedValue({ text: 'PPTX content' }),
}))

describe('File Extracter', () => {
  test('should extract text from PDF file', async () => {
    const file = new File(['dummy pdf content'], 'test.pdf', { type: 'application/pdf' })
    const result = await extractTextFromFile(file)
    expect(result?.text).toBe('PDF content')
    expect(extractTextFromPDFFile).toHaveBeenCalledWith(file)
  })

  test('should extract text from DOCX file', async () => {
    const file = new File(['dummy docx content'], 'test.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    const result = await extractTextFromFile(file)
    expect(result?.text).toBe('DOCX content')
    expect(extractTextFromDOCXFile).toHaveBeenCalledWith(file)
  })

  test('should extract text from PPTX file', async () => {
    const file = new File(['dummy pptx content'], 'test.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    })
    const result = await extractTextFromFile(file)
    expect(result?.text).toBe('PPTX content')
    expect(extractTextFromPPTXFile).toHaveBeenCalledWith(file)
  })

  test('should return null for unsupported file type', async () => {
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' })
    const result = await extractTextFromFile(file)
    expect(result).toBeNull()
  })
})
