import clsx from 'clsx'
import { memo, useLayoutEffect, useRef } from 'react'

import { Currency } from './Currency'
import { getCurrencyCode } from './Input.utils.ts'
import { useSwipe } from '../../hooks/useSwipe'
import type { CurrencyCode, DateRatio } from '../../types/currencies'
import { formatNumberInput, formatNumberInputActive } from '../../utils/formatters'
import { TextFit } from '../TextFit'

import classes from './Input.module.css'

const animateOptions: KeyframeAnimationOptions = {
  fill: 'forwards',
  easing: 'ease-out',
  duration: 250,
}

interface InputProps {
  active?: boolean
  reverse?: boolean
  value: string
  ratio: DateRatio
  code: CurrencyCode
  codeOpposite: CurrencyCode
  onClick?: () => void
  onChange?: (currencyCode: CurrencyCode) => void
}

export const Input = memo(
  ({ active, code, codeOpposite, reverse, value = '', ratio, onClick, onChange }: InputProps) => {
    const refContainer = useRef<HTMLDivElement>(null)
    const refCurrencyPrev = useRef<HTMLDivElement>(null)
    const refCurrencyCurr = useRef<HTMLDivElement>(null)
    const refPrevState = useRef({ code: code })

    useSwipe(refContainer, {
      onSwipeUp: () => onChange?.(getCurrencyCode(1, code, codeOpposite)),
      onSwipeDown: () => onChange?.(getCurrencyCode(-1, code, codeOpposite)),
    })

    useLayoutEffect(() => {
      const prev = refCurrencyPrev.current!
      const curr = refCurrencyCurr.current!

      if (refPrevState.current.code === getCurrencyCode(1, code, codeOpposite)) {
        curr.animate(
          [
            { transform: 'translateY(-100%)', opacity: '0' },
            { transform: 'translateY(0)', opacity: '1' },
          ],
          animateOptions,
        )

        prev.animate(
          [
            { transform: 'translateY(-100%)', opacity: '1' },
            { transform: 'translateY(0)', opacity: '0' },
          ],
          animateOptions,
        )
      }

      if (refPrevState.current.code === getCurrencyCode(-1, code, codeOpposite)) {
        curr.animate(
          [
            { transform: 'translateY(100%)', opacity: '0' },
            { transform: 'translateY(0)', opacity: '1' },
          ],
          animateOptions,
        )

        prev.animate(
          [
            { transform: 'translateY(-100%)', opacity: '1' },
            { transform: 'translateY(-200%)', opacity: '0' },
          ],
          animateOptions,
        )
      }

      refPrevState.current.code = code
    }, [code, codeOpposite])

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
          <TextFit text={active ? formatNumberInputActive(value) : formatNumberInput(value)} />
        </div>
      </div>
    )
  },
)
