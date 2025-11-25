import { Indicator } from '../../../components/Indicator'
import { CURRENCY } from '../../../constants'
import type { CurrencyCode } from '../../../types/currencies'

import classes from './CurrencyItem.module.css'

interface CurrencyItemProps {
  code: CurrencyCode
  isSelected: boolean
  showPickedIcon?: boolean
}

export const CurrencyItem = ({ code, isSelected, showPickedIcon = true }: CurrencyItemProps) => {
  const currency = CURRENCY[code]

  return (
    <>
      <img className={classes.flag} src={`./flags/${code.slice(0, 2)}.webp`} alt={currency.name} />
      {currency.name}
      {isSelected && showPickedIcon && <Indicator />}
    </>
  )
}
