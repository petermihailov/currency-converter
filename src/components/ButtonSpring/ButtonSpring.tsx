import clsx from 'clsx'
import React, { useEffect, useRef, memo, forwardRef } from 'react'

import { SpringPhysics } from '../../lib/SpringPhysics.ts'
import { mergeRefs } from '../../utils/merge-refs.ts'

import classes from './ButtonSpring.module.css'

export interface ButtonBaseProps extends React.HTMLAttributes<HTMLButtonElement> {
  spring?: boolean
  disabled?: boolean | undefined
}

const ButtonSpring = forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ className, spring = true, ...restProps }, ref) => {
    const refButton = useRef<HTMLButtonElement>(null)

    useEffect(() => {
      if (spring) {
        const button = refButton.current!

        const physics = new SpringPhysics({
          from: 1,
          options: {
            namespace: '--scale',
            tension: 450,
            friction: 25,
            startVelocity: 30,
          },
          onUpdate: ({ namespace, value }) => {
            button.style.setProperty(namespace, value.toString())
          },
        })

        const enter = () => {
          console.log('enter')
          physics.go(0.93)
        }

        const leave = () => {
          console.log('leave')
          physics.go(1)
        }

        ;['mousedown', 'pointerdown', 'pointerenter'].forEach((type) =>
          button.addEventListener(type, enter),
        )
        ;['mouseup', 'pointerup', 'pointerleave'].forEach((type) =>
          button.addEventListener(type, leave),
        )

        return () => {
          ;['mousedown', 'pointerdown', 'pointerenter'].forEach((type) =>
            button.removeEventListener(type, enter),
          )
          ;['mouseup', 'pointerup', 'pointerleave'].forEach((type) =>
            button.removeEventListener(type, leave),
          )
        }
      }
    }, [spring])

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
