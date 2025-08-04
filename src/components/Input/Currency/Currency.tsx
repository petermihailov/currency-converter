import clsx from 'clsx'
import { forwardRef, memo } from 'react'

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
            src={`./flags/${currencyCode.slice(0, 2)}.webp`}
            alt={currencyCode}
          />
          {currencyCode}
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
