import clsx from 'clsx'
import { Draggable, Droppable } from 'react-beautiful-dnd'

import { Icon } from '../../../components/Icon'
import { CURRENCY } from '../../../constants'
import type { CurrencyCode } from '../../../types/currencies'

import classes from './PickedCurrenciesList.module.css'

interface PickedCurrenciesListProps {
  currencies: CurrencyCode[]
  onRemove: (code: CurrencyCode) => void
}

export const PickedCurrenciesList = ({ currencies, onRemove }: PickedCurrenciesListProps) => {
  if (currencies.length === 0) {
    return <div className={classes.empty}>No currencies found</div>
  }

  return (
    <Droppable droppableId="picked-currencies">
      {(provided) => (
        <ul
          ref={provided.innerRef}
          className={clsx(classes.list, classes.pickedList)}
          {...provided.droppableProps}
        >
          {currencies.map((code, idx) => (
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
                    onClick={() => onRemove(code)}
                    type="button"
                    aria-label={`Remove ${CURRENCY[code].name}`}
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
  )
}
