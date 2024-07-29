import type { CURRENCY } from '../constants'

export type CurrencyCode = keyof typeof CURRENCY

export type CodesRatio = Record<CurrencyCode, number>

export interface DateRatio {
  date: string
  codes: CodesRatio
}
