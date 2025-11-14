import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import type { DropResult } from 'react-beautiful-dnd'

import { AllCurrenciesList } from './AllCurrenciesList'
import { PickedCurrenciesList } from './PickedCurrenciesList'
import { SearchInput } from './SearchInput'
import { filterCurrencies } from './utils/filterCurrencies'
import { ButtonSpring } from '../../components/ButtonSpring'
import { CURRENCY } from '../../constants'
import { useAppStorage } from '../../store/reducer'
import type { CurrencyCode } from '../../types/currencies'
import { arrayMove } from '../../utils/array-move'

import classes from './Currencies.module.css'

export interface CurrenciesProps {
  className?: string
  onBack: () => void
}

const Currencies = ({ className, onBack }: CurrenciesProps) => {
  const [{ favorites }, dispatch] = useAppStorage()
  const [searchQuery, setSearchQuery] = useState('')

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // если был брошен не в списке или на ту же позицию — ничего не делаем
    if (
      !destination ||
      (destination.droppableId === source.droppableId && destination.index === source.index)
    ) {
      return
    }

    // переставляем элементы в массиве
    dispatch({
      type: 'setFavorites',
      payload: arrayMove(favorites, source.index, destination.index),
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={classes.lists}>
          <h2>Picked currencies</h2>
          <PickedCurrenciesList
            currencies={filteredFavorites}
            onRemove={(code) => dispatch({ type: 'removeFavorite', payload: code })}
          />

          <h2>All currencies</h2>
          <AllCurrenciesList
            currencies={filteredAllCurrencies}
            favorites={favorites}
            onToggle={handleToggleFavorite}
          />
        </div>
      </DragDropContext>

      {favorites.length >= 2 && (
        <ButtonSpring onClick={onBack} className={classes.backButton}>
          Back
        </ButtonSpring>
      )}
    </div>
  )
}

export default Currencies
