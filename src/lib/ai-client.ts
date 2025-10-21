/**
 * Unified AI Client
 * Supports both OpenAI and Groq APIs
 */

import OpenAI from 'openai'

const AI_PROVIDER = process.env.AI_PROVIDER || 'groq'
const GROQ_API_KEY = process.env.GROQ_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// Initialize client based on provider
export const aiClient = new OpenAI({
  apiKey: AI_PROVIDER === 'groq' ? GROQ_API_KEY : OPENAI_API_KEY,
  baseURL: AI_PROVIDER === 'groq' ? 'https://api.groq.com/openai/v1' : undefined,
})

// Get appropriate model based on provider
export function getAIModel(type: 'fast' | 'smart' = 'smart'): string {
  if (AI_PROVIDER === 'groq') {
    // Groq models - much faster!
    return type === 'fast' 
      ? 'llama-3.1-8b-instant'  // Fastest
      : 'llama-3.3-70b-versatile' // Best quality
  } else {
    // OpenAI models
    return type === 'fast'
      ? 'gpt-3.5-turbo'
      : 'gpt-4'
  }
}

// Check if AI is available
export function isAIAvailable(): boolean {
  if (AI_PROVIDER === 'groq') {
    return !!GROQ_API_KEY && GROQ_API_KEY !== ''
  }
  return !!OPENAI_API_KEY && OPENAI_API_KEY !== '' && OPENAI_API_KEY !== 'sk-proj-placeholder-key-for-demo'
}

// Get provider name for logging
export function getProviderName(): string {
  return AI_PROVIDER === 'groq' ? 'Groq' : 'OpenAI'
}


