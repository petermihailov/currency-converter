import clsx from 'clsx'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { ButtonSpring } from '../ButtonSpring'
import { Icon } from '../Icon'

import classes from './Calculator.module.css'

interface CalculatorProps {
  className?: string
  name: string
  textValue?: string
  onTextChange: (value: string) => void
}

type Operator = '+' | '-' | '*' | '/'

const math: Record<Operator, (a: number, b?: number) => number> = {
  '+': (a, b = 0) => a + b,
  '-': (a, b = 0) => a - b,
  '*': (a, b = 1) => a * b,
  '/': (a, b = 1) => a / b,
}

export const Calculator = ({ className, name, textValue = '0', onTextChange }: CalculatorProps) => {
  const [displayedOperator, setDisplayedOperator] = useState<Operator | null>(null)

  const lastOperation = useRef<{
    value1: number | null
    value2: number | null
    pressedResult: boolean
    operator: Operator | null
  }>({
    value1: null,
    value2: null,
    pressedResult: false,
    operator: null,
  })

  const needClear = useRef(true)

  const reset = useCallback(() => {
    onTextChange('0')
    setDisplayedOperator(null)
    needClear.current = true
    lastOperation.current = {
      value1: null,
      value2: null,
      pressedResult: false,
      operator: null,
    }
  }, [onTextChange])

  const inputNumber = useCallback(
    (value: string) => {
      if (lastOperation.current.pressedResult) {
        setDisplayedOperator(null)
        needClear.current = true
        lastOperation.current = {
          value1: null,
          value2: null,
          pressedResult: false,
          operator: null,
        }
      }

      if (textValue === '0' && value === '0') {
        return
      }

      const valueStr = needClear.current || textValue === '0' ? value : textValue + value

      needClear.current = false
      onTextChange(valueStr)
    },
    [textValue, onTextChange],
  )

  const backspace = useCallback(() => {
    const valueStr = textValue.slice(0, -1) || '0'
    onTextChange(valueStr)
  }, [textValue, onTextChange])

  const getResult = useCallback(() => {
    let result = null
    const value = parseFloat(textValue)

    if (lastOperation.current.operator && lastOperation.current.value1 !== null) {
      if (lastOperation.current.pressedResult && lastOperation.current.value2 !== null) {
        result = math[lastOperation.current.operator](
          lastOperation.current.value1,
          lastOperation.current.value2,
        )
        lastOperation.current.value1 = result
      } else {
        result = math[lastOperation.current.operator](lastOperation.current.value1, value)
        lastOperation.current.value1 = result
        lastOperation.current.value2 = value
      }

      if (result !== null && !Number.isNaN(result)) {
        onTextChange(String(result))
      }
    }

    lastOperation.current.pressedResult = true
    setDisplayedOperator(null)
  }, [onTextChange, textValue])

  const addOperation = useCallback(
    (operator: Operator) => {
      // return if operator is already pressed
      if (lastOperation.current.operator !== null && operator === lastOperation.current.operator) {
        return
      }

      // show minus sign if it's the first value selected and finally return
      if (operator === '-' && textValue === '0') {
        onTextChange('-')
        needClear.current = false
        return
      }
      // return if minus operator pressed and it's already printed on screen
      else if (textValue === '-') {
        return
      }
      // return if minus operator pressed and history already has equal sign
      else if (
        operator === '-' &&
        lastOperation.current.operator === '-' &&
        lastOperation.current.pressedResult
      ) {
        return
      }

      if (!lastOperation.current.operator) {
        lastOperation.current = {
          ...lastOperation.current,
          value1: parseFloat(textValue),
        }
      } else {
        if (lastOperation.current.operator && needClear.current) {
          lastOperation.current.operator = operator
          setDisplayedOperator(operator)
          return
        }

        if (
          lastOperation.current.pressedResult &&
          lastOperation.current.value1 !== null &&
          lastOperation.current.value2 !== null
        ) {
          lastOperation.current.pressedResult = false
        } else {
          const value = parseFloat(textValue)

          if (lastOperation.current.value1 !== null) {
            const result = math[lastOperation.current.operator](lastOperation.current.value1, value)
            lastOperation.current.value1 = result
            lastOperation.current.value2 = value

            if (!Number.isNaN(result)) {
              onTextChange(String(result))
            }
          }
        }
      }

      lastOperation.current.operator = operator
      setDisplayedOperator(operator)
      needClear.current = true
    },
    [onTextChange, textValue],
  )

  const addPoint = useCallback(() => {
    needClear.current = false

    if (textValue === '-') {
      onTextChange('-0.')
      return
    }

    const value = textValue === '' ? '0.' : textValue + '.'
    onTextChange(value)
  }, [textValue, onTextChange])

  const handleInput: React.MouseEventHandler<HTMLDivElement> = ({ target }) => {
    const targetElement = target as HTMLDivElement

    ;['number', 'operation', 'point'].forEach((key) => {
      const buttonValue = targetElement.dataset[key]

      if (buttonValue !== undefined) {
        if (key === 'number') {
          return inputNumber(buttonValue)
        }

        if (key === 'operation') {
          switch (buttonValue) {
            case 'reset': {
              return reset()
            }

            case 'backspace': {
              return backspace()
            }

            case 'result': {
              return getResult()
            }
            case '+':
            case '-':
            case '*':
            case '/': {
              return addOperation(buttonValue)
            }
          }
        }

        if (key === 'point') {
          return addPoint()
        }
      }
    })
  }

  useEffect(() => {
    const callback = ({ key }: { key: string }) => {
      if (key.trim() && !Number.isNaN(Number(key.trim()))) {
        return inputNumber(key)
      }

      switch (key) {
        case 'Escape': {
          return reset()
        }

        case 'Backspace': {
          return backspace()
        }
        case '=':
        case 'Enter': {
          return getResult()
        }

        case '.': {
          return addPoint()
        }
        case '+':
        case '-':
        case '*':
        case '/': {
          return addOperation(key)
        }
      }
    }

    document.addEventListener('keydown', callback)
    return () => document.removeEventListener('keydown', callback)
  }, [addOperation, addPoint, backspace, getResult, inputNumber, reset])

  useEffect(() => {
    needClear.current = true
  }, [name])

  return (
    <div
      className={clsx(className, classes.numpad)}
      onPointerDown={handleInput}
      data-testid="calculator"
    >
      <ButtonSpring data-operation="reset" className={clsx(classes.accent, classes.roundTopLeft)}>
        C
      </ButtonSpring>
      <ButtonSpring
        data-operation="/"
        className={clsx(classes.accent, displayedOperator === '/' && classes.highlight)}
      >
        ÷
      </ButtonSpring>
      <ButtonSpring
        data-operation="*"
        className={clsx(classes.accent, displayedOperator === '*' && classes.highlight)}
      >
        ×
      </ButtonSpring>
      <ButtonSpring
        data-operation="backspace"
        className={clsx(classes.accent, classes.roundTopRight)}
      >
        <Icon name="icon.calculator.backspace" />
      </ButtonSpring>
      <ButtonSpring data-number="7">7</ButtonSpring>
      <ButtonSpring data-number="8">8</ButtonSpring>
      <ButtonSpring data-number="9">9</ButtonSpring>
      <ButtonSpring
        data-operation="-"
        className={clsx(classes.accent, displayedOperator === '-' && classes.highlight)}
      >
        −
      </ButtonSpring>
      <ButtonSpring data-number="4">4</ButtonSpring>
      <ButtonSpring data-number="5">5</ButtonSpring>
      <ButtonSpring data-number="6">6</ButtonSpring>
      <ButtonSpring
        data-operation="+"
        className={clsx(classes.accent, displayedOperator === '+' && classes.highlight)}
      >
        +
      </ButtonSpring>
      <ButtonSpring data-number="1">1</ButtonSpring>
      <ButtonSpring data-number="2">2</ButtonSpring>
      <ButtonSpring data-number="3">3</ButtonSpring>
      <ButtonSpring
        data-operation="result"
        className={clsx(classes.accent, classes.result, classes.roundBottomRight)}
      >
        =
      </ButtonSpring>
      <ButtonSpring data-number="0" className={clsx(classes.zero, classes.roundBottomLeft)}>
        <div style={{ gridColumn: 2 }}>0</div>
      </ButtonSpring>
      <ButtonSpring data-point="" disabled={textValue.includes('.')}>
        .
      </ButtonSpring>
    </div>
  )
}
