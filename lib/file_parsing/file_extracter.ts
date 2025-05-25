import { extractTextFromDOCXFile } from './docx'
import { extractTextFromPDFFile } from './pdf'
import { extractTextFromPPTXFile } from './pptx'

function isPDF(file: File) {
  return file.type === 'application/pdf'
}

function isDOCX(file: File) {
  return file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

function isPPTX(file: File) {
  return file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
}

type ExtractedContent = {
  text: string
}

export async function extractTextFromFile(file: File): Promise<ExtractedContent | null> {
  if (isPDF(file)) {
    return await extractTextFromPDFFile(file)
  } else if (isDOCX(file)) {
    return await extractTextFromDOCXFile(file)
  } else if (isPPTX(file)) {
    return await extractTextFromPPTXFile(file)
  }

  return null
}
