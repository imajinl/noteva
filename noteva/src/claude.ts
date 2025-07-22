import Anthropic from '@anthropic-ai/sdk'

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

if (!apiKey) {
  console.warn('VITE_ANTHROPIC_API_KEY not found in environment variables')
}

const anthropic = new Anthropic({
  apiKey: apiKey || '',
  dangerouslyAllowBrowser: true
})

export interface ClaudeResponse {
  success: boolean
  content: string
  error?: string
}

export const improveText = async (text: string): Promise<ClaudeResponse> => {
  if (!apiKey) {
    return { success: false, content: '', error: 'API key not configured' }
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Improve this text by making it clearer, more concise, and better written while preserving the original meaning and intent. Return only the improved text without explanations:

${text}`
      }]
    })

    const content = response.content[0]
    if (content.type === 'text') {
      return { success: true, content: content.text.trim() }
    }
    
    return { success: false, content: '', error: 'Unexpected response format' }
  } catch (error) {
    console.error('Claude API error:', error)
    return { 
      success: false, 
      content: '', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export const expandText = async (text: string): Promise<ClaudeResponse> => {
  if (!apiKey) {
    return { success: false, content: '', error: 'API key not configured' }
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `Expand on this text by adding more detail, examples, and context while maintaining the same tone and style. Return only the expanded text without explanations:

${text}`
      }]
    })

    const content = response.content[0]
    if (content.type === 'text') {
      return { success: true, content: content.text.trim() }
    }
    
    return { success: false, content: '', error: 'Unexpected response format' }
  } catch (error) {
    console.error('Claude API error:', error)
    return { 
      success: false, 
      content: '', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export const summarizeText = async (text: string): Promise<ClaudeResponse> => {
  if (!apiKey) {
    return { success: false, content: '', error: 'API key not configured' }
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Summarize this text concisely, capturing the key points and main ideas. Return only the summary without explanations:

${text}`
      }]
    })

    const content = response.content[0]
    if (content.type === 'text') {
      return { success: true, content: content.text.trim() }
    }
    
    return { success: false, content: '', error: 'Unexpected response format' }
  } catch (error) {
    console.error('Claude API error:', error)
    return { 
      success: false, 
      content: '', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export const generateTodos = async (text: string): Promise<ClaudeResponse> => {
  if (!apiKey) {
    return { success: false, content: '', error: 'API key not configured' }
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Based on this text, generate a list of specific, actionable to-do items. Each item should be concrete and achievable. Return only the todo items, one per line, without numbers or bullet points:

${text}`
      }]
    })

    const content = response.content[0]
    if (content.type === 'text') {
      return { success: true, content: content.text.trim() }
    }
    
    return { success: false, content: '', error: 'Unexpected response format' }
  } catch (error) {
    console.error('Claude API error:', error)
    return { 
      success: false, 
      content: '', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export const brainstormIdeas = async (topic: string): Promise<ClaudeResponse> => {
  if (!apiKey) {
    return { success: false, content: '', error: 'API key not configured' }
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: `Brainstorm creative ideas and suggestions related to: ${topic}

Provide diverse, practical ideas that could spark further thinking. Return only the ideas without explanations.`
      }]
    })

    const content = response.content[0]
    if (content.type === 'text') {
      return { success: true, content: content.text.trim() }
    }
    
    return { success: false, content: '', error: 'Unexpected response format' }
  } catch (error) {
    console.error('Claude API error:', error)
    return { 
      success: false, 
      content: '', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
} 