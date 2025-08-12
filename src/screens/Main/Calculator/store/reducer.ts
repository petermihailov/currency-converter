import DecimalJS from 'decimal.js'

import {
  displayToValue,
  formatNumberInput,
  formatNumberInputActive,
} from '../../../../utils/formatters.ts'
import type { Operator, Decimal } from '../types.ts'

DecimalJS.set({
  toExpNeg: -100,
  toExpPos: 100,
})

export interface State {
  currentValue: DecimalJS
  currentDisplay: string
  previousValue: DecimalJS | null
  operator: Operator | null
  lastOperator: Operator | null
  lastOperand: DecimalJS | null
  overwrite: boolean
}

export type Action =
  | { type: 'setValue'; payload: { currentValue: DecimalJS; currentDisplay: string } }
  | { type: 'decimal'; payload: Decimal }
  | { type: 'operator'; payload: Operator }
  | { type: 'evaluate' }
  | { type: 'backspace' }
  | { type: 'reset' }

export const INITIAL_STATE: State = {
  currentValue: new DecimalJS(0),
  currentDisplay: '0',
  previousValue: null,
  operator: null,
  lastOperator: null,
  lastOperand: null,
  overwrite: true,
}

// Вспомогательная функция для выполнения операции
function evaluate(x: DecimalJS, op: '+' | '-' | '*' | '/', y: DecimalJS): DecimalJS {
  try {
    let result: DecimalJS

    switch (op) {
      case '+':
        result = x.plus(y)
        break
      case '-':
        result = x.minus(y)
        break
      case '*':
        result = x.times(y)
        break
      case '/':
        // Decimal will throw if dividing by zero; you can catch or handle as needed
        result = x.dividedBy(y)
        break
      default:
        return x
    }

    // Strip trailing zeros and return plain string
    return result
  } catch (e) {
    // Fallback to original on error
    return x
  }
}

export function reducer(state: State, action: Action): State {
  const {
    currentValue,
    currentDisplay,
    previousValue,
    operator,
    lastOperator,
    lastOperand,
    overwrite,
  } = state

  switch (action.type) {
    case 'decimal': {
      const char = action.payload

      if (char === '.') {
        // При перезаписи или если текущий '0'
        if (overwrite || currentDisplay === '0') {
          return {
            ...state,
            currentDisplay: '0.',
            overwrite: false,
          }
        }

        // Если стоит минус
        if (currentDisplay === '-') {
          return {
            ...state,
            currentDisplay: '-0.',
            currentValue: new DecimalJS(-0),
            overwrite: false,
          }
        }

        // Блокируем вторую точку
        if (currentDisplay.includes('.')) {
          return state
        }
      }

      // При перезаписи или если текущий '0'
      if (overwrite || currentDisplay === '0') {
        return {
          ...state,
          currentDisplay: char,
          currentValue: new DecimalJS(char),
          overwrite: false,
        }
      }

      const newCurrentDisplay = formatNumberInputActive(currentDisplay.replace(/\s+/g, '') + char)
      const newCurrentValue = new DecimalJS(displayToValue(newCurrentDisplay))

      return {
        ...state,
        currentDisplay: newCurrentDisplay,
        currentValue: newCurrentValue,
        overwrite: false,
      }
    }

    case 'operator': {
      const newOp = action.payload

      // Если начинаем с минуса, значит идет ввод отрицательного числа
      if (newOp === '-' && state.currentDisplay === '0' && state.overwrite) {
        return {
          ...state,
          currentDisplay: '-',
          overwrite: false,
        }
      }

      // Если уже есть предыдущее значение и ввод завершён — делаем промежуточный расчёт
      if (previousValue !== null && !overwrite && operator) {
        const computed = evaluate(previousValue, operator, currentValue)
        return {
          ...state,
          currentValue: computed,
          previousValue: computed,
          currentDisplay: formatNumberInput(computed), // тут другой форматтер чтобы сократить дробную часть
          operator: newOp,
          overwrite: true,
        }
      }

      // Первый оператор или просто смена оператора
      return {
        ...state,
        previousValue: currentValue,
        operator: newOp,
        overwrite: true,
      }
    }

    case 'evaluate': {
      // Если нажали '=' после выбора оператора
      if (operator !== null && previousValue !== null) {
        const result = evaluate(previousValue, operator, currentValue)

        return {
          ...state,
          currentDisplay: formatNumberInputActive(result.toString()),
          currentValue: result,
          previousValue: result,
          lastOperator: operator,
          lastOperand: currentValue,
          operator: null,
          overwrite: true,
        }
      }

      // Повтор последней операции при повторном '='
      if (lastOperator !== null && lastOperand !== null) {
        const result = evaluate(currentValue, lastOperator, lastOperand)
        return {
          ...state,
          currentDisplay: formatNumberInputActive(result.toString()),
          currentValue: result,
          previousValue: result,
          overwrite: true,
        }
      }

      return state
    }

    case 'backspace': {
      if (state.currentDisplay.length > 1) {
        const newCurrentDisplay = state.currentDisplay.slice(0, -1)
        return {
          ...state,
          currentValue: new DecimalJS(displayToValue(newCurrentDisplay)),
          currentDisplay: newCurrentDisplay,
        }
      }

      return {
        ...state,
        currentDisplay: '0',
        currentValue: new DecimalJS(0),
        overwrite: true,
      }
    }

    case 'reset': {
      return INITIAL_STATE
    }

    case 'setValue': {
      return { ...INITIAL_STATE, ...action.payload }
    }

    default:
      return state
  }
}
