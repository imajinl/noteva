# noteva 🦋

minimalistic notetaker and to-do app with rich text formatting and AI-powered features — everything is saved in your browser's local storage. distraction-free, fast, and customizable with Claude AI integration.

## features
- **distraction-free notes and to-dos** with clean, modern interface
- **rich text formatting** — bold, underline, strikethrough, headings, and lists
- **smart auto-detection** — type '1. ' for numbered lists or '- ' for bullet lists
- **popup formatting toolbar** — select text to show formatting options
- **🤖 AI-powered features** — Claude integration for text improvement, expansion, summarization, and smart to-do generation
- **customizable layout** — hide / show Entry, List, or Notes boxes individually
- **light / dark mode toggle** with theme-aware styling
- **30+ font options** for personalized typography
- **bitcoin price display** via CoinGecko API (updates every minute)
- **enhanced to-do list** with custom checkboxes and smooth animations
- **local storage persistence** — all data saved automatically in your browser
- **pdf export** for backup and portability
- **responsive design** works on desktop and mobile

## usage
- **add a to-do:** type in the entry box and press 'Enter'
- **complete / uncomplete:** click the custom checkbox next to any to-do
- **delete individual to-do:** click the '✕' button
- **clear everything:** click 'Clear' to remove all to-dos and notes
- **hide / show sections:** click 'Entry', 'List', or 'Notes' in the toolbar (strikethrough = hidden)
- **change font:** use the dropdown in the toolbar
- **switch theme:** click the '🌙' / '☀️' button
- **export data:** click 'Export' to download your data as PDF
- **format text:** select text in notes to show formatting popup with bold, underline, headings, and lists
- **create lists:** type '1. ' for numbered lists or '- ' for bullet lists
- **🤖 AI features:** click the robot icon for AI-powered text improvement, expansion, summarization, and to-do generation
- **AI on selected text:** select any text and use ✨ and 📝 buttons for quick AI operations
- **get help:** click the 'ℹ️' button for detailed instructions

## AI features
- **✨ improve text:** make writing clearer and more concise
- **📝 expand text:** add detail, examples, and context
- **📋 summarize:** create concise summaries of long text
- **✅ generate to-dos:** convert notes into actionable to-do items
- **💡 brainstorm ideas:** generate creative suggestions and ideas

## setup for AI features
1. Get your Claude API key from [console.anthropic.com](https://console.anthropic.com)
2. For **local development:**
   ```bash
   cd noteva
   echo "VITE_ANTHROPIC_API_KEY=your_api_key_here" > .env
   ```
3. For **deployment (Vercel / Netlify):**
   - Add environment variable: `VITE_ANTHROPIC_API_KEY` with your API key
   - The app works without AI features if no key is provided

## deploy
**vercel:**
- root directory: `noteva`
- build command: `npm run build`
- output directory: `dist`
- environment variable: `VITE_ANTHROPIC_API_KEY` (optional, for AI features)

**netlify:**
- build command: `npm run build`
- publish directory: `dist`
- environment variable: `VITE_ANTHROPIC_API_KEY` (optional, for AI features)

---

built by [@imajinl](https://t.me/imajinl) 
