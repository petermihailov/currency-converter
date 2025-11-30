import clsx from 'clsx'
import type DecimalJS from 'decimal.js'
import { memo, useLayoutEffect, useRef } from 'react'

import { Currency } from './Currency'
import { getCurrencyCode } from './Input.utils.ts'
import { TextFit } from '../../../components/TextFit'
import { useSwipe } from '../../../hooks/useSwipe.ts'
import type { CurrencyCode } from '../../../types/currencies.ts'

import classes from './Input.module.css'

const animateOptions: KeyframeAnimationOptions = {
  fill: 'forwards',
  easing: 'ease-out',
  duration: 250,
  iterations: 1,
}

interface InputProps {
  position: 'left' | 'right'
  active?: boolean
  reverse?: boolean
  value: { value: DecimalJS; display: string }
  ratio: DecimalJS
  codes: CurrencyCode[]
  code: CurrencyCode
  codeOpposite: CurrencyCode
  onClick?: () => void
  onChange?: (currencyCode: CurrencyCode) => void
}

export const Input = memo(
  ({ active, codes, code, codeOpposite, reverse, value, ratio, onClick, onChange }: InputProps) => {
    const refContainer = useRef<HTMLDivElement>(null)
    const refCurrencyPrev = useRef<HTMLDivElement>(null)
    const refCurrencyCurr = useRef<HTMLDivElement>(null)
    const refPrevState = useRef({ code: code })
    const refSwipeDirection = useRef<'up' | 'down'>('up')

    useLayoutEffect(() => {
      const prev = refCurrencyPrev.current!
      const curr = refCurrencyCurr.current!

      if (refPrevState.current.code === code) {
        return
      }

      if (
        refSwipeDirection.current === 'down' &&
        refPrevState.current.code === getCurrencyCode(1, codes, code, codeOpposite)
      ) {
        curr.animate(
          [
            { transform: `translateY(-100%)`, opacity: '0' },
            { opacity: '0', offset: 0.5 },
            { transform: 'translateY(0)', opacity: '1' },
          ],
          animateOptions,
        )

        prev.animate(
          [
            { transform: `translateY(-100%)`, opacity: '1' },
            { opacity: '0', offset: 0.8 },
            { transform: `translateY(0)`, opacity: '0' },
          ],
          animateOptions,
        )
      }

      if (
        refSwipeDirection.current === 'up' &&
        refPrevState.current.code === getCurrencyCode(-1, codes, code, codeOpposite)
      ) {
        curr.animate(
          [
            { transform: `translateY(100%)`, opacity: '0' },
            { opacity: '0', offset: 0.5 },
            { transform: 'translateY(0)', opacity: '1' },
          ],
          animateOptions,
        )

        prev.animate(
          [
            { transform: 'translateY(-100%)', opacity: '1' },
            { opacity: '0', offset: 0.8 },
            { transform: `translateY(-200%)`, opacity: '0' },
          ],
          animateOptions,
        )
      }

      refPrevState.current.code = code
    }, [codes, code, codeOpposite])

    // change currency code

    useSwipe(refContainer, {
      onSwipeUp: () => {
        refSwipeDirection.current = 'up'
        onChange?.(getCurrencyCode(1, codes, code, codeOpposite))
      },
      onSwipeDown: () => {
        refSwipeDirection.current = 'down'
        onChange?.(getCurrencyCode(-1, codes, code, codeOpposite))
      },
    })

    return (
      <div
        ref={refContainer}
        className={clsx(classes.input, reverse && classes.reverse)}
        onClick={onClick}
      >
        <div className={classes.currencyList}>
          <Currency
            ref={refCurrencyCurr}
            currencyCode={code}
            oppositeCode={codeOpposite}
            ratio={ratio}
            reverse={reverse}
          />
          <Currency
            ref={refCurrencyPrev}
            className={classes.currencyPrev}
            currencyCode={refPrevState.current.code}
            oppositeCode={codeOpposite}
            ratio={ratio}
            reverse={reverse}
          />
        </div>
        <div className={clsx(classes.value, active && classes.accent)}>
          <TextFit text={value.display} reverse={reverse} />
        </div>
      </div>
    )
  },
)
