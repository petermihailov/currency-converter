import { useEffect, useState, useCallback, useRef } from 'react'

import { Calculator } from './Calculator'
import { getUsdRatio } from '../../api/getUsdRatio'
import { ButtonSpring } from '../../components/ButtonSpring'
import { Input } from '../../components/Input'
import { Tabs } from '../../components/Tabs/Tabs'
import { TextFit } from '../../components/TextFit'
import { CURRENCY } from '../../constants'
import { useAppStorage } from '../../store/reducer'
import { toISODate } from '../../utils/dates.ts'
import { formatDate } from '../../utils/formatters'

import classes from './Main.module.css'

interface MainScreenProps {
  goCurrencies: () => void
}

export const MainScreen = ({ goCurrencies }: MainScreenProps) => {
  const [state, dispatch] = useAppStorage()
  const [left, setLeft] = useState('0')
  const [right, setRight] = useState('0')

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

  // const changeActiveInput = useCallback((active: 'left' | 'right') => {
  //   if (active === 'left') {
  //     setLeft()
  //   } else {
  //     setRight()
  //   }
  //
  //   // setActiveInput(active)
  // }, [])

  // const inputLeft = useCallback(
  //   (textValue: string) => {
  //     setCurrencyLeft((prev) => ({ ...prev, textValue }))
  //     setCurrencyRight((prev) => ({
  //       ...prev,
  //       textValue: convert(textValue, currencyLeft.code, currencyRight.code, ratio),
  //     }))
  //   },
  //   [currencyLeft.code, currencyRight.code, ratio],
  // )
  //
  // const inputRight = useCallback(
  //   (textValue: string) => {
  //     setCurrencyRight((prev) => ({ ...prev, textValue }))
  //     setCurrencyLeft((prev) => ({
  //       ...prev,
  //       textValue: convert(textValue, currencyRight.code, currencyLeft.code, ratio),
  //     }))
  //   },
  //   [currencyLeft.code, currencyRight.code, ratio],
  // )

  // const onChangeLeft = useCallback(
  //   (code: CurrencyCode) => {
  //     setCurrencyLeft((prev) => ({ ...prev, code }))
  //
  //     if (activeInput === 'right') {
  //       setCurrencyLeft((prev) => ({
  //         ...prev,
  //         textValue: convert(currencyRight.textValue, currencyRight.code, code, ratio),
  //       }))
  //     } else {
  //       setCurrencyRight((prev) => ({
  //         ...prev,
  //         textValue: convert(currencyLeft.textValue, code, currencyRight.code, ratio),
  //       }))
  //     }
  //   },
  //   [activeInput, currencyLeft.textValue, currencyRight.code, currencyRight.textValue, ratio],
  // )
  //
  // const onChangeRight = useCallback(
  //   (code: CurrencyCode) => {
  //     setCurrencyRight((prev) => ({ ...prev, code }))
  //
  //     if (activeInput === 'right') {
  //       setCurrencyLeft((prev) => ({
  //         ...prev,
  //         textValue: convert(currencyRight.textValue, code, currencyLeft.code, ratio),
  //       }))
  //     } else {
  //       setCurrencyRight((prev) => ({
  //         ...prev,
  //         textValue: convert(currencyLeft.textValue, currencyLeft.code, code, ratio),
  //       }))
  //     }
  //   },
  //   [activeInput, currencyLeft.code, currencyLeft.textValue, currencyRight.textValue, ratio],
  // )

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

  // /* Storage sync */
  // useEffect(() => {
  //   pairStorage.update({
  //     left: currencyLeft.code,
  //     right: currencyRight.code,
  //     active: activeInput,
  //   })
  // }, [currencyRight.code, currencyLeft.code, activeInput])

  // /* Change codes keyboard */
  // useEffect(() => {
  //   const code: CurrencyCode = activeInput === 'left' ? currencyLeft.code : currencyRight.code
  //   const codeOpposite: CurrencyCode =
  //     activeInput === 'left' ? currencyRight.code : currencyLeft.code
  //
  //   const onChange = activeInput === 'left' ? onChangeLeft : onChangeRight
  //   const onChangeOpposite = activeInput === 'left' ? onChangeRight : onChangeLeft
  //
  //   const listener = (e: KeyboardEvent) => {
  //     if (e.key === 'r') {
  //       swap()
  //     }
  //
  //     if (e.shiftKey) {
  //       if (e.code === 'ArrowUp') {
  //         onChangeOpposite(getCurrencyCode(1, codeOpposite, code))
  //       }
  //
  //       if (e.code === 'ArrowDown') {
  //         onChangeOpposite(getCurrencyCode(-1, codeOpposite, code))
  //       }
  //     } else {
  //       if (e.code === 'ArrowUp') {
  //         onChange(getCurrencyCode(1, code, codeOpposite))
  //       }
  //
  //       if (e.code === 'ArrowDown') {
  //         onChange(getCurrencyCode(-1, code, codeOpposite))
  //       }
  //     }
  //   }
  //
  //   document.body.addEventListener('keydown', listener)
  //
  //   return () => {
  //     document.body.removeEventListener('keydown', listener)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeInput, currencyLeft.code, currencyRight.code])

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
          onClick={() => dispatch({ type: 'setActive', payload: 'left' })}
          ratio={null}
          onChange={(code) => dispatch({ type: 'setLeftCode', payload: code })}
        />

        <Input
          position="right"
          reverse
          active={state.active === 'right'}
          value={right}
          code={state.rightCode}
          codes={state.favorites}
          codeOpposite={state.leftCode}
          onClick={() => dispatch({ type: 'setActive', payload: 'right' })}
          ratio={null}
          onChange={(code) => dispatch({ type: 'setRightCode', payload: code })}
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
        onChange={state.active === 'right' ? setRight : setLeft}
      />
    </div>
  )
}
