import clsx from 'clsx'
import React, { useEffect } from 'react'

import { useCalculatorState } from './store/useCalculatorState.ts'
import type { Decimal } from './types.ts'
import { ButtonSpring } from '../../../components/ButtonSpring'
import { Icon } from '../../../components/Icon'

import classes from './Calculator.module.css'

interface CalculatorProps {
  className?: string
  onChange: (value: string) => void
}

export const Calculator = ({ className, onChange }: CalculatorProps) => {
  const [state, dispatch] = useCalculatorState()

  useEffect(() => {
    onChange(state.currentValue)
  }, [onChange, state.currentValue])

  const handleInput: React.MouseEventHandler<HTMLDivElement> = ({ target }) => {
    const el = target as HTMLElement
    const { decimal, operator } = el.dataset

    // Ввод числа
    if (decimal && ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(decimal)) {
      return dispatch({ type: 'decimal', payload: decimal as Decimal })
    }

    // Оператор
    if (operator && ['+', '-', '*', '/', 'evaluate', 'reset', 'backspace'].includes(operator)) {
      switch (operator) {
        case 'reset':
          return dispatch({ type: 'reset' })
        case 'backspace':
          return dispatch({ type: 'backspace' })
        case 'evaluate':
          return dispatch({ type: 'evaluate' })
        case '+':
        case '-':
        case '*':
        case '/':
          return dispatch({ type: 'operator', payload: operator })
      }
    }
  }

  return (
    <div
      className={clsx(className, classes.numpad)}
      onPointerDown={handleInput}
      data-testid="calculator"
    >
      <ButtonSpring
        data-operator="reset"
        className={clsx(classes.accent, classes.reset, classes.roundTopLeft)}
      >
        C
      </ButtonSpring>
      <ButtonSpring
        data-operator="/"
        className={clsx(classes.accent, state.operator === '/' && classes.highlight)}
      >
        ÷
      </ButtonSpring>
      <ButtonSpring
        data-operator="*"
        className={clsx(classes.accent, state.operator === '*' && classes.highlight)}
      >
        ×
      </ButtonSpring>
      <ButtonSpring
        data-operator="backspace"
        className={clsx(classes.accent, classes.roundTopRight)}
      >
        <Icon name="icon.calculator.backspace" />
      </ButtonSpring>
      <ButtonSpring data-decimal="7">7</ButtonSpring>
      <ButtonSpring data-decimal="8">8</ButtonSpring>
      <ButtonSpring data-decimal="9">9</ButtonSpring>
      <ButtonSpring
        data-operator="-"
        className={clsx(classes.accent, state.operator === '-' && classes.highlight)}
      >
        −
      </ButtonSpring>
      <ButtonSpring data-decimal="4">4</ButtonSpring>
      <ButtonSpring data-decimal="5">5</ButtonSpring>
      <ButtonSpring data-decimal="6">6</ButtonSpring>
      <ButtonSpring
        data-operator="+"
        className={clsx(classes.accent, state.operator === '+' && classes.highlight)}
      >
        +
      </ButtonSpring>
      <ButtonSpring data-decimal="1">1</ButtonSpring>
      <ButtonSpring data-decimal="2">2</ButtonSpring>
      <ButtonSpring data-decimal="3">3</ButtonSpring>
      <ButtonSpring
        data-operator="evaluate"
        className={clsx(classes.accent, classes.result, classes.roundBottomRight)}
      >
        =
      </ButtonSpring>
      <ButtonSpring data-decimal="0" className={clsx(classes.zero, classes.roundBottomLeft)}>
        <div style={{ gridColumn: 2 }}>0</div>
      </ButtonSpring>
      <ButtonSpring data-decimal=".">.</ButtonSpring>
    </div>
  )
}
