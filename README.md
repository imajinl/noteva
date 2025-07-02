# noteva

Minimal notetaker + to-do app

![noteva screenshot](./screenshot.png)

---

## Features
- 📝 Minimal, distraction-free notetaking
- ✅ To-do list with add, check, delete, clear
- 🌗 Light/dark mode toggle (top right)
- 🅰️ Choose from 30+ popular fonts
- 💾 LocalStorage for notes, todos, and font
- 📤 Export notes/todos as JSON
- ℹ️ Info/help drawer (top right)
- ⚡ Super fast, instant load (Vite + React)
- 📱 Responsive (works on desktop & mobile)

---

## Tech Stack
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build tool)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for theming

---

## Install & Run Locally
```bash
# Clone the repo
$ git clone <your-fork-url>
$ cd noteva/noteva

# Install dependencies
$ npm install

# Start dev server
$ npm run dev

# Build for production
$ npm run build
```

---

## Usage
- **Add a to-do:** Type and press Enter
- **Delete a to-do:** Click ✕
- **Clear all to-dos:** Click "Clear all"
- **Change font:** Use dropdown (top right)
- **Export:** Click "Export" (top right)
- **Info:** Click ℹ️ (top right)

---

## Deploy
### Vercel
1. Set **Root Directory** to `noteva`
2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`
4. Deploy and enjoy!

### Netlify
1. **Build Command:** `npm run build`
2. **Publish directory:** `dist`
3. Deploy and enjoy!

---

## FAQ
**Q: Where are my notes and todos stored?**  
A: In your browser's localStorage. They never leave your device.

**Q: Can I use my own font?**  
A: Choose from 30+ popular fonts in the dropdown.

**Q: Can I import my notes?**  
A: Not yet, but export is supported as JSON.

**Q: Is it open source?**  
A: Yes! Fork, remix, or contribute.

---

## Credits
- Built by @imajinl
- Questions? DM [@imajinl on Telegram](https://t.me/imajinl)
