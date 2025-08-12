import type { CurrencyCode, DateRatio } from '../../types/currencies.ts'
import { getPariRatio } from '../../utils/misc.ts'

export const convert = (
  textValue: string,
  code: CurrencyCode,
  oppositeCode: CurrencyCode,
  ratio: DateRatio,
): string => {
  const value = parseFloat(textValue) * getPariRatio(ratio.codes, code, oppositeCode)

  if (!Number.isNaN(value)) {
    return String(Number(value.toFixed(2)))
  }

  return '0'
}
