import clsx from 'clsx'
import { useMemo, useState } from 'react'

import { AllCurrenciesList } from './AllCurrenciesList'
import { PickedCurrenciesList } from './PickedCurrenciesList'
import { SearchInput } from './SearchInput'
import { filterCurrencies } from './utils/filterCurrencies'
import { CollapsibleSection } from '../../components/CollapsibleSection'
import { CURRENCY } from '../../constants'
import { useAppStorage } from '../../store/reducer'
import type { CurrencyCode } from '../../types/currencies'

import classes from './Currencies.module.css'

export interface CurrenciesProps {
  className?: string
  onBack?: () => void
}

const Currencies = ({ className }: CurrenciesProps) => {
  const [{ favorites }, dispatch] = useAppStorage()
  const [searchQuery, setSearchQuery] = useState('')

  const handleReorder = (reorderedCurrencies: CurrencyCode[]) => {
    dispatch({
      type: 'setFavorites',
      payload: reorderedCurrencies,
    })
  }

  const handleToggleFavorite = (code: CurrencyCode) => {
    const isSelected = favorites.includes(code)

    if (isSelected) {
      dispatch({ type: 'removeFavorite', payload: code })
    } else {
      dispatch({ type: 'addFavorite', payload: code })
    }
  }

  // Применяем фильтрацию к обоим спискам
  const filteredFavorites = useMemo(
    () => filterCurrencies(favorites, searchQuery),
    [favorites, searchQuery],
  )

  const allCurrencyCodes = useMemo(() => Object.keys(CURRENCY) as CurrencyCode[], [])

  const filteredAllCurrencies = useMemo(
    () => filterCurrencies(allCurrencyCodes, searchQuery),
    [allCurrencyCodes, searchQuery],
  )

  return (
    <div className={clsx(className, classes.currencies)}>
      <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search..." />

      <div className={classes.lists}>
        <CollapsibleSection
          title="Picked currencies"
          storageKey="currencies-picked-expanded"
          itemCount={filteredFavorites.length}
        >
          <PickedCurrenciesList
            currencies={filteredFavorites}
            onRemove={(code) => dispatch({ type: 'removeFavorite', payload: code })}
            onReorder={handleReorder}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="All currencies"
          storageKey="currencies-all-expanded"
          itemCount={filteredAllCurrencies.length}
        >
          <AllCurrenciesList
            currencies={filteredAllCurrencies}
            favorites={favorites}
            onToggle={handleToggleFavorite}
          />
        </CollapsibleSection>
      </div>
    </div>
  )
}

export default Currencies
