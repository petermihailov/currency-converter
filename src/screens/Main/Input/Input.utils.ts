import type { CurrencyCode } from '../../../types/currencies.ts'

export const getCurrencyCode = (
  prevOrNext: -1 | 1,
  codes: CurrencyCode[],
  currentCode: CurrencyCode,
  oppositeCode: CurrencyCode,
): CurrencyCode => {
  const filteredCodes = codes.filter((code) => code !== oppositeCode)
  const currentIdx = filteredCodes.findIndex((code) => code === currentCode)

  if (prevOrNext - 1) {
    return filteredCodes[currentIdx - 1 < 0 ? filteredCodes.length - 1 : currentIdx - 1]
  }

  return filteredCodes[currentIdx + 1 > filteredCodes.length - 1 ? 0 : currentIdx + 1]
}
