import clsx from 'clsx'
import React, { useEffect, useReducer } from 'react'

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

const precision = 1000
const math: Record<Operator, (a: number, b: number) => number> = {
  '+': (a, b) => (a * precision + b * precision) / precision,
  '-': (a, b) => (a * precision - b * precision) / precision,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

interface State {
  display: string
  value: number | null
  operator: Operator | null
  pendingValue: number | null
  overwrite: boolean
  highlightedOperator: Operator | null
}

type Action =
  | { type: 'input'; digit: string }
  | { type: 'decimal' }
  | { type: 'clear' }
  | { type: 'backspace' }
  | { type: 'evaluate' }
  | { type: 'operator'; operator: Operator }

const INITIAL_STATE: State = {
  display: '0',
  value: null,
  operator: null,
  pendingValue: null,
  overwrite: true,
  highlightedOperator: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'input': {
      if (state.overwrite) {
        return {
          ...state,
          display: action.digit,
          overwrite: false,
          highlightedOperator: null,
        }
      }
      if (state.display === '0' && action.digit === '0') return state
      return { ...state, display: state.display + action.digit }
    }

    case 'decimal': {
      if (state.display.includes('.')) return state
      if (state.overwrite)
        return { ...state, display: '0.', overwrite: false, highlightedOperator: null }
      return { ...state, display: state.display + '.' }
    }
    case 'clear':
      return INITIAL_STATE
    case 'backspace': {
      const newDisplay = state.display.length > 1 ? state.display.slice(0, -1) : '0'
      return { ...state, display: newDisplay, overwrite: false, highlightedOperator: null }
    }

    case 'operator': {
      const currentValue = parseFloat(state.display)

      if (state.value !== null && state.operator && !state.overwrite) {
        const result = math[state.operator](state.value, currentValue)
        return {
          display: String(result),
          value: result,
          operator: action.operator,
          highlightedOperator: action.operator,
          pendingValue: null,
          overwrite: true,
        }
      }

      return {
        ...state,
        value: currentValue,
        operator: action.operator,
        highlightedOperator: action.operator,
        overwrite: true,
      }
    }

    case 'evaluate': {
      if (state.operator && state.value !== null) {
        const operand =
          state.overwrite && state.pendingValue !== null
            ? state.pendingValue
            : parseFloat(state.display)
        const result = math[state.operator](state.value, operand)
        return {
          display: String(result),
          value: result,
          operator: null,
          highlightedOperator: null,
          pendingValue: operand,
          overwrite: true,
        }
      }

      return state
    }
    default:
      return state
  }
}

export const Calculator = ({ className, name, textValue = '0', onTextChange }: CalculatorProps) => {
  const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE, display: textValue })

  useEffect(() => {
    onTextChange(state.display)
  }, [state.display, onTextChange])

  useEffect(() => {
    dispatch({ type: 'clear' })
  }, [name])

  const handleInput: React.MouseEventHandler<HTMLDivElement> = ({ target }) => {
    const el = target as HTMLElement
    const { number, operation, point } = el.dataset

    if (number) return dispatch({ type: 'input', digit: number })
    if (point !== undefined) return dispatch({ type: 'decimal' })

    if (operation) {
      switch (operation) {
        case 'reset':
          return dispatch({ type: 'clear' })
        case 'backspace':
          return dispatch({ type: 'backspace' })
        case 'result':
          return dispatch({ type: 'evaluate' })
        case '+':
        case '-':
        case '*':
        case '/':
          return dispatch({ type: 'operator', operator: operation })
      }
    }
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key
      if (/\d/.test(key)) dispatch({ type: 'input', digit: key })
      else if (key === '.') dispatch({ type: 'decimal' })
      else if (key === 'Enter' || key === '=') dispatch({ type: 'evaluate' })
      else if (['+', '-', '*', '/'].includes(key))
        dispatch({ type: 'operator', operator: key as Operator })
      else if (key === 'Backspace') dispatch({ type: 'backspace' })
      else if (key === 'Escape') dispatch({ type: 'clear' })
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

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
        className={clsx(classes.accent, state.highlightedOperator === '/' && classes.highlight)}
      >
        ÷
      </ButtonSpring>
      <ButtonSpring
        data-operation="*"
        className={clsx(classes.accent, state.highlightedOperator === '*' && classes.highlight)}
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
        className={clsx(classes.accent, state.highlightedOperator === '-' && classes.highlight)}
      >
        −
      </ButtonSpring>
      <ButtonSpring data-number="4">4</ButtonSpring>
      <ButtonSpring data-number="5">5</ButtonSpring>
      <ButtonSpring data-number="6">6</ButtonSpring>
      <ButtonSpring
        data-operation="+"
        className={clsx(classes.accent, state.highlightedOperator === '+' && classes.highlight)}
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
      <ButtonSpring data-point>.</ButtonSpring>
    </div>
  )
}
