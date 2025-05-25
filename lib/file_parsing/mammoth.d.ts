declare module 'mammoth' {
  interface ExtractResult {
    value: string;
    messages: any[];
  }

  interface Options {
    buffer: Buffer;
  }

  function extractRawText(options: Options): Promise<ExtractResult>;

  const mammoth: {
    extractRawText: typeof extractRawText;
  };

  export default mammoth;
}