import { useCallback, useEffect, useRef, useState } from 'react'

import classes from './SearchInput.module.css'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search currencies...',
  debounceMs = 300,
}: SearchInputProps) => {
  const [localValue, setLocalValue] = useState(value)
  const timeoutRef = useRef<number>()

  // Синхронизация с внешним value при его изменении
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = useCallback(
    (newValue: string) => {
      setLocalValue(newValue)

      // Очищаем предыдущий таймер
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Устанавливаем новый таймер для debounce
      timeoutRef.current = window.setTimeout(() => {
        onChange(newValue)
      }, debounceMs)
    },
    [onChange, debounceMs],
  )

  const handleClear = useCallback(() => {
    setLocalValue('')
    onChange('')

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [onChange])

  // Очищаем таймер при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={classes.searchInput}>
      <svg className={classes.icon} fill="none" viewBox="0 0 16 16">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
        />
      </svg>

      <input
        className={classes.input}
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="false"
      />

      {localValue && (
        <button className={classes.clear} onClick={handleClear} type="button" aria-label="Clear">
          <svg fill="none" viewBox="0 0 16 16">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 4 4 12M4 4l8 8"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
