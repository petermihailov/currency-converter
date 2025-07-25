import { test as base } from 'playwright/test'

import type { CalculatorFixture } from './calculator-fixture'
import { calculatorFixture } from './calculator-fixture'

export const test = base.extend<{ calc: CalculatorFixture }>({
  calc: calculatorFixture,
})
