This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, configure the OPENAI_API_KEY in your env or in your .env file. No database is needed

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To run tests:

`npm test`

## Notes on implementation

### LLM API interaction

- Chose the OpenAI API because I've already use it in the past and already had keys
- Chose to use Vercel's AI library to simplify streaming/generating but it actually didn't matter much
- All LLM calls are isolated in the `llm_api.ts` file, including prompts
- The previous decisions would help in case we want to change or use different LLMs
- We have two calls/use cases: (1) summarize this text coming from a document (pdf, slides, docx); (2) Given teacher's instructions, documents summaries and schedule information, create the lessons/sessions plan accordinly.
- The streaming of sessions/lessons is mostly abstracted away in the backend (`llm_api.ts` and `api/planner/route.ts`). In the frontend, we hide the details of how to continously parse the stream in `internal_api.ts`. Also, there's a missing error handling there: when generation/streaming fails we just put a generic error message in english instead of showing a proper error component.

### Material upload, schedule and planning

- As OpenAI doesn't accept all expected file formats, I decided to manually parse the pdf, docx and pptx files. Libraries for that were easily found. The drawback is that there's no OCR.
- All file parsing is isolated in the `file_parsing` folder with a file for each file type
- As soon as the file is uploaded we send the document to OpenAI for summarization and send the summarized content back to the frontend. That way we never need to store file information in a database.
- I decided to put a little :eye: icon in the uploaded file so the user can see the summarized content of the file. If I were to implement the file preview it would also be there.
- The schedule is chosen by the teacher through two components: a weeks slider (from 1 to 24 weeks) and a list of week days to choose from. I'm not entirely sure on the slider UI, but it felt better than a simple number textbox or a combobox with a huge list (1-24).
- I handcrafted the prompts for the planning part by trial and error. I had the privilege of having my wife as beta tester! :D She's a portuguese teacher and handed me a couple of files to test. She also test the whole flow on her own without me helping/nudging.

## Bonus

- There's a button to export to PDF
- After the first plan generation the following ones will reuse the generated one as a base for the next instructions. Some text in the UI changes to indicate that.
