import clsx from 'clsx'

import classes from './GlassLayer.module.css'

export function GlassLayer({ className }: { className?: string }) {
  return <div className={clsx(className, classes.glassLayer)} />
}
