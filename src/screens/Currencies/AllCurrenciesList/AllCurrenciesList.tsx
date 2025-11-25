import clsx from 'clsx'
import { useMemo } from 'react'

import { Indicator } from '../../../components/Indicator'
import { CURRENCY } from '../../../constants'
import type { CurrencyCode } from '../../../types/currencies'

import classes from './AllCurrenciesList.module.css'

interface AllCurrenciesListProps {
  currencies: CurrencyCode[]
  favorites: CurrencyCode[]
  onToggle: (code: CurrencyCode) => void
}

export const AllCurrenciesList = ({ currencies, favorites, onToggle }: AllCurrenciesListProps) => {
  const sortedCurrencies = useMemo(() => {
    return currencies.map((code) => CURRENCY[code]).sort((a, b) => (a.name > b.name ? 1 : -1))
  }, [currencies])

  if (sortedCurrencies.length === 0) {
    return <div className={classes.empty}>No currencies found</div>
  }

  return (
    <ul className={clsx(classes.list, classes.allList)}>
      {sortedCurrencies.map((currency) => {
        const isSelected = favorites.includes(currency.code)

        return (
          <li
            key={currency.code}
            className={clsx(classes.item, { [classes.selected]: isSelected })}
          >
            <button
              className={classes.currency}
              onClick={() => onToggle(currency.code)}
              type="button"
            >
              <img
                className={classes.flag}
                src={`./flags/${currency.code.slice(0, 2)}.webp`}
                alt={currency.name}
              />
              {currency.name}
              {isSelected && <Indicator />}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
