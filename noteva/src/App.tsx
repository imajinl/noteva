import { useState } from 'react'
import './App.css'

function App() {
  const [note, setNote] = useState('')
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  // Toggle theme
  const toggleTheme = () => {
    setDark((d) => {
      const next = !d
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
      return next
    })
  }

  // Set initial theme on mount
  useState(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  })

  return (
    <div className="notetaker-container">
      <button
        onClick={toggleTheme}
        style={{
          marginBottom: 24,
          border: 'none',
          background: 'none',
          color: 'inherit',
          fontSize: 18,
          cursor: 'pointer',
          alignSelf: 'flex-end',
        }}
        aria-label="Toggle light/dark mode"
      >
        {dark ? '🌙' : '☀️'}
      </button>
      <h1 className="virgil">noteva</h1>
      <textarea
        className="notetaker-textarea"
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Type your note..."
      />
    </div>
  )
}

export default App
