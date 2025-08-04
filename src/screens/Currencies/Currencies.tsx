import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd'
import type { DropResult } from 'react-beautiful-dnd'

import { ButtonSpring } from '../../components/ButtonSpring'
import { Icon } from '../../components/Icon'
import { CURRENCY, DEFAULT_CODES } from '../../constants.ts'
import { Storage } from '../../lib/LocalStorage.ts'
import type { CurrencyCode } from '../../types/currencies'
import { arrayMove } from '../../utils/array-move.ts'

import classes from './Currencies.module.css'

export interface CurrenciesProps {
  className?: string
  onBack: () => void
}

const codesStorage = new Storage<{ picked: CurrencyCode[] }>('currency-codes', {
  picked: DEFAULT_CODES,
})

const Currencies = ({ className, onBack }: CurrenciesProps) => {
  const [picked, setPicked] = useState<CurrencyCode[]>(codesStorage.get()?.picked || DEFAULT_CODES)

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
    const newPicked = arrayMove(picked, source.index, destination.index)

    setPicked(newPicked)
  }

  useEffect(() => {
    codesStorage.set({ picked })
  }, [picked])

  return (
    <div className={clsx(className, classes.currencies)}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={classes.lists}>
          <h2>Picked currencies</h2>
          <Droppable droppableId="picked-currencies">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                className={clsx(classes.list, classes.pickedList)}
                {...provided.droppableProps}
              >
                {picked.map((code, idx) => (
                  <Draggable key={code} draggableId={code} index={idx}>
                    {(provided) => (
                      <li
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className={clsx(classes.item, classes.currency)}
                      >
                        <img
                          className={classes.flag}
                          src={`./flags/${code.slice(0, 2)}.webp`}
                          alt={CURRENCY[code].name}
                        />
                        {CURRENCY[code].name}
                        <button
                          className={classes.pickedIcon}
                          onClick={() => {
                            setPicked((prev) => {
                              return prev.filter((c) => c !== code)
                            })
                          }}
                        >
                          <Icon name="icon.currencies.picked" />
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
          <h2>All currencies</h2>
          <ul className={clsx(classes.list, classes.allList)}>
            {Object.values(CURRENCY)
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((currency) => {
                const isSelected = picked.includes(currency.code)

                return (
                  <li
                    key={currency.code}
                    className={clsx(classes.item, { [classes.selected]: isSelected })}
                  >
                    <button
                      className={classes.currency}
                      onClick={() => {
                        setPicked((prev) => {
                          return isSelected
                            ? prev.filter((c) => c !== currency.code)
                            : [...prev, currency.code]
                        })
                      }}
                    >
                      <img
                        className={classes.flag}
                        src={`./flags/${currency.code.slice(0, 2)}.webp`}
                        alt={currency.name}
                      />
                      {currency.name}
                      {isSelected && (
                        <Icon className={classes.pickedIcon} name="icon.currencies.picked" />
                      )}
                    </button>
                  </li>
                )
              })}
          </ul>
        </div>
      </DragDropContext>
      {picked.length >= 2 && (
        <ButtonSpring onClick={onBack} className={classes.backButton}>
          Back
        </ButtonSpring>
      )}
    </div>
  )
}

export default Currencies
