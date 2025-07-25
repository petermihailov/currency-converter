import clsx from 'clsx'
import { useLayoutEffect, useRef } from 'react'

import classes from './TextFit.module.css'

interface TextFitProps {
  text?: string
  'data-testid'?: string
}

export const TextFit = (props: TextFitProps) => {
  const text = props.text || ''
  const refSvg = useRef<SVGSVGElement | null>(null)
  const refSpan = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const span = refSpan.current!
    span.innerText = text
    refSvg.current?.setAttribute('viewBox', `0 0 ${span.clientWidth + 1} 13`)
  }, [text])

  return (
    <>
      <svg ref={refSvg} className={clsx(classes.input)} viewBox="0 0 0 0">
        <text data-testid={props['data-testid']} x="0" y={12}>
          {text}
        </text>
      </svg>
      <span aria-hidden="true" ref={refSpan} className={clsx(classes.hiddenSpan)} />
    </>
  )
}
