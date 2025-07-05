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
  const [showTodoEntry, setShowTodoEntry] = useState(true)
  const [showTodoList, setShowTodoList] = useState(true)
  const [showNoteBox, setShowNoteBox] = useState(true)
  const [showFormatPopup, setShowFormatPopup] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })

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
    const savedShowTodoEntry = localStorage.getItem('noteva-show-todo-entry')
    const savedShowTodoList = localStorage.getItem('noteva-show-todo-list')
    const savedShowNoteBox = localStorage.getItem('noteva-show-note-box')
    if (savedNote) {
      setNote(savedNote)
      // Set the contentEditable div content
      setTimeout(() => {
        const noteDiv = document.getElementById('note-editor')
        if (noteDiv && savedNote) {
          noteDiv.innerHTML = savedNote
        }
      }, 0)
    }
    if (savedTodos) setTodos(JSON.parse(savedTodos))
    if (savedFont) setFont(savedFont)
    if (savedShowTodoEntry !== null) setShowTodoEntry(savedShowTodoEntry === 'true')
    if (savedShowTodoList !== null) setShowTodoList(savedShowTodoList === 'true')
    if (savedShowNoteBox !== null) setShowNoteBox(savedShowNoteBox === 'true')
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
  useEffect(() => {
    localStorage.setItem('noteva-show-todo-entry', showTodoEntry.toString())
  }, [showTodoEntry])
  useEffect(() => {
    localStorage.setItem('noteva-show-todo-list', showTodoList.toString())
  }, [showTodoList])
  useEffect(() => {
    localStorage.setItem('noteva-show-note-box', showNoteBox.toString())
  }, [showNoteBox])

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
  const clearAll = () => {
    setTodos([])
    setNote('')
    // Clear the contentEditable div
    const noteDiv = document.getElementById('note-editor')
    if (noteDiv) {
      noteDiv.innerHTML = ''
    }
  }

  const exportData = () => {
    // Get HTML content from contentEditable div
    const noteDiv = document.getElementById('note-editor')
    const htmlContent = noteDiv?.innerHTML || ''
    const data = {
      note: htmlContent,
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

  // Text formatting functions
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value || '')
    const noteDiv = document.getElementById('note-editor')
    if (noteDiv) {
      setNote(noteDiv.innerHTML)
    }
  }

  const formatHeading = (level: number) => {
    formatText('formatBlock', `h${level}`)
  }

  const handleNoteInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML
    setNote(content)
    
    // Auto-detect list patterns
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const node = range.startContainer
      
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        const text = node.textContent
        const caretPos = range.startOffset
        
        // Get the current line text
        const lines = text.split('\n')
        const currentLineIndex = text.substring(0, caretPos).split('\n').length - 1
        const currentLine = lines[currentLineIndex] || ''
        
        // Check for numbered list pattern (1. followed by space)
        if (currentLine.match(/^\d+\.\s+/) && caretPos === currentLine.length) {
          setTimeout(() => {
            // Remove the typed pattern and apply list formatting
            const newText = currentLine.replace(/^\d+\.\s+/, '')
            node.textContent = text.replace(currentLine, newText)
            formatText('insertOrderedList')
          }, 0)
        }
        // Check for bullet list pattern (- followed by space)
        else if (currentLine.match(/^-\s+/) && caretPos === currentLine.length) {
          setTimeout(() => {
            // Remove the typed pattern and apply list formatting
            const newText = currentLine.replace(/^-\s+/, '')
            node.textContent = text.replace(currentLine, newText)
            formatText('insertUnorderedList')
          }, 0)
        }
      }
    }
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setPopupPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      })
      setShowFormatPopup(true)
    } else {
      setShowFormatPopup(false)
    }
  }

  const handleMouseUp = () => {
    setTimeout(handleTextSelection, 10)
  }

  const handleKeyUp = () => {
    setTimeout(handleTextSelection, 10)
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
                    height: '32px',
                    boxSizing: 'border-box',
                  }}
                  aria-label="Choose font"
                >
                  {FONT_OPTIONS.map(opt => (
                    <option value={opt.value} key={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginRight: 8,
                  padding: '0.2em 0.5em',
                  borderRadius: 6,
                  border: dark ? '1px solid #333' : '1px solid #ccc',
                  background: dark ? 'var(--bg)' : '#fff',
                  height: '32px',
                  boxSizing: 'border-box',
                }}>
                  <button
                    onClick={() => setShowTodoEntry(!showTodoEntry)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: showTodoEntry ? 'inherit' : '#888',
                      fontSize: '0.85em',
                      cursor: 'pointer',
                      padding: '2px 6px',
                      borderRadius: 3,
                      transition: 'all 0.15s ease',
                      opacity: showTodoEntry ? 1 : 0.6,
                      textDecoration: showTodoEntry ? 'none' : 'line-through',
                    }}
                  >
                    Entry
                  </button>
                  <div style={{
                    width: '1px',
                    height: '16px',
                    background: dark ? '#555' : '#ddd',
                    margin: '0 2px',
                  }}></div>
                  <button
                    onClick={() => setShowTodoList(!showTodoList)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: showTodoList ? 'inherit' : '#888',
                      fontSize: '0.85em',
                      cursor: 'pointer',
                      padding: '2px 6px',
                      borderRadius: 3,
                      transition: 'all 0.15s ease',
                      opacity: showTodoList ? 1 : 0.6,
                      textDecoration: showTodoList ? 'none' : 'line-through',
                    }}
                  >
                    List
                  </button>
                  <div style={{
                    width: '1px',
                    height: '16px',
                    background: dark ? '#555' : '#ddd',
                    margin: '0 2px',
                  }}></div>
                  <button
                    onClick={() => setShowNoteBox(!showNoteBox)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: showNoteBox ? 'inherit' : '#888',
                      fontSize: '0.85em',
                      cursor: 'pointer',
                      padding: '2px 6px',
                      borderRadius: 3,
                      transition: 'all 0.15s ease',
                      opacity: showNoteBox ? 1 : 0.6,
                      textDecoration: showNoteBox ? 'none' : 'line-through',
                    }}
                  >
                    Notes
                  </button>
                </div>
                <button
                  onClick={exportData}
                  style={{
                    fontSize: '0.85em',
                    padding: '0.2em 0.5em',
                    borderRadius: 6,
                    border: dark ? '1px solid #333' : '1px solid #ccc',
                    background: dark ? 'var(--bg)' : '#fff',
                    color: 'inherit',
                    cursor: 'pointer',
                    marginRight: 8,
                    minWidth: '70px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Export
                </button>
                <button
                  onClick={clearAll}
                  style={{
                    fontSize: '0.85em',
                    padding: '0.2em 0.5em',
                    borderRadius: 6,
                    border: dark ? '1px solid #333' : '1px solid #ccc',
                    background: dark ? 'var(--bg)' : '#fff',
                    color: 'inherit',
                    cursor: 'pointer',
                    marginRight: 8,
                    minWidth: '70px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Clear
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
            <li>Press 'Enter' to add a to-do.</li>
            <li>Your notes and to-dos are saved in your browser (local storage).</li>
            <li>You can export your notes and to-dos as JSON.</li>
            <li>Change fonts and theme from the top right bar.</li>
            <li>Toggle visibility of 'Entry', 'List', and 'Notes' boxes by clicking the buttons in the toolbar (strikethrough = hidden).</li>
            <li>Use 'Clear' button to clear all to-dos and notes.</li>
            <li>Select text in notes to show formatting popup with bold, underline, headings, and lists.</li>
            <li>Type '1. ' for numbered lists or '- ' for bullet lists.</li>
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
        {showTodoEntry && (
          <form onSubmit={addTodo} style={{width: '100%', maxWidth: 700, margin: '0 auto 0.2rem auto'}}>
            <input
              className="todo-input"
              value={todoInput}
              onChange={e => setTodoInput(e.target.value)}
              placeholder="Add a to-do..."
              style={{width: '100%'}}
            />
          </form>
        )}
        {showTodoList && (
          <ul className="todo-list">
            {todos.map((todo, i) => (
              <li className="todo-item" key={i}>
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(i)}
                />
                <span className={`todo-text ${todo.done ? 'completed' : ''}`}>{todo.text}</span>
                <button className="todo-delete-btn" onClick={() => deleteTodo(i)} title="Delete to-do" aria-label="Delete to-do">✕</button>
              </li>
            ))}
          </ul>
        )}
        {showNoteBox && (
          <div style={{ width: '100%', maxWidth: 700, margin: '0 auto', position: 'relative' }}>
            <div
              id="note-editor"
              contentEditable
              onInput={handleNoteInput}
              onMouseUp={handleMouseUp}
              onKeyUp={handleKeyUp}
              style={{
                width: '100%',
                minHeight: '40vh',
                padding: '1rem',
                fontSize: '1.05rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                background: 'var(--input-bg)',
                color: 'var(--fg)',
                fontFamily: 'inherit',
                outline: 'none',
                boxShadow: '0 1px 4px 0 rgba(0,0,0,0.02)',
                marginBottom: '0.7rem',
                display: 'block',
                boxSizing: 'border-box',
                overflowY: 'auto',
                lineHeight: '1.5',
              }}
                             data-placeholder="Type a note..."
            />
            
            {/* Formatting popup */}
            {showFormatPopup && (
              <div
                style={{
                  position: 'fixed',
                  left: popupPosition.x,
                  top: popupPosition.y,
                  transform: 'translateX(-50%) translateY(-100%)',
                  display: 'flex',
                  gap: '4px',
                  padding: '8px',
                  background: dark ? '#1a1a1a' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  fontSize: '14px',
                  zIndex: 1000,
                  maxWidth: '400px',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  onClick={() => formatText('bold')}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: dark ? '#2a2a2a' : '#f8f9fa',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => formatText('underline')}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: dark ? '#2a2a2a' : '#f8f9fa',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textDecoration: 'underline',
                  }}
                  title="Underline"
                >
                  U
                </button>
                <button
                  type="button"
                  onClick={() => formatText('strikethrough')}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: dark ? '#2a2a2a' : '#f8f9fa',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textDecoration: 'line-through',
                  }}
                  title="Strikethrough"
                >
                  S
                </button>
                <div style={{ width: '1px', height: '24px', background: '#ccc', margin: '0 4px' }} />
                <button
                  type="button"
                  onClick={() => formatHeading(1)}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: dark ? '#2a2a2a' : '#f8f9fa',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => formatHeading(2)}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: dark ? '#2a2a2a' : '#f8f9fa',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => formatHeading(3)}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: dark ? '#2a2a2a' : '#f8f9fa',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                  title="Heading 3"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => formatText('formatBlock', 'p')}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: dark ? '#2a2a2a' : '#f8f9fa',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  title="Normal Text"
                >
                  P
                </button>
                <div style={{ width: '1px', height: '24px', background: '#ccc', margin: '0 4px' }} />
                <button
                  type="button"
                  onClick={() => formatText('insertOrderedList')}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: dark ? '#2a2a2a' : '#f8f9fa',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  title="Numbered List"
                >
                  1.
                </button>
                <button
                  type="button"
                  onClick={() => formatText('insertUnorderedList')}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: dark ? '#2a2a2a' : '#f8f9fa',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  title="Bullet List"
                >
                  •
                </button>
                <button
                  type="button"
                  onClick={() => formatText('removeFormat')}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: dark ? '#2a2a2a' : '#f8f9fa',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  title="Clear Formatting"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default App
