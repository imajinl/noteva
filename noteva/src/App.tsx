import { useState } from 'react'
import './App.css'

function App() {
  const [note, setNote] = useState('')
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [todos, setTodos] = useState<{text: string, done: boolean}[]>([])
  const [todoInput, setTodoInput] = useState('')

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

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!todoInput.trim()) return
    setTodos(t => [...t, {text: todoInput.trim(), done: false}])
    setTodoInput('')
  }
  const toggleTodo = (idx: number) => {
    setTodos(t => t.map((todo, i) => i === idx ? {...todo, done: !todo.done} : todo))
  }

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
      <h1 className="noteva-heading">noteva</h1>
      <form onSubmit={addTodo} style={{width: '100%', maxWidth: 600, margin: '0 auto'}}>
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
          </li>
        ))}
      </ul>
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
