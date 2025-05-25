import { streamTeacherPlanning } from '@/lib/llm_api'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { message, files, weekDaysCount, weeksCount } = await req.json()

  const stream = streamTeacherPlanning(message, files, weekDaysCount, weeksCount)

  return new Response(stream)
}
