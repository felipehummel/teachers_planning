import { streamTeacherPlanning } from '@/lib/llm_api'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { message, files, weekDaysCount, weeksCount, lastGeneratedPlan } = await req.json()

  const stream = streamTeacherPlanning(message, files, weekDaysCount, weeksCount, lastGeneratedPlan)

  return new Response(stream)
}
