import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type TextareaHTMLAttributes,
} from 'react'
import {
  applySuggestion,
  getSuggestions,
  getTokenAt,
} from '../services/syntaxSuggestions'

type Props = {
  id?: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  className?: string
  'aria-label'?: string
} & Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'onChange' | 'rows' | 'placeholder' | 'className' | 'id'
>

export function SyntaxAutocompleteInput({
  id,
  value,
  onChange,
  rows = 4,
  placeholder,
  className = '',
  'aria-label': ariaLabel,
  ...rest
}: Props) {
  const listId = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [caret, setCaret] = useState(0)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [composing, setComposing] = useState(false)

  const syncCaret = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    setCaret(el.selectionStart ?? el.value.length)
  }, [])

  const suggestions = useMemo(() => {
    if (composing) return []
    return getSuggestions(value, caret, 8)
  }, [value, caret, composing])

  useEffect(() => {
    setOpen(suggestions.length > 0)
    setActiveIndex(0)
  }, [suggestions])

  const choose = useCallback(
    (suggestion: string) => {
      const el = textareaRef.current
      const currentCaret = el?.selectionStart ?? caret
      const next = applySuggestion(value, currentCaret, suggestion)
      onChange(next.value)
      setOpen(false)
      requestAnimationFrame(() => {
        const node = textareaRef.current
        if (!node) return
        node.focus()
        node.setSelectionRange(next.caret, next.caret)
        setCaret(next.caret)
      })
    },
    [caret, onChange, value],
  )

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (composing) return
    if (!open || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
      return
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      // Only hijack Enter when a suggestion is highlighted and token incomplete
      const { token } = getTokenAt(value, textareaRef.current?.selectionStart ?? caret)
      if (token.length >= 1) {
        e.preventDefault()
        choose(suggestions[activeIndex] ?? suggestions[0]!)
      }
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      choose(suggestions[activeIndex] ?? suggestions[0]!)
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    }
  }

  const activeId = open && suggestions[activeIndex] ? `${listId}-opt-${activeIndex}` : undefined

  return (
    <div className="relative">
      <textarea
        {...rest}
        id={id}
        ref={textareaRef}
        value={value}
        rows={rows}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-controls={open ? listId : undefined}
        aria-activedescendant={activeId}
        aria-expanded={open}
        role="combobox"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        onCompositionStart={() => setComposing(true)}
        onCompositionEnd={() => setComposing(false)}
        onChange={(e) => {
          onChange(e.target.value)
          setCaret(e.target.selectionStart ?? e.target.value.length)
        }}
        onKeyUp={syncCaret}
        onClick={syncCaret}
        onSelect={syncCaret}
        onKeyDown={onKeyDown}
        className={
          className ||
          'w-full rounded-xl border border-slate-300 bg-white p-3 font-mono text-base leading-relaxed text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100'
        }
      />

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Syntax suggestions"
          className="mt-1 max-h-[40vh] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900"
        >
          {suggestions.map((item, index) => {
            const selected = index === activeIndex
            return (
              <li key={item} role="presentation">
                <button
                  type="button"
                  id={`${listId}-opt-${index}`}
                  role="option"
                  aria-selected={selected}
                  className={[
                    'flex min-h-11 w-full items-center px-3 text-left font-mono text-sm',
                    selected
                      ? 'bg-teal-700 text-white dark:bg-teal-600'
                      : 'text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800',
                  ].join(' ')}
                  onMouseDown={(e) => {
                    // Prevent textarea blur before click registers
                    e.preventDefault()
                  }}
                  onClick={() => choose(item)}
                >
                  {item}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
