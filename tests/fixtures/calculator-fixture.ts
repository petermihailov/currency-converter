import { expect } from '@playwright/test'
import type { Page, TestFixture } from '@playwright/test'

type InputPosition = 'left' | 'right'
type Operation = '+' | '-' | '*' | '/'
type Number09 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface CalculatorFixture {
  clickLeft: () => Promise<void>
  clickRight: () => Promise<void>
  clickNumber: (n: Number09) => Promise<void>
  clickOperation: (o: Operation) => Promise<void>
  clickPoint: () => Promise<void>
  clickResult: () => Promise<void>
  clickBackspace: () => Promise<void>
  clickReset: () => Promise<void>
  checkResult: (position: InputPosition, expected: string) => Promise<void>
}

export const calculatorFixture: TestFixture<CalculatorFixture, { page: Page }> = async (
  { page },
  use,
) => {
  const fixture = {
    clickLeft: async () => page.click('[data-testid="value-left"]'),
    clickRight: async () => page.click('[data-testid="value-right"]'),
    clickNumber: async (n: Number09) => page.click(`[data-number="${n}"]`),
    clickOperation: async (op: Operation) => page.click(`[data-operation="${op}"]`),
    clickPoint: async () => page.click(`[data-point="true"]`),
    clickResult: async () => page.click(`[data-operation="result"]`),
    clickBackspace: async () => page.click(`[data-operation="backspace"]`),
    clickReset: async () => page.click(`[data-operation="reset"]`),
    checkResult: async (position: InputPosition, expected: string) => {
      const result = page.locator(`[data-testid="value-${position}"]`)
      return expect(result).toHaveText(expected)
    },
  }

  await use(fixture)
}
