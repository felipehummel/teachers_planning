import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from 'pdfjs-dist';

const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PDFMetadata {
  Title?: string;
  Author?: string;
  Subject?: string;
  Keywords?: string;
  CreationDate?: string;
  ModDate?: string;
}

export interface PDFContent {
  text: string;
  numPages: number;
  info: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creationDate?: string;
    modificationDate?: string;
  };
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<PDFContent> {
  try {
    const uint8Array = new Uint8Array(pdfBuffer);

    const loadingTask = getDocument({
      data: uint8Array,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
    });

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    let fullText = '';

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }

    const metadata = await pdf.getMetadata();
    const info = metadata?.info as PDFMetadata;

    return {
      text: cleanText(fullText),
      numPages,
      info: {
        title: info?.Title,
        author: info?.Author,
        subject: info?.Subject,
        keywords: info?.Keywords,
        creationDate: info?.CreationDate,
        modificationDate: info?.ModDate,
      },
    };
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function extractTextFromPDFFile(file: File): Promise<PDFContent> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return extractTextFromPDF(buffer);
  } catch (error) {
    console.error('Error processing PDF file:', error);
    throw new Error(`Failed to process PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}