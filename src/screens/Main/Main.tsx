import DecimalJS, { Decimal } from 'decimal.js'
import { useEffect, useState, useCallback, useRef } from 'react'

import { Calculator } from './Calculator'
import type { Action as CalculatorAction } from './Calculator/store/reducer.ts'
import { Input } from './Input'
import { getUsdRatio } from '../../api/getUsdRatio'
import { ButtonSpring } from '../../components/ButtonSpring'
import { Tabs } from '../../components/Tabs/Tabs'
import { TextFit } from '../../components/TextFit'
import { CURRENCY } from '../../constants'
import { useAppStorage } from '../../store/reducer'
import type { CurrencyCode } from '../../types/currencies.ts'
import { toISODate } from '../../utils/dates.ts'
import { displayToValue, formatDate, formatNumberInput } from '../../utils/formatters'

import classes from './Main.module.css'

interface MainScreenProps {
  goCurrencies: () => void
}

export const MainScreen = ({ goCurrencies }: MainScreenProps) => {
  const [state, dispatch] = useAppStorage()
  const [left, setLeftUnsafe] = useState({ value: new Decimal('0'), display: '0' })
  const [right, setRightUnsafe] = useState({ value: new Decimal('0'), display: '0' })

  const setRight = useCallback((next: { value: Decimal; display: string }) => {
    setRightUnsafe((prev) =>
      prev.display === next.display && prev.value.eq(next.value) ? prev : next,
    )
  }, [])

  const setLeft = useCallback((next: { value: Decimal; display: string }) => {
    setLeftUnsafe((prev) =>
      prev.display === next.display && prev.value.eq(next.value) ? prev : next,
    )
  }, [])

  const calculatorDispatchRef = useRef<React.Dispatch<CalculatorAction>>()

  const refSwapButton = useRef<HTMLButtonElement>(null)

  const swap = useCallback(() => {
    refSwapButton.current!.animate(
      [
        { transform: 'scale(var(--scale, 1.0)) rotate(0deg)' },
        { transform: 'scale(var(--scale, 1.0)) rotate(180deg)' },
      ],
      {
        fill: 'forwards',
        duration: 225,
        easing: 'ease-out',
      },
    )

    dispatch({ type: 'swap' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getRatio = useCallback(
    (code1: CurrencyCode, code2: CurrencyCode) => {
      if (state.rates) {
        const c1 = new DecimalJS(state.rates[code1])
        const c2 = new DecimalJS(state.rates[code2])

        return c1.div(c2)
      }

      return new DecimalJS(0)
    },
    [state.rates],
  )

  useEffect(() => {
    if (state.active === 'right') {
      const ratio = getRatio(state.leftCode, state.rightCode)
      const target = right.value.mul(ratio)
      setLeft({
        value: target,
        display: formatNumberInput(target),
      })
    } else {
      const ratio = getRatio(state.rightCode, state.leftCode)
      const target = left.value.mul(ratio)
      setRight({
        value: target,
        display: formatNumberInput(target),
      })
    }
  }, [
    getRatio,
    left.value,
    right.value,
    setLeft,
    setRight,
    state.active,
    state.leftCode,
    state.rightCode,
  ])

  useEffect(() => {
    // пробуем найти rates в кэше за сегодня
    if (state.date === toISODate(new Date())) {
      return
    }

    getUsdRatio().then((data) => {
      if (data) {
        dispatch({ type: 'setRates', payload: data })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={classes.app}>
      <Tabs className={classes.tabs} onCurrencyClick={goCurrencies} />

      <div className={classes.display}>
        <Input
          position="left"
          active={state.active === 'left'}
          value={left}
          code={state.leftCode}
          codes={state.favorites}
          codeOpposite={state.rightCode}
          onClick={() => {
            if (state.active !== 'left') {
              setRightUnsafe((prev) => ({
                ...prev,
                value: new Decimal(displayToValue(prev.display)),
              }))
              dispatch({ type: 'setActive', payload: 'left' })
              calculatorDispatchRef.current?.({
                type: 'setValue',
                payload: {
                  currentValue: left.value,
                  currentDisplay: left.display,
                },
              })
            }
          }}
          ratio={getRatio(state.rightCode, state.leftCode)}
          onChange={(code) => {
            dispatch({ type: 'setLeftCode', payload: code })
          }}
        />

        <Input
          position="right"
          reverse
          active={state.active === 'right'}
          value={right}
          code={state.rightCode}
          codes={state.favorites}
          codeOpposite={state.leftCode}
          onClick={() => {
            if (state.active !== 'right') {
              setLeftUnsafe((prev) => ({
                ...prev,
                value: new Decimal(displayToValue(prev.display)),
              }))
              dispatch({ type: 'setActive', payload: 'right' })
              calculatorDispatchRef.current?.({
                type: 'setValue',
                payload: {
                  currentValue: right.value,
                  currentDisplay: right.display,
                },
              })
            }
          }}
          ratio={getRatio(state.leftCode, state.rightCode)}
          onChange={(code) => {
            dispatch({ type: 'setRightCode', payload: code })
          }}
        />

        <ButtonSpring ref={refSwapButton} className={classes.swapButton} onClick={swap}>
          <svg fill="none" viewBox="0 0 12 12">
            <path
              fill="currentColor"
              d="M11.25 4.75A.75.75 0 0 0 12 4V.75a.75.75 0 0 0-1.5 0v1.2814C9.4012.7865 7.7928.0001 6 .0001 3.179 0 .8144 1.9462.1721 4.5682a.75.75 0 0 0 1.457.357C2.1108 2.9584 3.886 1.5 6 1.5c1.4488 0 2.7385.6844 3.5623 1.75H8.25a.75.75 0 0 0 0 1.5h3Zm.0283 1.7712a.75.75 0 0 1 .5507.9065C11.1882 10.0518 8.8226 12 6 12c-1.7927 0-3.4012-.7865-4.5-2.0315V11.25a.75.75 0 0 1-1.5 0V8a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5H2.4377C3.2614 9.8155 4.5512 10.5 6 10.5c2.1152 0 3.8912-1.46 4.3718-3.4282a.75.75 0 0 1 .9065-.5507Z"
            ></path>
          </svg>
        </ButtonSpring>

        <div className={classes.info}>
          <span className={classes.currencyName}>
            <TextFit text={CURRENCY[state.leftCode].name} />
          </span>

          <span className={classes.currencyDate}>{formatDate(state.date)}</span>

          <span className={classes.currencyName}>
            <TextFit text={CURRENCY[state.rightCode].name} />
          </span>
        </div>
      </div>

      <Calculator
        className={classes.calculator}
        passDispatch={(dispatch) => (calculatorDispatchRef.current = dispatch)}
        onChange={({ value, display }) => {
          if (state.active === 'right') {
            setRight({ value, display })
            // convert(value)
          } else {
            setLeft({ value, display })
            // convert(value)
          }
        }}
      />
    </div>
  )
}
