'use client'

import { DownloadIcon } from './Icons'

export function ExportButton({
  contentRef,
  disabled,
}: {
  contentRef: React.RefObject<HTMLDivElement | null>
  disabled: boolean
}) {
  const handleExport = async () => {
    if (!contentRef.current) return

    const element = contentRef.current
    const opt = {
      margin: [10, 10],
      filename: 'plano-de-aula.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'mm',
        format: [297, 420], // A3
        orientation: 'portrait',
        putOnlyUsedFonts: true,
        floatPrecision: 16,
      },
      pagebreak: { mode: ['avoid-all'] },
    }

    const html2pdf = (await import('html2pdf.js')).default
    html2pdf().set(opt).from(element).save()
  }

  return disabled ? null : (
    <button
      onClick={handleExport}
      disabled={disabled}
      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200 font-bold flex items-center space-x-2"
    >
      <DownloadIcon />
      <span>Exportar PDF</span>
    </button>
  )
}
