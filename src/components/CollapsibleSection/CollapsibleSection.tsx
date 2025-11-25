import type { ReactNode } from 'react'
import { useEffect, useId, useRef, useState } from 'react'

import { Storage } from '../../lib/LocalStorage'

import classes from './CollapsibleSection.module.css'

interface CollapsibleSectionProps {
  title: string
  storageKey: string
  defaultExpanded?: boolean
  itemCount?: number
  children: ReactNode
  className?: string
  collapsible?: boolean
}

export const CollapsibleSection = ({
  title,
  storageKey,
  defaultExpanded = true,
  itemCount,
  children,
  className,
  collapsible = true,
}: CollapsibleSectionProps) => {
  const sectionId = useId()
  const contentRef = useRef<HTMLDivElement>(null)
  const storageRef = useRef(new Storage<boolean>(storageKey, defaultExpanded))

  const [isExpanded, setIsExpanded] = useState(() => storageRef.current.get())
  const [contentHeight, setContentHeight] = useState<number | null>(null)

  // Сохраняем состояние в localStorage при изменении
  useEffect(() => {
    storageRef.current.set(isExpanded)
  }, [isExpanded])

  // Измеряем высоту контента для плавной анимации
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [children, isExpanded])

  const toggleExpanded = () => {
    if (collapsible) {
      setIsExpanded((prev) => !prev)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (collapsible && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      toggleExpanded()
    }
  }

  const displayTitle = itemCount !== undefined ? `${title} (${itemCount})` : title

  return (
    <div className={className}>
      <button
        className={classes.header}
        onClick={toggleExpanded}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls={sectionId}
        type="button"
        disabled={!collapsible}
        style={{ cursor: collapsible ? 'pointer' : 'default' }}
      >
        <h2 className={classes.title}>{displayTitle}</h2>
        {collapsible && (
          <span className={classes.iconWrapper} aria-hidden="true">
            <svg
              className={classes.icon}
              data-expanded={isExpanded}
              viewBox="0 0 16 16"
              fill="none"
            >
              {/* Horizontal line (always visible) */}
              <line
                x1="4"
                y1="8"
                x2="12"
                y2="8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Vertical line (hidden when expanded) */}
              <line
                className={classes.iconVertical}
                x1="8"
                y1="4"
                x2="8"
                y2="12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </button>

      <div
        id={sectionId}
        ref={contentRef}
        className={classes.content}
        role="region"
        aria-labelledby={`${sectionId}-label`}
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : '0',
        }}
      >
        {children}
      </div>
    </div>
  )
}
