import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { BottomSheet as SpringBottomSheet } from 'react-spring-bottom-sheet'

import { GlassLayer } from '../GlassLayer'

import 'react-spring-bottom-sheet/dist/style.css'
import classes from './BottomSheet.module.css'

interface BottomSheetProps {
  open: boolean
  onDismiss: () => void
  children: ReactNode
}

export function BottomSheet({ open, onDismiss, children }: BottomSheetProps) {
  const [overlayEl, setOverlayEl] = useState<Element | null>(null)

  useEffect(() => {
    if (open) {
      // Find the overlay element after sheet opens (with small delay for DOM to be ready)
      requestAnimationFrame(() => {
        const overlay = document.querySelector('[data-rsbs-overlay]')
        setOverlayEl(overlay)
      })
    } else {
      setOverlayEl(null)
    }
  }, [open])

  return (
    <>
      <SpringBottomSheet
        open={open}
        onDismiss={onDismiss}
        snapPoints={({ maxHeight }) => [maxHeight * 0.9]}
        className={classes.sheet}
        blocking={false}
      >
        <div className={classes.content}>{children}</div>
      </SpringBottomSheet>
      {overlayEl && createPortal(<GlassLayer className={classes.glassLayer} />, overlayEl)}
    </>
  )
}
