import { useState, useEffect } from 'react'

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
  const [dark, setDark] = useState(false)
  const [todos, setTodos] = useState<{text: string, done: boolean}[]>([])
  const [todoInput, setTodoInput] = useState('')
  const [font, setFont] = useState(FONT_OPTIONS[0].value)
  const [infoOpen, setInfoOpen] = useState(false)
  const [barHovered, setBarHovered] = useState(false)
  const [time, setTime] = useState(new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}))
  const [btcPrice, setBtcPrice] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch Bitcoin price
  const fetchBtcPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      const data = await response.json()
      setBtcPrice(data.bitcoin.usd)
    } catch (error) {
      console.error('Error fetching BTC price:', error)
    }
  }

  useEffect(() => {
    fetchBtcPrice() // Initial fetch
    const interval = setInterval(fetchBtcPrice, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

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
      <div style={{position:'fixed', top:'0.8rem', left:'1rem', fontSize:'0.9rem', color:'var(--fg)', opacity:0.8, pointerEvents:'none', userSelect:'none', display:'flex', alignItems:'center', gap:'1rem', fontFamily: effectiveFont}}>
        <span>{time}</span>
        <span>{btcPrice ? `₿ $${btcPrice.toLocaleString()}` : '₿ ...'}</span>
      </div>
      <div className="notetaker-container" style={{fontFamily: effectiveFont}}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '1.2rem' }}>
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setBarHovered(true)}
            onMouseLeave={() => setBarHovered(false)}
          >
            {/* Menu trigger - always visible */}
            <div
              style={{
                background: dark ? 'var(--bg)' : '#fff',
                color: 'inherit',
                fontSize: 22,
                borderRadius: 8,
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                padding: '0.2em 0.7em',
                cursor: 'pointer',
                border: dark ? '1px solid #333' : '1px solid #ddd',
              }}
              aria-label="Menu"
              title="Menu"
            >
              ≡
            </div>
            
            {/* Full toolbar - shows on hover */}
            {barHovered && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  display: 'flex',
                  alignItems: 'center',
                  background: dark ? 'var(--bg)' : '#fff',
                  border: dark ? '1px solid #333' : '1px solid #ddd',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                  padding: '0.3em 1.1em',
                  minHeight: 40,
                  zIndex: 10,
                }}
              >
                <select
                  value={font}
                  onChange={e => setFont(e.target.value)}
                  style={{
                    fontSize: '1em',
                    padding: '0.2em 0.5em',
                    borderRadius: 6,
                    border: dark ? '1px solid #333' : '1px solid #ccc',
                    background: dark ? 'var(--bg)' : '#fff',
                    color: 'inherit',
                    marginRight: 8,
                  }}
                  aria-label="Choose font"
                >
                  {FONT_OPTIONS.map(opt => (
                    <option value={opt.value} key={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={exportData}
                  style={{
                    fontSize: '1em',
                    padding: '0.2em 0.5em',
                    borderRadius: 6,
                    border: dark ? '1px solid #333' : '1px solid #ccc',
                    background: dark ? 'var(--bg)' : '#fff',
                    color: 'inherit',
                    cursor: 'pointer',
                    marginRight: 8,
                  }}
                >
                  Export
                </button>
                <button
                  onClick={toggleTheme}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'inherit',
                    fontSize: 20,
                    cursor: 'pointer',
                    marginRight: 0,
                  }}
                  aria-label="Toggle light/dark mode"
                >
                  {dark ? '🌙' : '☀️'}
                </button>
                <button
                  onClick={() => setInfoOpen(true)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'inherit',
                    fontSize: 20,
                    cursor: 'pointer',
                    marginLeft: 0,
                  }}
                  aria-label="Show info"
                >
                  ℹ️
                </button>
              </div>
            )}
          </div>
        </div>
      {infoOpen && (
        <div style={{position:'fixed',top:0,right:0,width:'320px',maxWidth:'90vw',height:'100vh',background:'var(--bg)',color:'var(--fg)',boxShadow:'-2px 0 16px 0 rgba(0,0,0,0.10)',zIndex:1000,display:'flex',flexDirection:'column',padding:'2rem 1.5rem 1.5rem 1.5rem',transition:'transform 0.2s',fontSize:'1.08em'}}>
          <button onClick={()=>setInfoOpen(false)} style={{position:'absolute',top:12,right:16,border:'none',background:'none',fontSize:22,cursor:'pointer',color:'inherit'}} aria-label="Close info">✕</button>
          <h2 style={{marginTop:0,marginBottom:'1.2em',fontSize:'1.3em'}}>Info</h2>
          <ul style={{paddingLeft:18,marginBottom:'auto',textAlign:'left'}}>
            <li>Press <b>Enter</b> to add a to-do.</li>
            <li>Your notes and to-dos are saved in your browser (local storage).</li>
            <li>You can export your notes and to-dos as JSON.</li>
            <li>Change fonts and theme from the top right bar.</li>
          </ul>
          <div style={{marginBottom: '0.5em', fontSize: '1em', color: '#888', textAlign: 'center'}}>
            DM <b>@imajinl</b> for questions or feedback on Telegram.
          </div>
          <div style={{marginTop:'auto',fontSize:'0.98em',color:'#888',textAlign:'center'}}>
            Questions? DM <b>@imajinl</b> on Telegram.
          </div>
        </div>
      )}
        <h1 className="noteva-heading">noteva <span role="img" aria-label="butterfly">🦋</span></h1>
        <form onSubmit={addTodo} style={{width: '100%', maxWidth: 700, margin: '0 auto 0.2rem auto'}}>
          <input
            className="todo-input"
            value={todoInput}
            onChange={e => setTodoInput(e.target.value)}
            placeholder="Add a to-do..."
            style={{width: '100%'}}
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
        <textarea
          className="notetaker-textarea"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Type your note..."
        />
      </div>
    </>
  )
}

export default App
