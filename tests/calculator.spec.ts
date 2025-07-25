import { test } from './fixtures'

// TC-02: Повтор последней операции
// Ввод: '2', '+', '3', '=', '='
//
// Ожидаемый результат: 8
// (2 + 3 = 5, 5 + 3 = 8)
//
// TC-03: Последовательные операции без =
//   Ввод: '2', '+', '3', '+', '4', '='
//
// Ожидаемый результат: 9
// (2 + 3 = 5, 5 + 4 = 9)
//
// TC-04: Умножение с повтором
// Ввод: '5', '*', '2', '=', '=', '='
//
// Ожидаемый результат: 40
// (5 * 2 = 10, 10 * 2 = 20, 20 * 2 = 40)
//
// 🔁 Повтор операции
// TC-05: Повтор без второй операции
// Ввод: '6', '*', '='
//
// Ожидаемый результат: 36
// (6 * 6 = 36 — повторяется ввод самого числа)
//
// 🧮 Сброс и очистка
// TC-06: Очистка последнего ввода
// Ввод: '1', '2', 'C', '3', '+', '4', '='
//
// Ожидаемый результат: 7
// (после 12, нажали C — стерли, набрали 3 + 4)
//
// TC-07: Полный сброс
// Ввод: '9', '+', '1', 'AC', '7', '+', '1', '='
//
// Ожидаемый результат: 8
// (после сброса идёт новая операция)
//
// 🧮 Граничные случаи
// TC-08: Деление на ноль
// Ввод: '8', '/', '0', '='
//
// Ожидаемый результат: Ошибка или Infinity
//
// TC-09: Нажатие = без операций
// Ввод: '5', '='
//
// Ожидаемый результат: 5
//
// TC-10: Множественные =
//   Ввод: '1', '+', '2', '=', '=', '=', '='
//
// Ожидаемый результат: 9
// (1+2=3, +2=5, +2=7, +2=9)
//
// 🧹 Дополнительные тесты
// TC-11: Ввод с десятичными
// Ввод: '1', '.', '5', '+', '2', '.', '3', '='
//
// Ожидаемый результат: 3.8
//
// TC-12: Отрицательные числа (если поддерживаются)
// Ввод: '-', '3', '+', '5', '='
//
// Ожидаемый результат: 2

test.beforeEach(async ({ page, calc }) => {
  await page.goto('http://localhost:5173/')
  await calc.clickLeft()
})

test.describe('Операции', () => {
  test('Простое сложение', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('+')
    await calc.clickNumber(3)
    await calc.clickOperation('result')
    await calc.checkResult('left', '5')
  })

  test('Простое вычитание', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('-')
    await calc.clickNumber(3)
    await calc.clickOperation('result')
    await calc.checkResult('left', '-1')
  })

  test('Простое умножение', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('*')
    await calc.clickNumber(3)
    await calc.clickOperation('result')
    await calc.checkResult('left', '6')
  })

  test('Простое деление', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('/')
    await calc.clickNumber(3)
    await calc.clickOperation('result')
    await calc.checkResult('left', '0.6666666666666666')
  })

  test.only('Сложение трех чисел', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('+')
    await calc.clickNumber(3)
    await calc.clickOperation('+')
    await calc.clickNumber(5)
    await calc.clickOperation('result')
    await calc.checkResult('left', '10')
  })

  test('Вычитание трех чисел', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('-')
    await calc.clickNumber(3)
    await calc.clickOperation('-')
    await calc.clickNumber(5)
    await calc.clickOperation('result')
    await calc.checkResult('left', '-6')
  })

  test('Вычитание трех чисел с первым отрицательным числом', async ({ calc }) => {
    await calc.clickOperation('-')
    await calc.clickNumber(2)
    await calc.clickOperation('-')
    await calc.clickNumber(3)
    await calc.clickOperation('-')
    await calc.clickNumber(5)
    await calc.clickOperation('result')
    await calc.checkResult('left', '-10')
  })

  test('Умножение трех чисел', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('+')
    await calc.clickNumber(3)
    await calc.clickOperation('result')
    await calc.checkResult('left', '5')
  })

  test('Деление трех чисел', async ({ calc }) => {
    await calc.clickNumber(2)
    await calc.clickOperation('+')
    await calc.clickNumber(3)
    await calc.clickOperation('result')
    await calc.checkResult('left', '5')
  })

  // test('Последовательные операции без =', async ({ calc }) => {
  //   await page.goto('http://localhost:5173/')
  // })
})

// test.describe('Повтор операции', () => {
//   test('Умножение с повтором', async ({ calc }) => {
//     await page.goto('http://localhost:5173/')
//   })
//
// test('Повтор последней операции', async ({ calc }) => {
//   await page.goto('http://localhost:5173/')
// })
//
//   test('Повтор без второй операции', async ({ calc }) => {
//     await page.goto('http://localhost:5173/')
//   })
// })
//
// test.describe('Сброс и очистка', () => {
//   test('Очистка последнего ввода', async ({ calc }) => {
//     await page.goto('http://localhost:5173/')
//   })
//
//   test('Полный сброс', async ({ calc }) => {
//     await page.goto('http://localhost:5173/')
//   })
// })
//
// test.describe('Граничные случаи', () => {
//   test('Деление на ноль', async ({ calc }) => {
//     await page.goto('http://localhost:5173/')
//   })
//
//   test('Нажатие = без операций', async ({ calc }) => {
//     await page.goto('http://localhost:5173/')
//   })
// })
