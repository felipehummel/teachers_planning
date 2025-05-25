export type UploadedFile = {
  name: string
  summary?: string
  isLoading: boolean
  hasError: boolean
}

export type CreatePlanInput = {
  uploadedFiles: UploadedFile[]
  userMessage: string
  weekDaysCount: number
  weeks: number
}

export async function fetchStreamedPlan(
  { uploadedFiles, userMessage, weekDaysCount, weeks }: CreatePlanInput,
  onComplete: () => void,
  onUpdate: (resultUntilNow: string) => void
) {
  try {
    const files = uploadedFiles
      .filter(file => file.summary && !file.hasError)
      .map(file => ({
        name: file.name,
        summary: file.summary,
      }))

    const response = await fetch('/api/planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, files, weekDaysCount, weeksCount: weeks }),
    })

    if (!response.ok) throw new Error(`API response error: ${response.statusText}`)

    const reader = response.body?.getReader()
    if (!reader) throw new Error('Could not read response stream')

    let assistantMessage = ''
    onUpdate('')

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const text = new TextDecoder().decode(value)
      assistantMessage += text
      onUpdate(assistantMessage)
    }
  } catch (error) {
    console.error('Error sending message:', error)
    // hardcoding error message for now. Should be a proper boolean error variable
    onUpdate('Sorry, there was an error processing your request.')
  } finally {
    onComplete()
  }
}

export async function summarizeFile(file: File): Promise<{ summary: string; hasError: boolean }> {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('/api/file_summarization', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Error processing file: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      summary: data.fileSummary,
      hasError: false,
    }
  } catch (error) {
    console.error('Erro:', error)
    return {
      summary: '',
      hasError: true,
    }
  }
}
