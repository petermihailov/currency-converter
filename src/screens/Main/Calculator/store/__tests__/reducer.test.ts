import { describe, expect, it } from 'vitest'

import { reducer, INITIAL_STATE } from '../reducer.ts'

describe('Calculator reducer', () => {
  describe('Ввод числа', () => {
    it('Ввод целого числа 10', () => {
      const state1 = reducer(INITIAL_STATE, { type: 'decimal', payload: '1' })
      expect(state1).toEqual({
        ...INITIAL_STATE,
        currentValue: '1',
        overwrite: false,
      })

      const state2 = reducer(state1, { type: 'decimal', payload: '0' })
      expect(state2).toEqual({
        ...INITIAL_STATE,
        currentValue: '10',
        overwrite: false,
      })
    })

    it('Ввод дробного числа 1.5', () => {
      const state1 = reducer(INITIAL_STATE, { type: 'decimal', payload: '1' })
      expect(state1).toEqual({
        ...INITIAL_STATE,
        currentValue: '1',
        overwrite: false,
      })

      const state2 = reducer(state1, { type: 'decimal', payload: '.' })
      expect(state2).toEqual({
        ...INITIAL_STATE,
        currentValue: '1.',
        overwrite: false,
      })

      const state3 = reducer(state2, { type: 'decimal', payload: '5' })
      expect(state3).toEqual({
        ...INITIAL_STATE,
        currentValue: '1.5',
        overwrite: false,
      })
    })

    it('Ввод отрицательного числа -1', () => {
      const state1 = reducer(INITIAL_STATE, { type: 'operator', payload: '-' })
      expect(state1).toEqual({
        ...INITIAL_STATE,
        currentValue: '-',
        overwrite: false,
      })

      const state2 = reducer(state1, { type: 'decimal', payload: '1' })
      expect(state2).toEqual({
        ...INITIAL_STATE,
        currentValue: '-1',
        overwrite: false,
      })
    })

    it('Ввод отрицательного дробного числа -0.5', () => {
      const state1 = reducer(INITIAL_STATE, { type: 'operator', payload: '-' })
      expect(state1).toEqual({
        ...INITIAL_STATE,
        currentValue: '-',
        overwrite: false,
      })

      const state2 = reducer(state1, { type: 'decimal', payload: '.' })
      expect(state2).toEqual({
        ...INITIAL_STATE,
        currentValue: '-0.',
        overwrite: false,
      })

      const state3 = reducer(state2, { type: 'decimal', payload: '5' })
      expect(state3).toEqual({
        ...INITIAL_STATE,
        currentValue: '-0.5',
        overwrite: false,
      })
    })

    it('Ввод дробного числа начиная с точки', () => {
      const state1 = reducer(INITIAL_STATE, { type: 'decimal', payload: '.' })
      expect(state1).toEqual({
        ...INITIAL_STATE,
        currentValue: '0.',
        overwrite: false,
      })

      const state2 = reducer(state1, { type: 'decimal', payload: '1' })
      expect(state2).toEqual({
        ...INITIAL_STATE,
        currentValue: '0.1',
        overwrite: false,
      })
    })

    it('Нельзя ввести две точки в числе', () => {
      const state1 = reducer(INITIAL_STATE, { type: 'decimal', payload: '.' })
      expect(state1).toEqual({
        ...INITIAL_STATE,
        currentValue: '0.',
        overwrite: false,
      })

      const state2 = reducer(state1, { type: 'decimal', payload: '.' })
      expect(state2).toEqual({
        ...INITIAL_STATE,
        currentValue: '0.',
        overwrite: false,
      })

      const state3 = reducer(state2, { type: 'decimal', payload: '0' })
      expect(state3).toEqual({
        ...INITIAL_STATE,
        currentValue: '0.0',
        overwrite: false,
      })

      const state4 = reducer(state3, { type: 'decimal', payload: '.' })
      expect(state4).toEqual({
        ...INITIAL_STATE,
        currentValue: '0.0',
        overwrite: false,
      })
    })

    it('Нельзя ввести число 00', () => {
      const state1 = reducer(INITIAL_STATE, { type: 'decimal', payload: '0' })
      expect(state1).toEqual({
        ...INITIAL_STATE,
        currentValue: '0',
        overwrite: false,
      })

      const state2 = reducer(state1, { type: 'decimal', payload: '0' })
      expect(state2).toEqual({
        ...INITIAL_STATE,
        currentValue: '0',
        overwrite: false,
      })
    })
  })

  describe('Операции', () => {
    it('Сложение положительных целых чисел 2 + 3', () => {
      const state1 = reducer(INITIAL_STATE, { type: 'decimal', payload: '2' })
      expect(state1).toEqual({
        ...INITIAL_STATE,
        currentValue: '2',
        overwrite: false,
      })

      const state2 = reducer(state1, { type: 'operator', payload: '+' })
      expect(state2).toEqual({
        ...INITIAL_STATE,
        currentValue: '2',
        operator: '+',
        previousValue: '2',
        overwrite: true,
      })

      const state3 = reducer(state2, { type: 'decimal', payload: '3' })
      expect(state3).toEqual({
        ...INITIAL_STATE,
        currentValue: '3',
        operator: '+',
        previousValue: '2',
        overwrite: false,
      })

      const state4 = reducer(state3, { type: 'evaluate' })
      expect(state4).toEqual({
        currentValue: '5',
        lastOperand: '3',
        lastOperator: '+',
        operator: null,
        overwrite: true,
        previousValue: '5',
      })
    })

    it('Сложение отрицательного и положительного целых чисел –5 + 10', () => {
      const state1 = reducer(INITIAL_STATE, { type: 'operator', payload: '-' })
      expect(state1).toEqual({
        ...INITIAL_STATE,
        currentValue: '-',
        overwrite: false,
      })

      const state2 = reducer(state1, { type: 'decimal', payload: '5' })
      expect(state2).toEqual({
        ...INITIAL_STATE,
        currentValue: '-5',
        overwrite: false,
      })

      const state3 = reducer(state2, { type: 'operator', payload: '+' })
      expect(state3).toEqual({
        ...INITIAL_STATE,
        currentValue: '-5',
        operator: '+',
        overwrite: true,
        previousValue: '-5',
      })

      const state4 = reducer(state3, { type: 'decimal', payload: '1' })
      expect(state4).toEqual({
        ...INITIAL_STATE,
        currentValue: '1',
        operator: '+',
        overwrite: false,
        previousValue: '-5',
      })

      const state5 = reducer(state4, { type: 'decimal', payload: '0' })
      expect(state5).toEqual({
        ...INITIAL_STATE,
        currentValue: '10',
        operator: '+',
        overwrite: false,
        previousValue: '-5',
      })

      const state6 = reducer(state5, { type: 'evaluate' })
      expect(state6).toEqual({
        currentValue: '5',
        lastOperand: '10',
        lastOperator: '+',
        operator: null,
        overwrite: true,
        previousValue: '5',
      })
    })

    it('Сложение нуля с целым числом 0 + 7', () => {
      const state1 = reducer(
        {
          ...INITIAL_STATE,
          currentValue: '7',
          operator: '+',
          previousValue: '0',
          overwrite: false,
        },
        { type: 'evaluate' },
      )
      expect(state1).toEqual({
        currentValue: '7',
        lastOperand: '7',
        lastOperator: '+',
        operator: null,
        overwrite: true,
        previousValue: '7',
      })
    })

    it('Вычитание целого числа из целого числа 10 – 4', () => {
      const state1 = reducer(
        {
          ...INITIAL_STATE,
          currentValue: '4',
          operator: '-',
          previousValue: '10',
          overwrite: false,
        },
        { type: 'evaluate' },
      )
      expect(state1).toEqual({
        currentValue: '6',
        lastOperand: '4',
        lastOperator: '-',
        operator: null,
        overwrite: true,
        previousValue: '6',
      })
    })

    // it('Вычитание целого числа из отрицательного целого числа –3 – 6', () => {})

    it('Умножение целых чисел 4 * 5', () => {
      const state1 = reducer(
        {
          ...INITIAL_STATE,
          currentValue: '5',
          operator: '*',
          previousValue: '4',
          overwrite: false,
        },
        { type: 'evaluate' },
      )
      expect(state1).toEqual({
        currentValue: '20',
        lastOperand: '5',
        lastOperator: '*',
        operator: null,
        overwrite: true,
        previousValue: '20',
      })
    })

    // it('Умножение целых отрицательных чисел –2 * –8', () => {})

    it('Умножение на ноль 0 * 99', () => {
      const state1 = reducer(
        {
          ...INITIAL_STATE,
          currentValue: '99',
          operator: '*',
          previousValue: '0',
          overwrite: false,
        },
        { type: 'evaluate' },
      )
      expect(state1).toEqual({
        currentValue: '0',
        lastOperand: '99',
        lastOperator: '*',
        operator: null,
        overwrite: true,
        previousValue: '0',
      })
    })

    it('Деление целых чисел 20 / 4', () => {
      const state1 = reducer(
        {
          ...INITIAL_STATE,
          currentValue: '4',
          operator: '/',
          previousValue: '20',
          overwrite: false,
        },
        { type: 'evaluate' },
      )
      expect(state1).toEqual({
        currentValue: '5',
        lastOperand: '4',
        lastOperator: '/',
        operator: null,
        overwrite: true,
        previousValue: '5',
      })
    })

    it('Деление целых чисел 7 / 2', () => {
      const state1 = reducer(
        {
          ...INITIAL_STATE,
          currentValue: '2',
          operator: '/',
          previousValue: '7',
          overwrite: false,
        },
        { type: 'evaluate' },
      )
      expect(state1).toEqual({
        currentValue: '3.5',
        lastOperand: '2',
        lastOperator: '/',
        operator: null,
        overwrite: true,
        previousValue: '3.5',
      })
    })

    it('Деление отрицательного целого числа –15 / 3', () => {
      const state1 = reducer(
        {
          ...INITIAL_STATE,
          currentValue: '3',
          operator: '/',
          previousValue: '-15',
          overwrite: false,
        },
        { type: 'evaluate' },
      )
      expect(state1).toEqual({
        currentValue: '-5',
        lastOperand: '3',
        lastOperator: '/',
        operator: null,
        overwrite: true,
        previousValue: '-5',
      })
    })

    it('Деление на ноль 5 / 0', () => {
      const state1 = reducer(
        {
          ...INITIAL_STATE,
          currentValue: '0',
          operator: '/',
          previousValue: '5',
          overwrite: false,
        },
        { type: 'evaluate' },
      )
      expect(state1).toEqual({
        currentValue: 'Infinity',
        lastOperand: '0',
        lastOperator: '/',
        operator: null,
        overwrite: true,
        previousValue: 'Infinity',
      })
    })

    describe('FP-precision bug', () => {
      it('Сложение 0.1 + 0.2', () => {
        const state1 = reducer(
          {
            ...INITIAL_STATE,
            currentValue: '0.2',
            operator: '+',
            previousValue: '0.1',
            overwrite: false,
          },
          { type: 'evaluate' },
        )
        expect(state1).toEqual({
          currentValue: '0.3',
          lastOperand: '0.2',
          lastOperator: '+',
          operator: null,
          overwrite: true,
          previousValue: '0.3',
        })
      })

      it('Вычитание 0.3 – 0.1', () => {
        const state1 = reducer(
          {
            ...INITIAL_STATE,
            currentValue: '0.1',
            operator: '-',
            previousValue: '0.3',
            overwrite: false,
          },
          { type: 'evaluate' },
        )
        expect(state1).toEqual({
          currentValue: '0.2',
          lastOperand: '0.1',
          lastOperator: '-',
          operator: null,
          overwrite: true,
          previousValue: '0.2',
        })
      })

      it('Умножение 0.6 * 3', () => {
        const state1 = reducer(
          {
            ...INITIAL_STATE,
            currentValue: '3',
            operator: '*',
            previousValue: '0.6',
            overwrite: false,
          },
          { type: 'evaluate' },
        )
        expect(state1).toEqual({
          currentValue: '1.8',
          lastOperand: '3',
          lastOperator: '*',
          operator: null,
          overwrite: true,
          previousValue: '1.8',
        })
      })

      it('Деление 0.3 / 0.1', () => {
        const state1 = reducer(
          {
            ...INITIAL_STATE,
            currentValue: '0.1',
            operator: '/',
            previousValue: '0.3',
            overwrite: false,
          },
          { type: 'evaluate' },
        )
        expect(state1).toEqual({
          currentValue: '3',
          lastOperand: '0.1',
          lastOperator: '/',
          operator: null,
          overwrite: true,
          previousValue: '3',
        })
      })

      it('Округление 1.005 * 100', () => {
        const state1 = reducer(
          {
            ...INITIAL_STATE,
            currentValue: '100',
            operator: '*',
            previousValue: '1.005',
            overwrite: false,
          },
          { type: 'evaluate' },
        )
        expect(state1).toEqual({
          currentValue: '100.5',
          lastOperand: '100',
          lastOperator: '*',
          operator: null,
          overwrite: true,
          previousValue: '100.5',
        })
      })
    })

    describe('Edge-cases, округления', () => {
      it('Большие числа 123456789 * 987654321', () => {
        const state1 = reducer(
          {
            ...INITIAL_STATE,
            currentValue: '987654321',
            operator: '*',
            previousValue: '123456789',
            overwrite: false,
          },
          { type: 'evaluate' },
        )
        expect(state1).toEqual({
          currentValue: '121932631112635269',
          lastOperand: '987654321',
          lastOperator: '*',
          operator: null,
          overwrite: true,
          previousValue: '121932631112635269',
        })
      })

      it('Малые дроби 0.0000001 + 0.0000002', () => {
        const state1 = reducer(
          {
            ...INITIAL_STATE,
            currentValue: '0.0000002',
            operator: '+',
            previousValue: '0.0000001',
            overwrite: false,
          },
          { type: 'evaluate' },
        )
        expect(state1).toEqual({
          currentValue: '0.0000003',
          lastOperand: '0.0000002',
          lastOperator: '+',
          operator: null,
          overwrite: true,
          previousValue: '0.0000003',
        })
      })

      it('Смешанный тип 5 + 2.75', () => {
        const state1 = reducer(
          {
            ...INITIAL_STATE,
            currentValue: '2.75',
            operator: '+',
            previousValue: '5',
            overwrite: false,
          },
          { type: 'evaluate' },
        )
        expect(state1).toEqual({
          currentValue: '7.75',
          lastOperand: '2.75',
          lastOperator: '+',
          operator: null,
          overwrite: true,
          previousValue: '7.75',
        })
      })

      it('Смешанный тип 10.5 – 3', () => {
        const state1 = reducer(
          {
            ...INITIAL_STATE,
            currentValue: '3',
            operator: '-',
            previousValue: '10.5',
            overwrite: false,
          },
          { type: 'evaluate' },
        )
        expect(state1).toEqual({
          currentValue: '7.5',
          lastOperand: '3',
          lastOperator: '-',
          operator: null,
          overwrite: true,
          previousValue: '7.5',
        })
      })

      it('Бесконечное деление 1 / 3', () => {
        const state1 = reducer(
          {
            ...INITIAL_STATE,
            currentValue: '3',
            operator: '/',
            previousValue: '1',
            overwrite: false,
          },
          { type: 'evaluate' },
        )
        expect(state1).toEqual({
          currentValue: '0.33333333333333333333',
          lastOperand: '3',
          lastOperator: '/',
          operator: null,
          overwrite: true,
          previousValue: '0.33333333333333333333',
        })
      })

      it('Бесконечное деление 1 / 6', () => {
        const state1 = reducer(
          {
            ...INITIAL_STATE,
            currentValue: '6',
            operator: '/',
            previousValue: '1',
            overwrite: false,
          },
          { type: 'evaluate' },
        )
        expect(state1).toEqual({
          currentValue: '0.16666666666666666667',
          lastOperand: '6',
          lastOperator: '/',
          operator: null,
          overwrite: true,
          previousValue: '0.16666666666666666667',
        })
      })
    })
  })
})
