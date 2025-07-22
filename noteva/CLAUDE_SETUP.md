# Claude AI Integration Setup

## Prerequisites
1. Get your Claude API key from [console.anthropic.com](https://console.anthropic.com)
2. Make sure you have credits/billing set up

## Setup Steps

1. **Create environment file**:
   ```bash
   # In the noteva/ directory, create .env file:
   echo "VITE_ANTHROPIC_API_KEY=your_actual_api_key_here" > .env
   ```

2. **Replace with your actual API key**:
   Edit `.env` and replace `your_actual_api_key_here` with your real API key from Anthropic.

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## Features Available

### 🤖 AI Toolbar Button
- Click the robot icon (🤖) in the top toolbar
- Access all AI features from the popup menu

### ✨ Text Selection AI
- Select any text in the note editor
- Use the ✨ and 📝 buttons in the formatting popup for quick AI operations

### AI Operations
- **✨ Improve Text**: Make text clearer and better written
- **📝 Expand Text**: Add more detail and context
- **📋 Summarize**: Create concise summaries
- **✅ Generate Todos**: Convert notes into actionable todo items
- **💡 Brainstorm Ideas**: Generate creative ideas and suggestions

## Usage Tips
- **Selected text**: AI will process only the selected text
- **No selection**: AI will process the entire note content
- **Todo generation**: New todos are automatically added to your todo list
- **Error handling**: Check the popup for any API errors

## Cost Considerations
- Uses Claude 3 Haiku (fastest, most cost-effective model)
- Typical costs: ~$0.25 per 1M input tokens, ~$1.25 per 1M output tokens
- Most operations use 100-1500 tokens depending on text length

## Troubleshooting
- **"API key not configured"**: Make sure `.env` file exists with correct key
- **Network errors**: Check your internet connection and API key validity
- **CORS errors**: The integration uses `dangerouslyAllowBrowser: true` for client-side usage 