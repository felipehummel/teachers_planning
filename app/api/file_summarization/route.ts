import { extractTextFromDOCXFile } from "@/lib/file_parsing/docx";
import { extractTextFromPDFFile } from "@/lib/file_parsing/pdf";
import { summarizeLessonText } from "@/lib/llm_api";

function isPDF(file: File) {
  return file.type === 'application/pdf'
}

function isDOCX(file: File) {
  return file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response('Arquivo não encontrado', { status: 400 });
    }

    let result: { text: string }
    if (isPDF(file)) {
      result = await extractTextFromPDFFile(file);
    } else if (isDOCX(file)) {
      result = await extractTextFromDOCXFile(file);
    } else {
      return new Response('Tipo de arquivo não suportado', { status: 400 });
    }

    const fileSummary = await summarizeLessonText(result.text);

    return Response.json({fileSummary});
  } catch (error) {
    console.error('Erro ao processar arquivo:', error);
    return new Response('Erro ao processar arquivo', { status: 500 });
  }
}
