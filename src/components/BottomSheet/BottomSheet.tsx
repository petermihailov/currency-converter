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
    <>
      <SpringBottomSheet
        open={open}
        onDismiss={onDismiss}
        snapPoints={({ maxHeight }) => [maxHeight * 0.9]}
        className={classes.sheet}
        blocking={false}
      >
        <GlassLayer className={classes.glassLayer} />
        <div className={classes.content}>{children}</div>
      </SpringBottomSheet>
    </>
  )
}
