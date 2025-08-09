import { useReducer } from 'react'

import { INITIAL_STATE, reducer } from './reducer.ts'

export function useCalculatorState() {
  return useReducer(reducer, INITIAL_STATE)
}
