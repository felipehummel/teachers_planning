import { UploadedFile } from '@/lib/internal_api'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorIcon, EyeIcon, FileIcon, TrashIcon } from './Icons'

export function UploadedFiles({
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
              <FileIcon />
              <span className="text-sm text-foreground/70 truncate max-w-xs">{file.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              {file.isLoading ? (
                <div className="flex space-x-1">
                  <LoadingSpinner />
                </div>
              ) : file.hasError ? (
                <ErrorIcon />
              ) : (
                <>
                  <button
                    onClick={() => setSelectedFile(file)}
                    className="p-1 text-primary hover:text-primary/80 focus:outline-none font-bold"
                    title="Ver resumo"
                  >
                    <EyeIcon />
                  </button>
                  <button
                    onClick={() => removeFile(file.name)}
                    className="p-1 text-red-500 hover:text-red-600 focus:outline-none font-bold"
                    title="Remover arquivo"
                  >
                    <TrashIcon />
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
