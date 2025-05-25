import { FileUploadIcon } from './Icons'

export function FileUpload({
  handleFileUpload,
}: {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
}) {
  return (
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-primary/30 border-dashed rounded-lg cursor-pointer bg-white hover:bg-primary/5">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <FileUploadIcon />
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
