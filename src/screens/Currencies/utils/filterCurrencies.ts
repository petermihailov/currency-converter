import { CURRENCY } from '../../../constants'
import type { CurrencyCode } from '../../../types/currencies'

/**
 * Фильтрует валюты по поисковому запросу
 * Поиск работает по названию, коду и символу валюты (case-insensitive)
 * @param codes - массив кодов валют для фильтрации
 * @param query - поисковый запрос (активен от 2 символов)
 * @returns отфильтрованный массив кодов валют
 */
export function filterCurrencies(codes: CurrencyCode[], query: string): CurrencyCode[] {
  // Если запрос пустой или меньше 2 символов, возвращаем все
  if (!query || query.trim().length < 2) {
    return codes
  }

  const normalizedQuery = query.trim().toLowerCase()

  return codes.filter((code) => {
    const currency = CURRENCY[code]

    // Поиск по коду (например, "eur", "usd")
    if (code.toLowerCase().includes(normalizedQuery)) {
      return true
    }

    // Поиск по названию (например, "euro", "dollar")
    if (currency.name.toLowerCase().includes(normalizedQuery)) {
      return true
    }

    // Поиск по символу (например, "€", "$", "₽")
    if ('sign' in currency && currency.sign.toLowerCase().includes(normalizedQuery)) {
      return true
    }

    return false
  })
}
