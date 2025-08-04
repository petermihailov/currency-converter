import { CURRENCY, DEFAULT_CODES } from '../../constants.ts'
import { Storage } from '../../lib/LocalStorage.ts'
import type { CurrencyCode } from '../../types/currencies.ts'

const codesStorage = new Storage<{ picked: CurrencyCode[] }>('currency-codes', {
  picked: DEFAULT_CODES,
})

export const getCurrencyCode = (
  prevOrNext: -1 | 1,
  currentCode: CurrencyCode,
  oppositeCode: CurrencyCode,
): CurrencyCode => {
  const currencyCodes = codesStorage.get()?.picked || (Object.keys(CURRENCY) as CurrencyCode[])

  const codes = currencyCodes.filter((code) => code !== oppositeCode)
  const currentIdx = codes.findIndex((code) => code === currentCode)

  if (prevOrNext - 1) {
    return codes[currentIdx - 1 < 0 ? codes.length - 1 : currentIdx - 1]
  }

  return codes[currentIdx + 1 > codes.length - 1 ? 0 : currentIdx + 1]
}
