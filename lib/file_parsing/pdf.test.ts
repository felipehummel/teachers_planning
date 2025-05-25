import { describe, expect, test } from 'vitest'
import fs from 'fs'
import path from 'path'
import { extractTextFromPDF } from './pdf'

describe('PDF Parser', () => {
  const fixturesPath = path.join(__dirname, '__fixtures__')

  test('should extract text from a PDF file', async () => {
    const pdfBuffer = fs.readFileSync(path.join(fixturesPath, 'sample.pdf'))
    const result = await extractTextFromPDF(pdfBuffer)

    expect(result.text).toEqual('Testing extraction of PDF document')
    expect(result.numPages).toEqual(1)
  })

  test('should fail when processing an invalid file', async () => {
    const invalidBuffer = Buffer.from('invalid pdf content')
    await expect(extractTextFromPDF(invalidBuffer)).rejects.toThrow('Failed to process PDF')
  })
})
