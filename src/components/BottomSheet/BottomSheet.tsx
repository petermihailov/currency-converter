import type { ReactNode } from 'react'
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
  return (
    <SpringBottomSheet
      open={open}
      onDismiss={onDismiss}
      defaultSnap={({ maxHeight }) => maxHeight * 0.9}
      snapPoints={({ maxHeight }) => [maxHeight * 0.9]}
      blocking={false}
      className={classes.sheet}
      scrollLocking
    >
      <GlassLayer />
      <div className={classes.content}>{children}</div>
    </SpringBottomSheet>
  )
}
