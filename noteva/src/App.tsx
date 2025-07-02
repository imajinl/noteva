import { useState, useEffect } from 'react'
import './App.css'

const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { label: 'Roboto', value: 'Roboto, Arial, sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Menlo', value: 'Menlo, Monaco, monospace' },
  { label: 'Fira Sans', value: 'Fira Sans, Arial, sans-serif' },
  { label: 'Lato', value: 'Lato, Arial, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, Arial, sans-serif' },
  { label: 'Open Sans', value: 'Open Sans, Arial, sans-serif' },
  { label: 'Oswald', value: 'Oswald, Arial, sans-serif' },
  { label: 'Raleway', value: 'Raleway, Arial, sans-serif' },
  { label: 'Poppins', value: 'Poppins, Arial, sans-serif' },
  { label: 'Merriweather', value: 'Merriweather, serif' },
  { label: 'Nunito', value: 'Nunito, Arial, sans-serif' },
  { label: 'Quicksand', value: 'Quicksand, Arial, sans-serif' },
  { label: 'Ubuntu', value: 'Ubuntu, Arial, sans-serif' },
  { label: 'PT Sans', value: 'PT Sans, Arial, sans-serif' },
  { label: 'Source Sans Pro', value: 'Source Sans Pro, Arial, sans-serif' },
  { label: 'Work Sans', value: 'Work Sans, Arial, sans-serif' },
  { label: 'Inconsolata', value: 'Inconsolata, monospace' },
  { label: 'Playfair Display', value: 'Playfair Display, serif' },
  { label: 'Rubik', value: 'Rubik, Arial, sans-serif' },
  { label: 'Space Mono', value: 'Space Mono, monospace' },
  { label: 'Cabin', value: 'Cabin, Arial, sans-serif' },
  { label: 'Bitter', value: 'Bitter, serif' },
  { label: 'DM Sans', value: 'DM Sans, Arial, sans-serif' },
  { label: 'Zilla Slab', value: 'Zilla Slab, serif' },
  { label: 'System', value: 'system-ui, sans-serif' },
]

function App() {
  const [note, setNote] = useState('')
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [todos, setTodos] = useState<{text: string, done: boolean}[]>([])
  const [todoInput, setTodoInput] = useState('')
  const [font, setFont] = useState(FONT_OPTIONS[0].value)

  // Load from localStorage
  useEffect(() => {
    const savedNote = localStorage.getItem('noteva-note')
    const savedTodos = localStorage.getItem('noteva-todos')
    const savedFont = localStorage.getItem('noteva-font')
    if (savedNote) setNote(savedNote)
    if (savedTodos) setTodos(JSON.parse(savedTodos))
    if (savedFont) setFont(savedFont)
  }, [])
  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('noteva-note', note)
  }, [note])
  useEffect(() => {
    localStorage.setItem('noteva-todos', JSON.stringify(todos))
  }, [todos])
  useEffect(() => {
    localStorage.setItem('noteva-font', font)
  }, [font])

  // Toggle theme
  const toggleTheme = () => {
    setDark((d) => {
      const next = !d
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
      return next
    })
  }

  // Set initial theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!todoInput.trim()) return
    setTodos(t => [...t, {text: todoInput.trim(), done: false}])
    setTodoInput('')
  }
  const toggleTodo = (idx: number) => {
    setTodos(t => t.map((todo, i) => i === idx ? {...todo, done: !todo.done} : todo))
  }
  const deleteTodo = (idx: number) => {
    setTodos(t => t.filter((_, i) => i !== idx))
  }
  const clearTodos = () => setTodos([])

  const exportData = () => {
    const data = {
      note,
      todos,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'noteva-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const effectiveFont = font

  return (
    <>
      <div style={{position:'fixed',top:16,right:20,zIndex:10,display:'flex',gap:8,alignItems:'center'}}>
        <select value={font} onChange={e => setFont(e.target.value)} style={{fontSize:'1em',padding:'0.2em 0.5em',borderRadius:6,border:'1px solid #ccc'}} aria-label="Choose font">
          {FONT_OPTIONS.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
        </select>
        <button onClick={exportData} style={{fontSize:'1em',padding:'0.2em 0.7em',borderRadius:6,border:'1px solid #ccc',background:'var(--input-bg)',color:'var(--fg)',cursor:'pointer'}}>Export</button>
        <button
          onClick={toggleTheme}
          style={{
            border: 'none',
            background: 'none',
            color: 'inherit',
            fontSize: 20,
            cursor: 'pointer',
          }}
          aria-label="Toggle light/dark mode"
        >
          {dark ? '🌙' : '☀️'}
        </button>
      </div>
      <div className="notetaker-container" style={{fontFamily: effectiveFont}}>
        <h1 className="noteva-heading">noteva</h1>
        <div className="noteva-block">
          <form onSubmit={addTodo} style={{width: '100%'}}>
            <input
              className="todo-input"
              value={todoInput}
              onChange={e => setTodoInput(e.target.value)}
              placeholder="Add a to-do..."
            />
          </form>
          <ul className="todo-list">
            {todos.map((todo, i) => (
              <li className="todo-item" key={i}>
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(i)}
                />
                <span style={{textDecoration: todo.done ? 'line-through' : undefined, opacity: todo.done ? 0.5 : 1}}>{todo.text}</span>
                <button className="todo-delete-btn" onClick={() => deleteTodo(i)} title="Delete to-do" aria-label="Delete to-do">✕</button>
              </li>
            ))}
          </ul>
          {todos.length > 0 && (
            <button onClick={clearTodos} className="todo-delete-btn" style={{margin:'0 0 1.2rem auto',display:'block',fontSize:'1em'}} title="Delete all to-dos" aria-label="Delete all to-dos">Clear all</button>
          )}
        </div>
        <div className="noteva-block">
          <textarea
            className="notetaker-textarea"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Type your note..."
          />
        </div>
      </div>
    </>
  )
}

export default App
