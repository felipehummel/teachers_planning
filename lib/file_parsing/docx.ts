import mammoth from 'mammoth'

interface DOCXMetadata {
  title?: string
  author?: string
  subject?: string
  keywords?: string
  creationDate?: string
  modificationDate?: string
}

export type DOCXContent = {
  text: string
  info: DOCXMetadata
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

export async function extractTextFromDOCX(docxBuffer: Buffer): Promise<DOCXContent> {
  try {
    const result = await mammoth.extractRawText({ buffer: docxBuffer })
    const text = result.value

    return {
      text: cleanText(text),
      info: {
        title: undefined,
        author: undefined,
        subject: undefined,
        keywords: undefined,
        creationDate: undefined,
        modificationDate: undefined,
      },
    }
  } catch (error) {
    console.error('Error processing DOCX:', error)
    throw new Error(
      `Failed to process DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export async function extractTextFromDOCXFile(file: File): Promise<DOCXContent> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    return extractTextFromDOCX(buffer)
  } catch (error) {
    console.error('Error processing DOCX file:', error)
    throw new Error(
      `Failed to process DOCX file: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
