import { createOpenAI } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'

function lessonPlanningSystemPrompt(
  request: string,
  weekDaysCount: number,
  weeksCount: number,
  files: { name: string; summary: string }[],
  lastGeneratedPlan: string
) {
  const lastGeneratedPlanPrompt =
    lastGeneratedPlan !== ''
      ? `
  This is the last generated plan. Consider it as a base for the new plan and change it according to the user request:
  ${lastGeneratedPlan}
  `
      : ''

  return `
You are a teacher's assistant that will help they plan sessions for the classes they'll have for a given subject
The plan should be written in the given language and using markdown
Output ONLY the plan, no extra text before or after.
DO NOT wrap the markdown in a code block (i.e. do not use \`\`\`markdown).
DO NOT use tables.

The teacher said the plan MUST last for ${weeksCount} weeks, with ${weekDaysCount} days per week.
The number of lessons/sessions MUST ALIGN WITH THIS DIRECTIVE.

These are the files that the teacher uploaded. Use them to help you plan the lessons.
For each lesson plan, you can use none of the files or multiple files.
USE ONLY THE FILES THAT ARE MENTIONED IN THE REQUEST.
When you cite a file put a link with the file name as the link's text. For example, if the filename is "Apostila 1 - unidade 2.pdf", the link should be "[Apostila 1 - unidade 2.pdf](file://Apostila 1 - unidade 2.pdf)"
If you want to put a page/slide number along the file link put it OUTSIDE the link. For example, if the filename is "Apostila 1 - unidade 2.pdf" and the page number is 10, the link should be "[Apostila 1 - unidade 2.pdf](file://Apostila 1 - unidade 2.pdf) Pag. 10"
If the teacher doesn't provide a request, use the files to plan the lessons:
${files.map(file => `- ${file.name}: ${file.summary}`).join('\n')}

${lastGeneratedPlanPrompt}

This is the request from the teacher:
${request}
`
}

function lessonFileSummarySystemPrompt(request: string) {
  return `
Summarize the file content bellow in a way that will help a teacher understand what content is in the file.
The summary should be in the same language as the file content.
DO NOT wrap the markdown in a code block (i.e. do not use \`\`\`markdown).

Always start with a general summary of the file content.

Then, divide the file content into sub-topics.

For slides, you can use the slide number to identify the content of the slide. List a group of slides and summarizes what they talk about
For documents, do the same thing by grouping similar parts of the content in sub-topics of the document.
Despite being slides, never call things "slides" always call these sections/parts as "pages"!

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
  weeksCount: number,
  lastGeneratedPlan: string
) {
  const response = streamText({
    model: openai('gpt-4.1-mini'),
    prompt: lessonPlanningSystemPrompt(
      request,
      weekDaysCount,
      weeksCount,
      files,
      lastGeneratedPlan
    ),
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
