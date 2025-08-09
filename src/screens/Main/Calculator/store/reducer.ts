import DecimalJS from 'decimal.js'

DecimalJS.set({
  toExpNeg: -100,
  toExpPos: 100,
})

import type { Operator, Decimal } from '../types.ts'

export interface State {
  currentValue: string
  previousValue: string | null
  operator: Operator | null
  lastOperator: Operator | null
  lastOperand: string | null
  overwrite: boolean
}

export type Action =
  | { type: 'decimal'; payload: Decimal }
  | { type: 'operator'; payload: Operator }
  | { type: 'evaluate' }
  | { type: 'backspace' }
  | { type: 'reset' }

export const INITIAL_STATE = {
  currentValue: '0',
  previousValue: null,
  operator: null,
  lastOperator: null,
  lastOperand: null,
  overwrite: true,
}

// Вспомогательная функция для выполнения операции
function evaluate(a: string, op: '+' | '-' | '*' | '/', b: string): string {
  try {
    const x = new DecimalJS(a)
    const y = new DecimalJS(b)
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
        return a
    }

    // Strip trailing zeros and return plain string
    return result.toString()
  } catch (e) {
    // Fallback to original on error
    return a
  }
}

export function reducer(state: State, action: Action): State {
  const { currentValue, previousValue, operator, lastOperator, lastOperand, overwrite } = state

  switch (action.type) {
    case 'decimal': {
      const char = action.payload

      if (char === '.') {
        // Блокируем вторую точку
        if (currentValue.includes('.')) {
          return state
        }

        // При перезаписи или если текущий '0'
        if (overwrite || currentValue === '0') {
          return { ...state, currentValue: '0.', overwrite: false }
        }

        // Если стоит минус
        if (currentValue === '-') {
          return { ...state, currentValue: '-0.', overwrite: false }
        }
      }

      // При перезаписи или если текущий '0'
      if (overwrite || currentValue === '0') {
        return { ...state, currentValue: char, overwrite: false }
      }

      return { ...state, currentValue: currentValue + char, overwrite: false }
    }

    case 'operator': {
      const newOp = action.payload

      // Если начинаем с минуса, значит идет ввод отрицательного числа
      if (newOp === '-' && state.currentValue === '0' && state.overwrite) {
        return {
          ...state,
          currentValue: '-',
          overwrite: false,
        }
      }

      // Если уже есть предыдущее значение и ввод завершён — делаем промежуточный расчёт
      if (previousValue !== null && !overwrite) {
        const computed = evaluate(previousValue, operator!, currentValue)
        return {
          ...state,
          previousValue: computed,
          operator: newOp,
          currentValue: computed,
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
          currentValue: result,
          previousValue: result,
          overwrite: true,
        }
      }

      return state
    }

    case 'backspace': {
      if (state.currentValue.length > 1) {
        return {
          ...state,
          currentValue: state.currentValue.slice(0, -1),
        }
      }

      return {
        ...state,
        currentValue: '0',
        overwrite: true,
      }
    }

    case 'reset': {
      return INITIAL_STATE
    }

    default:
      return state
  }
}
