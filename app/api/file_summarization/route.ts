import { extractTextFromDOCXFile } from '@/lib/file_parsing/docx'
import { extractTextFromFile } from '@/lib/file_parsing/file_extracter'
import { extractTextFromPDFFile } from '@/lib/file_parsing/pdf'
import { extractTextFromPPTXFile } from '@/lib/file_parsing/pptx'
import { summarizeLessonText } from '@/lib/llm_api'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response('Arquivo não encontrado', { status: 400 })
    }

    const result = await extractTextFromFile(file)
    if (!result) {
      return new Response('Tipo de arquivo não suportado', { status: 400 })
    }

    const fileSummary = await summarizeLessonText(result.text)

    return Response.json({ fileSummary })
  } catch (error) {
    console.error('Erro ao processar arquivo:', error)
    return new Response('Erro ao processar arquivo', { status: 500 })
  }
}
