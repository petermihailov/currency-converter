import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'

import { Indicator } from '../../../components/Indicator'
import { CURRENCY } from '../../../constants'
import type { CurrencyCode } from '../../../types/currencies'

import classes from './PickedCurrenciesList.module.css'

interface PickedCurrenciesListProps {
  currencies: CurrencyCode[]
  onRemove: (code: CurrencyCode) => void
  onReorder: (currencies: CurrencyCode[]) => void
}

interface SortableItemProps {
  code: CurrencyCode
  onRemove: (code: CurrencyCode) => void
}

function SortableItem({ code, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: code,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li ref={setNodeRef} style={style} className={clsx(classes.item, classes.currency)}>
      <div className={classes.dragHandle} {...attributes} {...listeners}>
        <img
          className={classes.flag}
          src={`./flags/${code.slice(0, 2)}.webp`}
          alt={CURRENCY[code].name}
        />
        {CURRENCY[code].name}
      </div>
      <button
        className={classes.pickedIcon}
        onClick={(e) => {
          e.stopPropagation()
          onRemove(code)
        }}
        type="button"
        aria-label={`Remove ${CURRENCY[code].name}`}
      >
        <Indicator />
      </button>
    </li>
  )
}

export const PickedCurrenciesList = ({
  currencies,
  onRemove,
  onReorder,
}: PickedCurrenciesListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = currencies.indexOf(active.id as CurrencyCode)
      const newIndex = currencies.indexOf(over.id as CurrencyCode)
      const reordered = arrayMove(currencies, oldIndex, newIndex)
      onReorder(reordered)
    }
  }

  if (currencies.length === 0) {
    return <div className={classes.empty}>No currencies found</div>
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext items={currencies} strategy={verticalListSortingStrategy}>
        <ul className={clsx(classes.list, classes.pickedList)}>
          {currencies.map((code) => (
            <SortableItem key={code} code={code} onRemove={onRemove} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
