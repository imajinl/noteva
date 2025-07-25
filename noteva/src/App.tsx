import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import html2pdf from 'html2pdf.js'
import { improveText, expandText, summarizeText, generateTodos, brainstormIdeas } from './claude'
import type { ClaudeResponse } from './claude'

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
  const [menuClicked, setMenuClicked] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [showAiPopup, setShowAiPopup] = useState(false)
  const [selectedText, setSelectedText] = useState('')

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
          const isEmpty = !savedNote || savedNote.trim() === '' || savedNote === '<br>' || savedNote === '<div><br></div>'
          noteDiv.classList.toggle('empty', isEmpty)
        }
      }, 0)
    } else {
      // If no saved note, make sure empty class is set
      setTimeout(() => {
        const noteDiv = document.getElementById('note-editor')
        if (noteDiv) {
          noteDiv.classList.add('empty')
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

  // Restore note content when note box is shown
  useEffect(() => {
    if (showNoteBox) {
      setTimeout(() => {
        const noteDiv = document.getElementById('note-editor')
        if (noteDiv) {
          if (note && noteDiv.innerHTML === '') {
            noteDiv.innerHTML = note
          }
          // Update empty class for placeholder
          const isEmpty = !note || note.trim() === '' || note === '<br>' || note === '<div><br></div>'
          noteDiv.classList.toggle('empty', isEmpty)
        }
      }, 0)
    }
  }, [showNoteBox, note])

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (menuClicked && !target.closest('[data-menu-container]')) {
        setMenuClicked(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [menuClicked])



  const handleSelectionChange = () => {
    // Only handle selection changes within the note editor
    const selection = window.getSelection()
    if (selection && selection.anchorNode) {
      const noteEditor = document.getElementById('note-editor')
      if (noteEditor && noteEditor.contains(selection.anchorNode)) {
        const selectedTextValue = selection.toString().trim()
        setSelectedText(selectedTextValue)
        if (selectedTextValue.length > 0) {
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          setPopupPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          })
          setShowFormatPopup(true)
        } else {
          setShowFormatPopup(false)
          setSelectedText('')
        }
      } else {
        // If selection is outside note editor, hide popup
        setShowFormatPopup(false)
        setSelectedText('')
      }
    }
  }

  // Handle selection changes globally
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [handleSelectionChange])

  // Hide popup when clicking outside
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element
      if (showFormatPopup && !target.closest('#note-editor') && !target.closest('[data-format-popup]') && !target.closest('[data-ai-popup]')) {
        setShowFormatPopup(false)
      }
      if (showAiPopup && !target.closest('[data-ai-popup]') && !target.closest('[data-ai-trigger]')) {
        setShowAiPopup(false)
      }
    }
    
    document.addEventListener('mousedown', handleDocumentClick)
    return () => document.removeEventListener('mousedown', handleDocumentClick)
  }, [showFormatPopup, showAiPopup])

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
      noteDiv.classList.add('empty')
    }
  }

  const exportData = () => {
    // Create a container with all the content for PDF export
    const container = document.createElement('div')
    container.style.padding = '20px'
    container.style.fontFamily = font
    container.style.backgroundColor = '#ffffff'
    container.style.color = '#000000'
    container.style.lineHeight = '1.6'
    
    // Add title
    const title = document.createElement('h1')
    title.textContent = 'Noteva Export'
    title.style.marginBottom = '30px'
    title.style.borderBottom = '2px solid #333'
    title.style.paddingBottom = '10px'
    container.appendChild(title)
    
    // Add date
    const dateDiv = document.createElement('div')
    dateDiv.textContent = `Exported on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`
    dateDiv.style.marginBottom = '30px'
    dateDiv.style.color = '#666'
    dateDiv.style.fontSize = '14px'
    container.appendChild(dateDiv)
    
    // Add notes section if there are notes
    const noteDiv = document.getElementById('note-editor')
    const htmlContent = noteDiv?.innerHTML || ''
    if (htmlContent.trim()) {
      const notesTitle = document.createElement('h2')
      notesTitle.textContent = 'Notes'
      notesTitle.style.marginTop = '20px'
      notesTitle.style.marginBottom = '15px'
      container.appendChild(notesTitle)
      
      const notesContent = document.createElement('div')
      notesContent.innerHTML = htmlContent
      notesContent.style.marginBottom = '30px'
      container.appendChild(notesContent)
    }
    
    // Add todos section if there are todos
    if (todos.length > 0) {
      const todosTitle = document.createElement('h2')
      todosTitle.textContent = 'To-dos'
      todosTitle.style.marginTop = '20px'
      todosTitle.style.marginBottom = '15px'
      container.appendChild(todosTitle)
      
      const todosList = document.createElement('ul')
      todosList.style.listStyle = 'none'
      todosList.style.padding = '0'
      
      todos.forEach(todo => {
        const todoItem = document.createElement('li')
        todoItem.style.marginBottom = '8px'
        todoItem.style.display = 'flex'
        todoItem.style.alignItems = 'center'
        
        const checkbox = document.createElement('span')
        checkbox.textContent = todo.done ? '☑' : '☐'
        checkbox.style.marginRight = '10px'
        checkbox.style.fontSize = '16px'
        
        const text = document.createElement('span')
        text.textContent = todo.text
        if (todo.done) {
          text.style.textDecoration = 'line-through'
          text.style.color = '#888'
        }
        
        todoItem.appendChild(checkbox)
        todoItem.appendChild(text)
        todosList.appendChild(todoItem)
      })
      
      container.appendChild(todosList)
    }
    
    // Generate PDF
    const options = {
      margin: 1,
      filename: 'noteva-export.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    
    html2pdf().set(options).from(container).save()
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
    
    // Update empty class for placeholder
    const isEmpty = !content || content.trim() === '' || content === '<br>' || content === '<div><br></div>'
    e.currentTarget.classList.toggle('empty', isEmpty)
    
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
    if (selection && selection.toString().trim().length > 0) {
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
    setTimeout(handleTextSelection, 50)
  }

  const handleKeyUp = () => {
    setTimeout(handleTextSelection, 50)
  }

  // AI helper functions
  const handleAiOperation = async (operation: 'improve' | 'expand' | 'summarize' | 'todos' | 'brainstorm', text?: string) => {
    const textToProcess = text || selectedText || note
    if (!textToProcess.trim()) {
      setAiError('No text to process')
      return
    }

    setAiLoading(true)
    setAiError('')
    
    try {
      let response: ClaudeResponse
      
      switch (operation) {
        case 'improve':
          response = await improveText(textToProcess)
          break
        case 'expand':
          response = await expandText(textToProcess)
          break
        case 'summarize':
          response = await summarizeText(textToProcess)
          break
        case 'todos':
          response = await generateTodos(textToProcess)
          break
        case 'brainstorm':
          response = await brainstormIdeas(textToProcess)
          break
        default:
          response = { success: false, content: '', error: 'Unknown operation' }
      }

      if (response.success) {
        if (operation === 'todos') {
          // Parse todos and add them to the list
          const newTodos = response.content.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(text => ({ text, done: false }))
          
          setTodos(t => [...t, ...newTodos])
        } else {
          // Replace text in note editor
          const noteDiv = document.getElementById('note-editor')
          if (noteDiv) {
            if (selectedText && window.getSelection()) {
              // Replace selected text
              const selection = window.getSelection()
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0)
                range.deleteContents()
                range.insertNode(document.createTextNode(response.content))
                selection.removeAllRanges()
              }
            } else {
              // Replace entire content
              noteDiv.innerHTML = response.content
            }
            setNote(noteDiv.innerHTML)
            const isEmpty = !noteDiv.innerHTML || noteDiv.innerHTML.trim() === ''
            noteDiv.classList.toggle('empty', isEmpty)
          }
        }
        setShowAiPopup(false)
        setShowFormatPopup(false)
      } else {
        setAiError(response.error || 'AI operation failed')
      }
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setAiLoading(false)
    }
  }



  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    
    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/plain')
    
    if (text) {
      // Get current selection
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        
        // Delete any selected content
        range.deleteContents()
        
        // Preserve spacing by converting line breaks to HTML
        const lines = text.split('\n')
        const fragment = document.createDocumentFragment()
        
        lines.forEach((line, index) => {
          if (index > 0) {
            fragment.appendChild(document.createElement('br'))
          }
          if (line.trim() || index === 0) {
            fragment.appendChild(document.createTextNode(line))
          }
        })
        
        range.insertNode(fragment)
        
        // Move cursor to end of inserted content
        range.setStart(fragment.lastChild || fragment, fragment.lastChild?.textContent?.length || 0)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
        
        // Trigger input event to update state
        const inputEvent = new Event('input', { bubbles: true })
        e.currentTarget.dispatchEvent(inputEvent)
      }
    }
  }

  const effectiveFont = font

  return (
    <>
      <div className="time-btc-display" style={{fontSize:'0.9rem', color:'var(--fg)', opacity:0.8, pointerEvents:'none', userSelect:'none', display:'flex', alignItems:'center', gap:'1rem', fontFamily: effectiveFont}}>
        <span>{time}</span>
        <span>{btcPrice ? `₿ $${btcPrice.toLocaleString()}` : '₿ ...'}</span>
      </div>
      <div className="notetaker-container" style={{fontFamily: effectiveFont}}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '1.2rem' }}>
          <div
                      style={{ 
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 100
            }}
            onMouseEnter={() => setBarHovered(true)}
            onMouseLeave={() => setBarHovered(false)}
            data-menu-container
          >
            {/* Menu trigger - always visible */}
            <div
              onClick={() => setMenuClicked(!menuClicked)}
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
            
            {/* Full toolbar - shows on hover or click */}
            {(barHovered || menuClicked) && (
              <div
                className="toolbar-popup"
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
                  zIndex: 101,
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
                  onClick={() => setShowAiPopup(!showAiPopup)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'inherit',
                    fontSize: 20,
                    cursor: 'pointer',
                    marginRight: 2,
                    opacity: aiLoading ? 0.5 : 1,
                  }}
                  disabled={aiLoading}
                  aria-label="AI Tools"
                  data-ai-trigger
                >
                  🤖
                </button>
                <button
                  onClick={toggleTheme}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'inherit',
                    fontSize: 20,
                    cursor: 'pointer',
                    marginRight: 2,
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
                    marginRight: 0,
                  }}
                  aria-label="Show info"
                >
                  ℹ️
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Popup */}
        {showAiPopup && (
          <div
            data-ai-popup
            style={{
              position: 'fixed',
              top: '80px',
              right: '20px',
              background: dark ? '#1a1a1a' : '#fff',
              border: '1px solid #ccc',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              padding: '16px',
              minWidth: '280px',
              zIndex: 1000,
              fontSize: '14px',
            }}
          >
            <div style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 'bold' }}>
              🤖 AI Tools
            </div>
            
            {aiError && (
              <div style={{ 
                color: '#e74c3c', 
                fontSize: '12px', 
                marginBottom: '12px',
                padding: '8px',
                background: 'rgba(231, 76, 60, 0.1)',
                borderRadius: '6px'
              }}>
                {aiError}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                {selectedText ? 'Selected text:' : 'Entire note:'}
              </div>
              
              <button
                onClick={() => handleAiOperation('improve')}
                disabled={aiLoading}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  background: dark ? '#2a2a2a' : '#f8f9fa',
                  color: 'inherit',
                  cursor: aiLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: aiLoading ? 0.5 : 1,
                }}
              >
                ✨ Improve Text
              </button>
              
              <button
                onClick={() => handleAiOperation('expand')}
                disabled={aiLoading}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  background: dark ? '#2a2a2a' : '#f8f9fa',
                  color: 'inherit',
                  cursor: aiLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: aiLoading ? 0.5 : 1,
                }}
              >
                📝 Expand Text
              </button>
              
              <button
                onClick={() => handleAiOperation('summarize')}
                disabled={aiLoading}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  background: dark ? '#2a2a2a' : '#f8f9fa',
                  color: 'inherit',
                  cursor: aiLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: aiLoading ? 0.5 : 1,
                }}
              >
                📋 Summarize
              </button>
              
              <div style={{ height: '1px', background: '#ddd', margin: '8px 0' }} />
              
              <button
                onClick={() => handleAiOperation('todos')}
                disabled={aiLoading}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  background: dark ? '#2a2a2a' : '#f8f9fa',
                  color: 'inherit',
                  cursor: aiLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: aiLoading ? 0.5 : 1,
                }}
              >
                ✅ Generate To-dos
          </button>
              
        <button
                onClick={() => handleAiOperation('brainstorm')}
                disabled={aiLoading}
          style={{
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  background: dark ? '#2a2a2a' : '#f8f9fa',
            color: 'inherit',
                  cursor: aiLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: aiLoading ? 0.5 : 1,
                }}
              >
                💡 Brainstorm Ideas
        </button>
            </div>
            
            {aiLoading && (
              <div style={{ 
                marginTop: '12px', 
                textAlign: 'center', 
                color: '#666',
                fontSize: '12px'
              }}>
                🤖 Working...
              </div>
      )}
        </div>
        )}

      {infoOpen && (
        <div style={{position:'fixed',top:0,right:0,width:'320px',maxWidth:'90vw',height:'100vh',background:'var(--bg)',color:'var(--fg)',boxShadow:'-2px 0 16px 0 rgba(0,0,0,0.10)',zIndex:1000,display:'flex',flexDirection:'column',padding:'2rem 1.5rem 1.5rem 1.5rem',transition:'transform 0.2s',fontSize:'1.08em'}}>
          <button onClick={()=>setInfoOpen(false)} style={{position:'absolute',top:12,right:16,border:'none',background:'none',fontSize:22,cursor:'pointer',color:'inherit'}} aria-label="Close info">✕</button>
          <h2 style={{marginTop:0,marginBottom:'1.2em',fontSize:'1.3em'}}>Info</h2>
          <ul className="info-list" style={{
            paddingLeft:18,
            marginBottom:'1.5rem',
            textAlign:'left',
            overflowY:'auto',
            flex:'1'
          }}>
            <li>Press 'Enter' to add a to-do.</li>
            <li>Your notes and to-dos are saved in your browser (local storage).</li>
            <li>You can export your notes and to-dos as PDF.</li>
            <li>Change fonts and theme from the top right bar.</li>
            <li>Toggle visibility of 'Entry', 'List', and 'Notes' boxes by clicking the buttons in the toolbar (strikethrough = hidden).</li>
            <li>Use 'Clear' button to clear all to-dos and notes.</li>
            <li>Select text in notes to show formatting popup with bold, underline, headings, and lists.</li>
            <li>Type '1. ' for numbered lists or '- ' for bullet lists.</li>
            <li>AI Features: Click the robot icon for AI-powered text improvement, expansion, summarization, and to-do generation.</li>
            <li>Quick AI: Select any text and use ✨ (improve) and 📝 (expand) buttons in the formatting popup.</li>
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
              onPaste={handlePaste}
              onFocus={(e) => e.currentTarget.classList.remove('empty')}
              onBlur={(e) => {
                const content = e.currentTarget.innerHTML
                const isEmpty = !content || content.trim() === '' || content === '<br>' || content === '<div><br></div>'
                e.currentTarget.classList.toggle('empty', isEmpty)
              }}
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
                data-format-popup
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
                  onClick={() => formatText('italic')}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: dark ? '#2a2a2a' : '#f8f9fa',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontStyle: 'italic',
                  }}
                  title="Italic"
                >
                  I
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
                  -
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
                <div style={{ width: '1px', height: '24px', background: '#ccc', margin: '0 4px' }} />
                <button
                  type="button"
                  onClick={() => handleAiOperation('improve')}
                  disabled={aiLoading}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: dark ? '#2a2a2a' : '#f8f9fa',
                    color: 'inherit',
                    cursor: aiLoading ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    opacity: aiLoading ? 0.5 : 1,
                  }}
                  title="Improve with AI"
                >
                  ✨
                </button>
                <button
                  type="button"
                  onClick={() => handleAiOperation('expand')}
                  disabled={aiLoading}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: dark ? '#2a2a2a' : '#f8f9fa',
                    color: 'inherit',
                    cursor: aiLoading ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    opacity: aiLoading ? 0.5 : 1,
                  }}
                  title="Expand with AI"
                >
                  📝
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App
