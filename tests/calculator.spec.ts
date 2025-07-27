import { test } from './fixtures'

test.beforeEach(async ({ page, calc }) => {
  await page.goto('http://localhost:5173/')
  await calc.clickLeft()
})

test.describe('Операции', () => {
  test('Простое сложение', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('+')
    await calc.clickNumber(3)
    await calc.clickResult()
    await calc.checkResult('left', '5')
  })

  test('Простое вычитание', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('-')
    await calc.clickNumber(3)
    await calc.clickResult()
    await calc.checkResult('left', '-1')
  })

  test('Простое умножение', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('*')
    await calc.clickNumber(3)
    await calc.clickResult()
    await calc.checkResult('left', '6')
  })

  test('Простое деление', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('/')
    await calc.clickNumber(3)
    await calc.clickResult()
    await calc.checkResult('left', '0.6666666666666666')
  })

  test('Сложение трех чисел', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('+')
    await calc.clickNumber(3)
    await calc.clickOperation('+')
    await calc.clickNumber(5)
    await calc.clickResult()
    await calc.checkResult('left', '10')
  })

  test('Вычитание трех чисел', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('-')
    await calc.clickNumber(3)
    await calc.clickOperation('-')
    await calc.clickNumber(5)
    await calc.clickResult()
    await calc.checkResult('left', '-6')
  })

  test('Вычитание трех чисел с первым отрицательным числом', async ({ calc }) => {
    await calc.clickOperation('-')
    await calc.clickNumber(2)
    await calc.clickOperation('-')
    await calc.clickNumber(3)
    await calc.clickOperation('-')
    await calc.clickNumber(5)
    await calc.clickResult()
    await calc.checkResult('left', '-10')
  })

  test('Умножение трех чисел', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('+')
    await calc.clickNumber(3)
    await calc.clickResult()
    await calc.checkResult('left', '5')
  })

  test('Деление трех чисел', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('/')
    await calc.clickNumber(3)
    await calc.clickOperation('/')
    await calc.clickNumber(3)
    await calc.clickResult()
    await calc.checkResult('left', '0.2222222222222222')
  })

  test('Повторение операции', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('*')
    await calc.clickNumber(2)
    await calc.checkResult('left', '2')
    await calc.clickResult()
    await calc.checkResult('left', '4')
    await calc.clickResult()
    await calc.checkResult('left', '8')
  })

  test('Деление на ноль', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('/')
    await calc.clickNumber(0)
    await calc.clickResult()
    await calc.checkResult('left', '∞')
  })
})

test.describe('Сброс и очистка', () => {
  test('Очистка последнего ввода', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickNumber(2)
    await calc.checkResult('left', '22')
    await calc.clickBackspace()
    await calc.checkResult('left', '2')
  })

  test('Полный сброс', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickNumber(2)
    await calc.checkResult('left', '22')
    await calc.clickReset()
    await calc.checkResult('left', '0')
  })
})

test.describe('Граничные случаи', () => {
  test('0 стоит по дефолту', async ({ calc }) => {
    await calc.checkResult('left', '0')
  })

  test('Повторные нажатия на 0 не приводят к задваиванию', async ({ calc }) => {
    await calc.checkResult('left', '0')
    await calc.clickNumber(0)
    await calc.checkResult('left', '0')
  })

  test('Первый операнд 0', async ({ calc }) => {
    await calc.clickOperation('+')
    await calc.clickNumber(1)
    await calc.clickResult()
    await calc.checkResult('left', '1')
  })

  test('Ввод отрицательного числа', async ({ calc }) => {
    await calc.clickOperation('-')
    await calc.clickNumber(2)
    await calc.checkResult('left', '-2')
  })

  test('Ввод числа начиная с точки', async ({ calc }) => {
    await calc.clickPoint()
    await calc.checkResult('left', '0.')
    await calc.clickNumber(2)
    await calc.checkResult('left', '0.2')
  })

  test('Клик на = игнорируется до ввода двух чисел', async ({ calc }) => {
    await calc.clickResult()
    await calc.checkResult('left', '0')
    await calc.clickNumber(2)
    await calc.clickResult()
    await calc.checkResult('left', '2')
  })
})
