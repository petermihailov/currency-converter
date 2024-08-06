import { useEffect, useState, useCallback, useRef } from 'react'

import { getUsdRatio } from './api/getUsdRatio'
import { ButtonSpring } from './components/ButtonSpring'
import { Calculator } from './components/Calculator'
import { Input } from './components/Input'
import { getCurrencyCode } from './components/Input/Input.utils.ts'
import { CURRENCY } from './constants'
import { Storage } from './lib/LocalStorage'
import type { CodesRatio, CurrencyCode, DateRatio } from './types/currencies'
import { formatDate } from './utils/formatters'
import { getPariRatio } from './utils/misc'

import classes from './App.module.css'

const pairStorage = new Storage<{
  right: CurrencyCode
  left: CurrencyCode
  active: 'left' | 'right'
}>('pair', {
  right: 'amd',
  left: 'rub',
  active: 'right',
})

const pairCache = pairStorage.get()

const convert = (
  textValue: string,
  code: CurrencyCode,
  oppositeCode: CurrencyCode,
  ratio: DateRatio,
): string => {
  const value = parseFloat(textValue) * getPariRatio(ratio.codes, code, oppositeCode)

  if (!Number.isNaN(value)) {
    return String(Number(value.toFixed(2)))
  }

  return '0'
}

interface CurrencyType {
  code: CurrencyCode
  textValue: string
}

export const App = () => {
  const [currencyRight, setCurrencyRight] = useState<CurrencyType>({
    code: pairCache!.right,
    textValue: '0',
  })

  const [currencyLeft, setCurrencyLeft] = useState<CurrencyType>({
    code: pairCache!.left,
    textValue: '0',
  })

  const [ratio, setRatio] = useState<DateRatio>({
    date: '',
    codes: {} as CodesRatio,
  })

  const [activeInput, setActiveInput] = useState<'left' | 'right'>(pairCache!.active)

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

    const [right, left] = [currencyLeft, currencyRight]
    right.textValue = String(Number(Number(right.textValue).toFixed(2)))

    setCurrencyRight(right)
    setCurrencyLeft(left)
  }, [currencyLeft, currencyRight])

  const changeActiveInput = useCallback((active: 'left' | 'right') => {
    if (active === 'left') {
      setCurrencyLeft((prev) => ({
        ...prev,
        textValue: String(Number(Number(prev.textValue).toFixed(2))),
      }))
    } else {
      setCurrencyRight((prev) => ({
        ...prev,
        textValue: String(Number(Number(prev.textValue).toFixed(2))),
      }))
    }

    setActiveInput(active)
  }, [])

  const inputLeft = useCallback(
    (textValue: string) => {
      setCurrencyLeft((prev) => ({ ...prev, textValue }))
      setCurrencyRight((prev) => ({
        ...prev,
        textValue: convert(textValue, currencyLeft.code, currencyRight.code, ratio),
      }))
    },
    [currencyLeft.code, currencyRight.code, ratio],
  )

  const inputRight = useCallback(
    (textValue: string) => {
      setCurrencyRight((prev) => ({ ...prev, textValue }))
      setCurrencyLeft((prev) => ({
        ...prev,
        textValue: convert(textValue, currencyRight.code, currencyLeft.code, ratio),
      }))
    },
    [currencyLeft.code, currencyRight.code, ratio],
  )

  const onChangeLeft = useCallback(
    (code: CurrencyCode) => {
      setCurrencyLeft((prev) => ({ ...prev, code }))

      if (activeInput === 'right') {
        setCurrencyLeft((prev) => ({
          ...prev,
          textValue: convert(currencyRight.textValue, currencyRight.code, code, ratio),
        }))
      } else {
        setCurrencyRight((prev) => ({
          ...prev,
          textValue: convert(currencyLeft.textValue, code, currencyRight.code, ratio),
        }))
      }
    },
    [activeInput, currencyLeft.textValue, currencyRight.code, currencyRight.textValue, ratio],
  )

  const onChangeRight = useCallback(
    (code: CurrencyCode) => {
      setCurrencyRight((prev) => ({ ...prev, code }))

      if (activeInput === 'right') {
        setCurrencyLeft((prev) => ({
          ...prev,
          textValue: convert(currencyRight.textValue, code, currencyLeft.code, ratio),
        }))
      } else {
        setCurrencyRight((prev) => ({
          ...prev,
          textValue: convert(currencyLeft.textValue, currencyLeft.code, code, ratio),
        }))
      }
    },
    [activeInput, currencyLeft.code, currencyLeft.textValue, currencyRight.textValue, ratio],
  )

  /* Get ratio */
  useEffect(() => {
    getUsdRatio().then((data) => {
      if (data) {
        setRatio(data)
      }
    })
  }, [])

  /* Storage sync */
  useEffect(() => {
    pairStorage.update({
      left: currencyLeft.code,
      right: currencyRight.code,
      active: activeInput,
    })
  }, [currencyRight.code, currencyLeft.code, activeInput])

  /* Change codes keyboard */
  useEffect(() => {
    const code: CurrencyCode = activeInput === 'left' ? currencyLeft.code : currencyRight.code
    const codeOpposite: CurrencyCode =
      activeInput === 'left' ? currencyRight.code : currencyLeft.code

    const onChange = activeInput === 'left' ? onChangeLeft : onChangeRight
    const onChangeOpposite = activeInput === 'left' ? onChangeRight : onChangeLeft

    const listener = (e: KeyboardEvent) => {
      if (e.key === 'r') {
        swap()
      }

      if (e.shiftKey) {
        if (e.code === 'ArrowUp') {
          onChangeOpposite(getCurrencyCode(1, codeOpposite, code))
        }

        if (e.code === 'ArrowDown') {
          onChangeOpposite(getCurrencyCode(-1, codeOpposite, code))
        }
      } else {
        if (e.code === 'ArrowUp') {
          onChange(getCurrencyCode(1, code, codeOpposite))
        }

        if (e.code === 'ArrowDown') {
          onChange(getCurrencyCode(-1, code, codeOpposite))
        }
      }
    }

    document.body.addEventListener('keydown', listener)

    return () => {
      document.body.removeEventListener('keydown', listener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeInput, currencyLeft.code, currencyRight.code])

  return (
    <div className={classes.app}>
      <div className={classes.display}>
        <Input
          active={activeInput === 'left'}
          value={currencyLeft.textValue}
          code={currencyLeft.code}
          codeOpposite={currencyRight.code}
          onClick={() => changeActiveInput('left')}
          ratio={ratio}
          onChange={onChangeLeft}
        />

        <Input
          reverse
          active={activeInput === 'right'}
          value={currencyRight.textValue}
          code={currencyRight.code}
          codeOpposite={currencyLeft.code}
          onClick={() => changeActiveInput('right')}
          ratio={ratio}
          onChange={onChangeRight}
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
          <span className={classes.currencyName}>{CURRENCY[currencyLeft.code].name}</span>
          <span className={classes.currencyDate}>{formatDate(ratio.date)}</span>
          <span className={classes.currencyName}>{CURRENCY[currencyRight.code].name}</span>
        </div>
      </div>

      <Calculator
        className={classes.calculator}
        name={activeInput + (activeInput === 'left' ? currencyLeft.code : currencyRight.code)}
        textValue={activeInput === 'left' ? currencyLeft.textValue : currencyRight.textValue}
        onTextChange={activeInput === 'left' ? inputLeft : inputRight}
      />
    </div>
  )
}
