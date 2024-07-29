import { CURRENCY } from '../../constants.ts'
import type { CurrencyCode } from '../../types/currencies.ts'

const currencyCodes = Object.keys(CURRENCY) as CurrencyCode[]

export const getCurrencyCode = (
  prevOrNext: -1 | 1,
  currentCode: CurrencyCode,
  oppositeCode: CurrencyCode,
) => {
  const codes = currencyCodes.filter((code) => code !== oppositeCode)
  const currentIdx = codes.findIndex((code) => code === currentCode)

  if (prevOrNext - 1) {
    return codes[currentIdx - 1 < 0 ? codes.length - 1 : currentIdx - 1]
  }

  return codes[currentIdx + 1 > codes.length - 1 ? 0 : currentIdx + 1]
}
