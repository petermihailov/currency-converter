import clsx from 'clsx'
import React, { useEffect, useRef, memo, forwardRef } from 'react'

import { SpringPhysics } from '../../lib/SpringPhysics.ts'
import { mergeRefs } from '../../utils/merge-refs.ts'

import classes from './ButtonSpring.module.css'

export interface ButtonBaseProps extends React.HTMLAttributes<HTMLButtonElement> {
  pressed?: boolean | null
  disabled?: boolean
}

const ButtonSpring = forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ className, pressed, ...restProps }, ref) => {
    const refButton = useRef<HTMLButtonElement>(null)

    const refPhysics = useRef(
      new SpringPhysics({
        from: 1,
        options: {
          namespace: '--scale',
          tension: 450,
          friction: 25,
          startVelocity: 30,
        },
        onUpdate: ({ namespace, value }) => {
          refButton.current?.style.setProperty(namespace, value.toString())
        },
      }),
    )

    useEffect(() => {
      const button = refButton.current
      if (!button) return

      const physics = refPhysics.current

      const enter = () => physics.go(0.93)
      const leave = () => physics.go(1)

      button.addEventListener('pointerdown', enter)
      button.addEventListener('pointerup', leave)
      button.addEventListener('pointerleave', leave)

      return () => {
        button.removeEventListener('pointerdown', enter)
        button.removeEventListener('pointerup', leave)
        button.removeEventListener('pointerleave', leave)
      }
    }, [])

    useEffect(() => {
      const physics = refPhysics.current

      if (pressed === undefined || pressed === null) {
        return
      }

      if (pressed) {
        physics.go(0.93)
      } else {
        physics.go(1)
      }
    }, [pressed])

    return (
      <button
        ref={mergeRefs([ref, refButton])}
        className={clsx(className, classes.scale)}
        {...restProps}
      />
    )
  },
)

export default memo(ButtonSpring)
