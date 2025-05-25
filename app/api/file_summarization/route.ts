import { extractTextFromPDFFile } from "@/lib/file_parsing/pdf";
import { summarizeLessonText } from "@/lib/llm_api";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response('Arquivo não encontrado', { status: 400 });
    }

    const result = await extractTextFromPDFFile(file);

    const fileSummary = await summarizeLessonText(result.text);

    return Response.json({fileSummary});
  } catch (error) {
    console.error('Erro ao processar arquivo:', error);
    return new Response('Erro ao processar arquivo', { status: 500 });
  }
}
