import { describe, expect, test } from 'vitest'
import fs from 'fs'
import path from 'path'
import { extractTextFromPPTX } from './pptx'

describe('PPTX Parser', () => {
  const fixturesPath = path.join(__dirname, '__fixtures__')

  test('should extract text from a PPTX file', async () => {
    const pptxBuffer = fs.readFileSync(path.join(fixturesPath, 'sample.pptx'))
    const result = await extractTextFromPPTX(pptxBuffer)

    expect(result.text).toEqual(
      'Slide #1 Testing extraction of PPTX document Slide #2 Another slide'
    )
    expect(result.slides).toEqual(['Testing extraction of PPTX document', 'Another slide'])
    expect(result.numSlides).toEqual(2)
  })

  test('should fail when processing an invalid file', async () => {
    const invalidBuffer = Buffer.from('invalid pptx content')
    await expect(extractTextFromPPTX(invalidBuffer)).rejects.toThrow('Failed to process PPTX')
  })
})
