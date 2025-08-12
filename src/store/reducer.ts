import { useReducer } from 'react'

import { Storage } from '../lib/LocalStorage.ts'
import type { CodesRatio, CurrencyCode, DateRatio } from '../types/currencies.ts'

export interface AppStorage {
  favorites: CurrencyCode[]
  rates: CodesRatio | null
  date: string | null
  active: 'left' | 'right'
  leftCode: CurrencyCode
  rightCode: CurrencyCode
}

export type AppStorageAction =
  | { type: 'addFavorite'; payload: CurrencyCode }
  | { type: 'removeFavorite'; payload: CurrencyCode }
  | { type: 'setFavorites'; payload: CurrencyCode[] }
  | { type: 'setRates'; payload: DateRatio }
  | { type: 'setActive'; payload: 'left' | 'right' }
  | { type: 'setLeftCode'; payload: CurrencyCode }
  | { type: 'setRightCode'; payload: CurrencyCode }
  | { type: 'swap' }
  | { type: 'setState'; payload: AppStorage }

export const INITIAL_STATE: AppStorage = {
  date: null,
  rates: null,
  favorites: ['eur', 'usd', 'amd', 'rub', 'gel'],
  active: 'right',
  leftCode: 'eur',
  rightCode: 'usd',
}

export const appStorage = new Storage<AppStorage>('app-storage', INITIAL_STATE)

export function appStorageReducer(state: AppStorage, action: AppStorageAction): AppStorage {
  switch (action.type) {
    case 'addFavorite': {
      if (state.favorites.includes(action.payload)) {
        return state
      }

      appStorage.set({ ...state, favorites: [...state.favorites, action.payload] })

      return appStorage.get()
    }

    case 'removeFavorite': {
      appStorage.set({ ...state, favorites: state.favorites.filter((c) => c !== action.payload) })
      return appStorage.get()
    }

    case 'setFavorites': {
      appStorage.set({ ...state, favorites: action.payload })
      return appStorage.get()
    }

    case 'setRates': {
      const { date, codes: rates } = action.payload
      appStorage.set({ ...state, date, rates })

      return appStorage.get()
    }

    case 'setActive': {
      appStorage.set({ ...state, active: action.payload })
      return appStorage.get()
    }

    case 'setLeftCode': {
      if (state.favorites.includes(action.payload)) {
        appStorage.set({ ...state, leftCode: action.payload })
        return appStorage.get()
      }

      return state
    }

    case 'setRightCode': {
      if (state.favorites.includes(action.payload)) {
        appStorage.set({ ...state, rightCode: action.payload })
        return appStorage.get()
      }

      return state
    }

    case 'swap': {
      appStorage.set({ ...state, rightCode: state.leftCode, leftCode: state.rightCode })
      return appStorage.get()
    }

    case 'setState': {
      appStorage.set({ ...action.payload })
      return appStorage.get()
    }

    default:
      return state
  }
}

export function useAppStorage() {
  return useReducer(appStorageReducer, appStorage.get())
}
