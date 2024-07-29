export const minMax = (val: number, min: number, max: number) => {
  return Math.min(Math.max(val, min), max)
}

/** Возвращает процент между min и max.
 * @example
 * percentBetweenMinMax(3, 2, 4) // 0.5 - то есть 50%. число 3 находится ровно посередине между 2 и 4
 * */
export const percentBetweenMinMax = (target: number, min: number, max: number) =>
  (target - min) / (max - min)
