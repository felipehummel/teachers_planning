import { describe, it, expect, vi, beforeEach } from 'vitest'
import { streamTeacherPlanning, summarizeLessonText } from './llm_api'
import { generateText, streamText } from 'ai'

vi.mock('ai', () => ({
  generateText: vi.fn(),
  streamText: vi.fn(),
}))

vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: () => () => 'mocked-model',
}))

describe('llm_api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('streamTeacherPlanning', () => {
    it('should call streamText with the correct prompt', () => {
      const mockTextStream = {
        textStream: 'mock stream',
      }

      vi.mocked(streamText).mockReturnValue(mockTextStream as any)

      const files = [
        { name: 'file1.pdf', summary: 'summary1' },
        { name: 'file2.pdf', summary: 'summary2' },
      ]
      const request = 'test request'
      const weekDaysCount = 3
      const weeksCount = 2

      const result = streamTeacherPlanning(request, files, weekDaysCount, weeksCount)

      expect(streamText).toHaveBeenCalledWith({
        model: 'mocked-model',
        prompt:
          expect.stringContaining('2 weeks') &&
          expect.stringContaining('3 days per week') &&
          expect.stringContaining('file1.pdf') &&
          expect.stringContaining('summary1') &&
          expect.stringContaining('file2.pdf') &&
          expect.stringContaining('summary2') &&
          expect.stringContaining('test request'),
      })
      expect(result).toBe(mockTextStream.textStream)
    })
  })

  describe('summarizeLessonText', () => {
    it('should call generateText with the correct prompt', async () => {
      const mockResponse = {
        text: 'mock summary',
      }

      vi.mocked(generateText).mockResolvedValue(mockResponse as any)

      const text = 'test content'
      const result = await summarizeLessonText(text)

      expect(generateText).toHaveBeenCalledWith({
        model: 'mocked-model',
        prompt: expect.stringContaining('test content'),
      })
      expect(result).toBe(mockResponse.text)
    })
  })
})
