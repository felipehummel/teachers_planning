'use client'

import { fetchStreamedPlan, summarizeFile, type UploadedFile } from '@/lib/internal_api'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

function FileUpload({
  handleFileUpload,
}: {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
}) {
  return (
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-primary/30 border-dashed rounded-lg cursor-pointer bg-white hover:bg-primary/5">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-primary"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-foreground/70">
            <span className="font-semibold">Clique para fazer upload dos seus materiais</span> ou
            arraste e solte
          </p>
          <p className="text-xs text-foreground/60">
            PDF, DOCX, PPTX (múltiplos arquivos permitidos)
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.docx,.pptx"
          multiple
          onChange={handleFileUpload}
        />
      </label>
    </div>
  )
}

function UploadedFiles({
  uploadedFiles,
  setSelectedFile,
  removeFile,
}: {
  uploadedFiles: UploadedFile[]
  setSelectedFile: (file: UploadedFile) => void
  removeFile: (fileName: string) => void
}) {
  return (
    uploadedFiles.length > 0 && (
      <div className="mt-4 space-y-2">
        {uploadedFiles.map(file => (
          <div
            key={file.name}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
          >
            <div className="flex items-center space-x-3">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm text-foreground/70 truncate max-w-xs">{file.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              {file.isLoading ? (
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                </div>
              ) : file.hasError ? (
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedFile(file)}
                    className="p-1 text-primary hover:text-primary/80 focus:outline-none font-bold"
                    title="Ver resumo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeFile(file.name)}
                    className="p-1 text-red-500 hover:text-red-600 focus:outline-none font-bold"
                    title="Remover arquivo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  )
}
export default function PlannerPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [weeks, setWeeks] = useState(1)
  const [selectedDays, setSelectedDays] = useState<boolean[]>([
    false,
    true,
    true,
    true,
    true,
    true,
    false,
  ])

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const userMessage = input.trim()

    if (!userMessage) return

    setInput('')
    setIsLoading(true)

    const onComplete = () => setIsLoading(false)
    const onUpdate = (resultUntilNow: string) => setResult(resultUntilNow)

    const weekDaysCount = selectedDays.filter(day => day).length

    fetchStreamedPlan(uploadedFiles, userMessage, weekDaysCount, weeks, onComplete, onUpdate)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const toUploadFiles = Array.from(files)

    const newFiles = toUploadFiles.map(file => ({
      name: file.name,
      isLoading: true,
      hasError: false,
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])

    await Promise.all(
      toUploadFiles.map(async file => {
        const { summary, hasError } = await summarizeFile(file)
        if (hasError) {
          setUploadedFiles(prev =>
            prev.map(f =>
              f.name === file.name
                ? { ...f, summary: 'Erro ao processar o arquivo', isLoading: false, hasError: true }
                : f
            )
          )
        } else {
          setUploadedFiles(prev =>
            prev.map(f =>
              f.name === file.name ? { ...f, summary, isLoading: false, hasError: false } : f
            )
          )
        }
      })
    )
  }

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName))
  }

  const isUploadingFiles = uploadedFiles.some(file => file.isLoading)

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Planejador de Aulas</h1>
          <p className="text-foreground/70">Construa o seu plano de aula</p>
        </div>

        <div className="mb-8">
          <h3 className="block text-lg font-bold text-foreground mb-4">
            Faça upload dos seus materiais
          </h3>
          <FileUpload handleFileUpload={handleFileUpload} />

          <UploadedFiles
            uploadedFiles={uploadedFiles}
            setSelectedFile={setSelectedFile}
            removeFile={removeFile}
          />
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col space-y-4 mb-8">
            <h3 className="block text-lg font-bold text-foreground">
              Escolha a duração do seu plano de aula
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-primary/30">
              <label className="block text-sm font-medium text-foreground mb-2">
                <strong>Duração:</strong>{' '}
                <span className="text-foreground/80">{weeks} semana(s)</span>
              </label>
              <input
                type="range"
                min="1"
                max="28"
                value={weeks}
                onChange={e => setWeeks(parseInt(e.target.value))}
                className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-primary/30">
              <label className="block text-sm font-medium text-foreground mb-4">
                <strong>Selecione os dias da semana</strong>
              </label>
              <div className="flex justify-between">
                {weekDays.map((dia, index) => (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => {
                      const newDays = [...selectedDays]
                      newDays[index] = !newDays[index]
                      setSelectedDays(newDays)
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm text-sm font-bold ${
                      selectedDays[index]
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="block text-lg font-bold text-foreground">
              Como você quer seu plano de aula?
            </h3>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault()
                  handleSubmit(e as any)
                }
              }}
              placeholder="Ex: Plano de aula sobre fotossíntese para 6º ano..."
              rows={2}
              className="w-full p-4 rounded-lg border border-primary/30 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <button
              type="submit"
              disabled={isLoading || isUploadingFiles}
              className="px-6 py-3 bg-turquoise text-white rounded-lg hover:bg-turquoise-dark focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-colors duration-200 font-bold"
            >
              {isUploadingFiles
                ? 'Processando arquivos...'
                : isLoading
                ? 'Gerando...'
                : 'Gerar Plano'}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-100" />
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg p-6 shadow-lg prose max-w-none">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => {
                  const childrenText = props.children?.toString() || ''
                  const file = uploadedFiles.find(f => f.name === childrenText)

                  if (file) {
                    return (
                      <button
                        onClick={() => setSelectedFile(file)}
                        className="text-primary hover:text-primary/80 underline font-bold"
                      >
                        {props.children}
                      </button>
                    )
                  }
                  return <a {...props} />
                },
              }}
            >
              {result}
            </ReactMarkdown>
          </div>
        )}

        {selectedFile && (
          <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[0_0_30px_10px_rgba(0,0,0,0.1)] border border-primary/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Resumo: {selectedFile.name}
                </h2>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-foreground/50 hover:text-foreground/70 p-2 hover:bg-primary/5 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg prose max-w-none">
                <ReactMarkdown>{selectedFile.summary}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
