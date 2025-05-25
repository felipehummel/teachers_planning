import { createOpenAI } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'

function lessonPlanningSystemPrompt(
  request: string,
  weekDaysCount: number,
  weeksCount: number,
  files: { name: string; summary: string }[]
) {
  return `
You are a teacher's assistant that will help they plan sessions for the classes they'll have for a given subject
The plan should be written in the given language and using markdown
Output ONLY the plan, no extra text before or after.

The teacher said the plan MUST last for ${weeksCount} weeks, with ${weekDaysCount} days per week.
The number of lessons/sessions MUST ALIGN WITH THIS DIRECTIVE.

These are the files that the teacher uploaded. Use them to help you plan the lessons.
For each lesson plan, you can use none of the files or multiple files.
When you cite a file, put a link to it in the format [file name](file://file_name).
If the teacher doesn't provide a request, use the files to plan the lessons:
${files.map(file => `- ${file.name}: ${file.summary}`).join('\n')}

This is the request from the teacher:
${request}
`
}

function lessonFileSummarySystemPrompt(request: string) {
  return `
Summarize the file content bellow in a way that will help a teacher understand what content is in the file.

The summary should be in the same language as the file content.

Output ONLY the summary, no extra text before or after.

This is the file content:
${request}
`
}

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  compatibility: 'strict',
})

export function streamTeacherPlanning(
  request: string,
  files: { name: string; summary: string }[],
  weekDaysCount: number,
  weeksCount: number
) {
  const response = streamText({
    model: openai('gpt-4.1-mini'),
    prompt: lessonPlanningSystemPrompt(request, weekDaysCount, weeksCount, files),
  })
  return response.textStream
}

export async function summarizeLessonText(text: string) {
  const response = await generateText({
    model: openai('gpt-4.1-mini'),
    prompt: lessonFileSummarySystemPrompt(text),
  })
  return response.text
}
