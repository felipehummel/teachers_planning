import { describe, expect, test } from 'vitest'
import fs from 'fs'
import path from 'path'
import { extractTextFromDOCX } from './docx'

describe('DOCX Parser', () => {
  const fixturesPath = path.join(__dirname, '__fixtures__')

  test('should extract text from a DOCX file', async () => {
    const docxBuffer = fs.readFileSync(path.join(fixturesPath, 'sample.docx'))
    const result = await extractTextFromDOCX(docxBuffer)

    expect(result.text).toEqual('Testing extraction of docx document')
  })

  test('should fail when processing an invalid file', async () => {
    const invalidBuffer = Buffer.from('invalid docx content')
    await expect(extractTextFromDOCX(invalidBuffer)).rejects.toThrow('Failed to process DOCX')
  })
})
