import clsx from 'clsx'
import { useLayoutEffect, useRef } from 'react'

import classes from './TextFit.module.css'

interface TextFitProps {
  text?: string
  reverse?: boolean
}

export const TextFit = (props: TextFitProps) => {
  const text = props.text || ''
  const refSvg = useRef<SVGSVGElement | null>(null)
  const refSpan = useRef<HTMLSpanElement>(null)
  const refText = useRef<SVGTextElement>(null)
  const reverse = props.reverse

  useLayoutEffect(() => {
    const span = refSpan.current!
    span.innerText = text
    refSvg.current?.setAttribute('viewBox', `0 0 ${span.clientWidth + 5} 15`)

    if (reverse) {
      refText.current?.setAttribute('text-anchor', 'end')
      refText.current?.setAttribute('x', String(span.clientWidth + 5))
    }
  }, [reverse, text])

  return (
    <>
      <svg ref={refSvg} className={clsx(classes.input)} viewBox="0 0 0 0">
        <text ref={refText} x={0} y={12}>
          {text}
        </text>
      </svg>
      <span aria-hidden="true" ref={refSpan} className={clsx(classes.hiddenSpan)} />
    </>
  )
}
