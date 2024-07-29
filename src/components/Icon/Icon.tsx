import clsx from 'clsx'
import { memo } from 'react'

import type { CalculatorIconName } from '../../icons/Calculator'

import classes from './Icon.module.css'

export interface IconProps {
  className?: string
  name: CalculatorIconName
}

export const Icon = memo(({ name, className }: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      className={clsx(className, classes.icon)}
      fill="currentColor"
      viewBox="0 0 28 28"
    >
      <use href={`#${name}`} />
    </svg>
  )
})
