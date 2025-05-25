import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchStreamedPlan, summarizeFile, type CreatePlanInput } from './internal_api'

describe('internal_api', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    global.fetch = vi.fn()
    global.TextDecoder = vi.fn().mockImplementation(() => ({
      decode: vi.fn().mockReturnValue('some chunk'),
    }))
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
  })

  describe('fetchStreamedPlan', () => {
    const mockInput: CreatePlanInput = {
      uploadedFiles: [
        { name: 'file1.txt', summary: 'summary1', isLoading: false, hasError: false },
        { name: 'file2.txt', summary: 'summary2', isLoading: false, hasError: false },
        { name: 'file3.txt', isLoading: false, hasError: true },
      ],
      userMessage: 'test message',
      weekDaysCount: 5,
      weeks: 2,
    }

    it('should filter files with errors and call the API correctly', async () => {
      const mockReader = {
        read: vi
          .fn()
          .mockResolvedValueOnce({ done: false, value: new Uint8Array([1]) })
          .mockResolvedValueOnce({ done: true }),
      }

      const mockResponse = {
        ok: true,
        body: { getReader: () => mockReader },
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const onComplete = vi.fn()
      const onUpdate = vi.fn()

      await fetchStreamedPlan(mockInput, onComplete, onUpdate)

      expect(global.fetch).toHaveBeenCalledWith('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'test message',
          files: [
            { name: 'file1.txt', summary: 'summary1' },
            { name: 'file2.txt', summary: 'summary2' },
          ],
          weekDaysCount: 5,
          weeksCount: 2,
        }),
      })

      expect(onComplete).toHaveBeenCalled()
      expect(onUpdate).toHaveBeenCalledWith('')
      expect(onUpdate).toHaveBeenCalledWith('some chunk')
    })

    it('should handle API errors', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Internal Server Error',
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const onComplete = vi.fn()
      const onUpdate = vi.fn()

      await fetchStreamedPlan(mockInput, onComplete, onUpdate)

      expect(onUpdate).toHaveBeenCalledWith('Sorry, there was an error processing your request.')
      expect(onComplete).toHaveBeenCalled()
    })
  })

  describe('summarizeFile', () => {
    it('should process the file successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ fileSummary: 'test summary' }),
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
      const formData = new FormData()
      formData.append('file', mockFile)
      const result = await summarizeFile(mockFile)

      expect(global.fetch).toHaveBeenCalledWith('/api/file_summarization', {
        method: 'POST',
        body: formData,
      })

      expect(result).toEqual({
        summary: 'test summary',
        hasError: false,
      })
    })

    it('should handle file processing errors', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Bad Request',
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
      const formData = new FormData()
      formData.append('file', mockFile)
      const result = await summarizeFile(mockFile)

      expect(global.fetch).toHaveBeenCalledWith('/api/file_summarization', {
        method: 'POST',
        body: formData,
      })

      expect(result).toEqual({
        summary: '',
        hasError: true,
      })
    })
  })
})
