import clsx from 'clsx'
import { forwardRef, memo } from 'react'

import { CURRENCY } from '../../../constants.ts'
import type { CurrencyCode, DateRatio } from '../../../types/currencies.ts'
import { formatCurrency } from '../../../utils/formatters.ts'
import { getPariRatio } from '../../../utils/misc.ts'
import { TextFit } from '../../TextFit'

import classes from './Currency.module.css'

interface CurrencyProps {
  className?: string
  currencyCode: CurrencyCode
  oppositeCode: CurrencyCode
  reverse?: boolean
  ratio: DateRatio
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
            src={`./flags/${CURRENCY[currencyCode].country}.webp`}
            alt={currencyCode}
          />
          {CURRENCY[currencyCode].currency}
        </div>
        <div className={classes.ratio}>
          <TextFit
            text={formatCurrency(
              oppositeCode,
              getPariRatio(ratio.codes, currencyCode, oppositeCode),
            )}
          />
        </div>
      </div>
    ),
  ),
)
