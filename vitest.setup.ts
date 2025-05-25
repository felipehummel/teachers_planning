import { vi } from 'vitest'

// Mock do process.env
process.env = {
  ...process.env,
  OPENAI_API_KEY: 'test-key',
}
