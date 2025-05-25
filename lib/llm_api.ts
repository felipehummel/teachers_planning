import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

function systemPrompt(request: string) {
  return `
You are a teacher's assistant that will help they plan sessions for the classes they'll have for a given subject
The plan should be written in the given language and using markdown
Output ONLY the plan, no extra text before or after.

This is the request from the teacher:
${request}
`
}

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  compatibility: 'strict',
});

export function streamTeacherPlanning(request: string) {
  const response = streamText({
    model: openai('gpt-4.1-mini'),
    prompt: systemPrompt(request),
  });
  return response.textStream;
}