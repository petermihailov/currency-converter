import type { CurrencyCode } from '../types/currencies'

export const formatCurrency = (code: CurrencyCode, value: number) => {
  const valueStr = value.toString().match(/0\.[0]{2,}[0-9]/)?.[0]
  const maximumFractionDigits = valueStr?.length ? valueStr.length - 1 : 2

  return new Intl.NumberFormat('en', {
    style: 'currency',
    maximumFractionDigits,
    currency: code.toUpperCase(),
    currencyDisplay: 'narrowSymbol',
  }).format(value)
}

export const formatNumberInput = (value: string) => {
  const options = {
    maximumFractionDigits: 2,
  }
  return new Intl.NumberFormat('en', options).format(+value)
}

export const formatNumberInputActive = (value: string) => {
  const options = { maximumFractionDigits: 0 }

  if (value === '-') return value

  if (value.toString().indexOf('.') !== -1) {
    const [integer, fraction] = value.toString().split('.')
    return new Intl.NumberFormat('en', options).format(+integer) + `.${fraction}`
  }

  return new Intl.NumberFormat('en', options).format(+value)
}

export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('ru-RU')
}
