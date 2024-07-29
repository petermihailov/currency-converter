import type { CodesRatio, CurrencyCode } from '../types/currencies'

export const getPariRatio = (ratio: CodesRatio, code1: CurrencyCode, code2: CurrencyCode) => {
  return ratio[code2] / ratio[code1]
}
