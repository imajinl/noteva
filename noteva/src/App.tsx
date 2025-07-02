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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--fg)',
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: 'background 0.2s, color 0.2s',
      }}
    >
      <button
        onClick={toggleTheme}
        style={{
          marginBottom: 24,
          border: 'none',
          background: 'none',
          color: 'inherit',
          fontSize: 18,
          cursor: 'pointer',
        }}
        aria-label="Toggle light/dark mode"
      >
        {dark ? '🌙' : '☀️'}
      </button>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Type your note..."
        style={{
          width: 340,
          minHeight: 180,
          resize: 'vertical',
          padding: 16,
          fontSize: 18,
          borderRadius: 10,
          border: '1px solid #ccc',
          background: 'var(--input-bg)',
          color: 'var(--fg)',
          fontFamily: 'inherit',
          outline: 'none',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
        }}
      />
    </div>
  )
}

export default App
