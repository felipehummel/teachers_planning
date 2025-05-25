import { streamTeacherPlanning } from "@/lib/llm_api";

export const runtime = 'edge';

export async function POST(req: Request) {
  const { message } = await req.json();

  const stream = streamTeacherPlanning(message);

  return new Response(stream);
}
