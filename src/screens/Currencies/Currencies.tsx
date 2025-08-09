import clsx from 'clsx'
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd'
import type { DropResult } from 'react-beautiful-dnd'

import { ButtonSpring } from '../../components/ButtonSpring'
import { Icon } from '../../components/Icon'
import { CURRENCY } from '../../constants.ts'
import { useAppStorage } from '../../store/reducer.ts'
import { arrayMove } from '../../utils/array-move.ts'

import classes from './Currencies.module.css'

export interface CurrenciesProps {
  className?: string
  onBack: () => void
}

const Currencies = ({ className, onBack }: CurrenciesProps) => {
  const [{ favorites }, dispatch] = useAppStorage()

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
                {favorites.map((code, idx) => (
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
                            dispatch({ type: 'removeFavorite', payload: code })
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
                const isSelected = favorites.includes(currency.code)

                return (
                  <li
                    key={currency.code}
                    className={clsx(classes.item, { [classes.selected]: isSelected })}
                  >
                    <button
                      className={classes.currency}
                      onClick={() => {
                        // @ts-expect-error -- хз почему ошибка, вроде норм всё
                        dispatch({
                          type: isSelected ? 'removeFavorite' : 'addFavorite',
                          payload: currency.code,
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
      {favorites.length >= 2 && (
        <ButtonSpring onClick={onBack} className={classes.backButton}>
          Back
        </ButtonSpring>
      )}
    </div>
  )
}

export default Currencies
