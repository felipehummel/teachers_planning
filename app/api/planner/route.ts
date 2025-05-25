import { streamTeacherPlanning } from "@/lib/llm_api";

export const runtime = 'edge';

export async function POST(req: Request) {
  const { message, files } = await req.json();

  const stream = streamTeacherPlanning(message, files);

  return new Response(stream);
}
