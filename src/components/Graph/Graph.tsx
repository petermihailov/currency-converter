import DecimalJS from 'decimal.js'
import type { TouchEventHandler } from 'react'
import { useEffect, useRef, useState } from 'react'

import { getUsdRatio } from '../../api/getUsdRatio'
import type { CodesRatio, CurrencyCode } from '../../types/currencies'
import { getWeekDates } from '../../utils/dates'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { percentBetweenMinMax, minMax } from '../../utils/math'
import { getPariRatio } from '../../utils/misc'

import classes from './Graph.module.css'

interface GraphProps {
  code1: CurrencyCode
  code2: CurrencyCode
  width: number
  height: number
}

export const Graph = ({ code1, code2, width, height }: GraphProps) => {
  const refGraph = useRef<SVGSVGElement>(null)

  const [ratios, setRatios] = useState<Record<string, CodesRatio>>({})
  const [hint, setHint] = useState<{
    date: string
    ratio: number
  } | null>(null)

  const dates = Object.keys(ratios).sort()
  const padding = width / 8

  const values = dates.map((date) => ({
    date,
    ratio: getPariRatio(ratios[date], code1, code2),
  }))

  const minRatio = Math.min(...values.map(({ ratio }) => ratio))
  const maxRatio = Math.max(...values.map(({ ratio }) => ratio))

  const coordinates = values.map(({ ratio }, idx) => ({
    x: (idx / (dates.length - 1)) * (width - padding) + padding / 2,
    y:
      height - (percentBetweenMinMax(ratio, minRatio, maxRatio) * (height - padding) + padding / 2),
  }))

  const getPath = () => {
    return coordinates.reduce((path, { x, y }, idx) => {
      return path + (idx === 0 ? `M${x} ${y}` : `L${x} ${y}`)
    }, '')
  }

  const showHint: TouchEventHandler<SVGSVGElement> = (e) => {
    const rectWidth = width / coordinates.length - 1
    const x = minMax(e.touches[0].clientX, 0, width)

    let idx = coordinates.findIndex((coord) => x < coord.x + rectWidth / 2)
    idx = idx === -1 ? coordinates.length - 1 : idx

    setHint(values[idx])
  }

  const hideHint: TouchEventHandler<SVGSVGElement> = () => {
    setHint(null)
  }

  useEffect(() => {
    getWeekDates().forEach((date) => {
      getUsdRatio(date).then((data) => {
        if (data) {
          setRatios((prev) => ({ ...prev, [data.date]: data.codes }))
        }
      })
    })
  }, [])

  return (
    <div className={classes.graph}>
      <svg
        ref={refGraph}
        width={width}
        height={height}
        onTouchMove={showHint}
        onTouchEnd={hideHint}
      >
        <path d={getPath()} fill="none" stroke="var(--color-accent-2)" strokeWidth="2" />

        {coordinates.map(({ x, y }, idx) => {
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="3"
              fill="#000"
              stroke="var(--color-accent-2)"
              strokeWidth="2"
            />
          )
        })}

        {coordinates.map(({ x }, idx) => {
          const rectWidth = width / coordinates.length - 1

          return (
            <rect
              key={idx}
              x={x - rectWidth / 2}
              y={0}
              width={rectWidth}
              height={height}
              fill={hint && hint.date === values[idx].date ? '#fff2' : 'none'}
            />
          )
        })}
      </svg>
      <div className={classes.info}>
        <div>{hint && formatCurrency(code2, new DecimalJS(hint.ratio))}</div>
        <div>{hint && formatDate(hint.date)}</div>
      </div>
    </div>
  )
}
