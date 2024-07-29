import { Storage } from '../lib/LocalStorage'
import type { CodesRatio, DateRatio } from '../types/currencies'
import { toISODate } from '../utils/dates'

const ratioStorage = new Storage<Record<string, CodesRatio>>('ratio')

export const getUsdRatio = async (date: Date = new Date()): Promise<DateRatio | null> => {
  const cache = ratioStorage.get()
  const dateIsoStr = toISODate(date)

  try {
    // пробуем найти в кэше за сегодня
    if (cache && cache[dateIsoStr]) {
      return { date: dateIsoStr, codes: cache[dateIsoStr] }
    }

    // если в кеше нет, то делаем запрос
    return await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${dateIsoStr}/v1/currencies/usd.json`,
    )
      .then((response) => response.json())
      .then((data) => ({ date: data.date, codes: data.usd }) as DateRatio)
      .then((data) => {
        ratioStorage.update({ [data.date]: data.codes })
        return data
      })
      .catch(() => {
        if (cache) {
          // если запрос свалился, то берем из кеша последнее значение
          const cacheDates = Object.keys(cache).sort()
          const cacheDate = cacheDates[cacheDates.length - 1]

          if (cache && cacheDate && cache[cacheDate]) {
            return {
              date: cacheDate,
              codes: cache[cacheDate],
            }
          }
        }

        return null
      })
  } catch (e) {
    return null
  }
}
