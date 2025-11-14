import clsx from 'clsx'
import type DecimalJS from 'decimal.js'
import { forwardRef, memo } from 'react'

import { TextFit } from '../../../../components/TextFit'
import type { CurrencyCode } from '../../../../types/currencies.ts'
import { formatCurrency } from '../../../../utils/formatters.ts'

import classes from './Currency.module.css'

interface CurrencyProps {
  className?: string
  currencyCode: CurrencyCode
  oppositeCode: CurrencyCode
  reverse?: boolean
  ratio: DecimalJS
}

export const Currency = memo(
  forwardRef<HTMLDivElement, CurrencyProps>(
    ({ className, currencyCode, oppositeCode, ratio, reverse }, ref) => (
      <div
        ref={ref}
        className={clsx(className, classes.currencyRow, {
          [classes.reverse]: reverse,
        })}
      >
        <div className={clsx(classes.currency)}>
          <img
            className={classes.flag}
            src={`./flags/${currencyCode.slice(0, 2)}.webp`}
            alt={currencyCode}
          />
          {currencyCode}
        </div>
        <div className={classes.ratio}>
          <TextFit text={formatCurrency(oppositeCode, ratio)} />
        </div>
      </div>
    ),
  ),
)
