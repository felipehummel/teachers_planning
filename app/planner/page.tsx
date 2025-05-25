'use client'

import { fetchStreamedPlan, summarizeFile, type UploadedFile } from '../../lib/internal_api'
import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { FileUpload } from './components/FileUpload'
import { UploadedFiles } from './components/UploadedFiles'
import { Schedule } from './components/Schedule'
import { LoadingSpinner } from './components/LoadingSpinner'
import { CloseIcon } from './components/Icons'
import { ExportButton } from './components/ExportButton'

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
  const resultRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const userMessage = input.trim()

    if (!userMessage) return

    setInput('')
    setIsLoading(true)

    const onComplete = () => setIsLoading(false)
    const onUpdate = (resultUntilNow: string) => setResult(resultUntilNow)

    const weekDaysCount = selectedDays.filter(day => day).length

    const createPlanInput = {
      uploadedFiles,
      userMessage,
      weekDaysCount,
      weeks,
      lastGeneratedPlan: result,
    }

    fetchStreamedPlan(createPlanInput, onComplete, onUpdate)
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
  const isPlanUpdate = result !== ''

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
          <Schedule
            weeks={weeks}
            setWeeks={setWeeks}
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
          />
          <div className="flex flex-col space-y-4">
            <h3 className="block text-lg font-bold text-foreground">
              {isPlanUpdate
                ? 'Como você quer atualizar seu plano de aula?'
                : 'Como você quer seu plano de aula?'}
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
              placeholder={
                isPlanUpdate
                  ? 'Ex: Mova as aulas sobre fotossíntese para o final do plano...'
                  : 'Ex: Plano de aula sobre fotossíntese para 6º ano...'
              }
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
                : isPlanUpdate
                ? 'Atualizar Plano'
                : 'Criar Plano'}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="flex justify-center mb-8">
            <LoadingSpinner />
          </div>
        )}

        {result && (
          <>
            <div className="flex justify-end mb-4">
              <ExportButton contentRef={resultRef} disabled={isLoading} />
            </div>
            <div ref={resultRef} className="bg-white rounded-lg p-6 shadow-lg prose max-w-none">
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
          </>
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
                  <CloseIcon />
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
