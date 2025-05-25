import * as unzipper from 'unzipper';
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXml = promisify(parseString);

type PPTXMetadata = {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creationDate?: string;
  modificationDate?: string;
}

export type PPTXContent = {
  text: string;
  slides: string[];
  numSlides: number;
  info: PPTXMetadata;
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

async function extractTextFromSlideXml(slideXml: string): Promise<string[]> {
  try {
    const parsed = await parseXml(slideXml);
    const textElements: string[] = [];

    function findTextElements(obj: unknown) {
      if (!obj || typeof obj !== 'object') return;

      if (Array.isArray(obj)) {
        obj.forEach(item => findTextElements(item));
        return;
      }

      // 'a:t' is the elements that have the real text of the slide
      const element = obj as Record<string, unknown>;
      if ('a:t' in element) {
        const text = element['a:t'];
        if (Array.isArray(text)) {
          text.forEach(t => {
            if (typeof t === 'string' && t.trim()) {
              textElements.push(t.trim());
            }
          });
        }
      }

      Object.values(element).forEach(value => findTextElements(value));
    }

    findTextElements(parsed);
    return textElements;
  } catch (error) {
    console.error('Error parsing slide XML:', error);
    return [];
  }
}

export async function extractTextFromPPTX(pptxBuffer: Buffer): Promise<PPTXContent> {
  try {
    const directory = await unzipper.Open.buffer(pptxBuffer);
    const slideFiles = directory.files.filter((f: unzipper.File) =>
      f.path.startsWith('ppt/slides/slide') && f.path.endsWith('.xml')
    ).sort((a, b) => {
      // assume the slides are slide1.xml, slide2.xml, etc
      const numA = parseInt(a.path.match(/slide(\d+)\.xml/)?.[1] || '0');
      const numB = parseInt(b.path.match(/slide(\d+)\.xml/)?.[1] || '0');
      return numA - numB;
    });

    const slides = await Promise.all(
      slideFiles.map(async (file: unzipper.File) => {
        const content = await file.buffer();
        const textElements = await extractTextFromSlideXml(content.toString());
        return textElements.join('\n');
      })
    );

    const allText =
      slides.map((slide, index) => `Slide #${index + 1}\n${slide}`).join('\n\n');
    console.log(allText);

    return {
      text: cleanText(allText),
      slides: slides,
      numSlides: slideFiles.length,
      info: {
        title: undefined,
        author: undefined,
        subject: undefined,
        keywords: undefined,
        creationDate: undefined,
        modificationDate: undefined,
      },
    };
  } catch (error) {
    console.error('Error processing PPTX:', error);
    throw new Error(`Failed to process PPTX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function extractTextFromPPTXFile(file: File): Promise<PPTXContent> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return extractTextFromPPTX(buffer);
  } catch (error) {
    console.error('Error processing PPTX file:', error);
    throw new Error(`Failed to process PPTX file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}