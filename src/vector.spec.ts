import {
  vectorSum,
  vectorSub,
  vectorMult,
  vectorDiv,
  vectorMagnitude,
  vectorUnit,
  vectorRound,
  vectorCeil,
  vectorFloor,
} from './vector'

describe('vectorSum(vectors...)', () => {
  test('vectorSum(vectors...)', () => {
    expect(vectorSum([-20, -60], [80, 10], [30, 40])).toEqual([90, -10])
  })
})

describe('vectorSub(base, ...others)', () => {
  test('vectorSub(base, ...others)', () => {
    expect(vectorSub([-20, -60], [80, 10], [30, 40])).toEqual([-130, -110])
  })
})

describe('vectorMult(...vectors)', () => {
  test('vectorMult(...vectors)', () => {
    expect(vectorMult([-1, -2], [2, 2], [3, -4])).toEqual([-6, 16])
  })
})

describe('vectorDiv(...vectors)', () => {
  test('vectorDiv(...vectors)', () => {
    expect(vectorDiv([100, 200], [2, 2], [5, -4])).toEqual([10, -25])
  })
})

describe('vectorMagnitude(...vectors)', () => {
  test('vectorMagnitude(...vectors)', () => {
    expect(vectorMagnitude([1, 1])).toEqual(Math.sqrt(2))

    expect(vectorMagnitude([2, 7])).toEqual(Math.sqrt(4 + 49))
  })
})

describe('vectorUnit(vector)', () => {
  test('vectorUnit(vector)', () => {
    expect(vectorUnit([10, 10])).toEqual(vectorUnit([1, 1]))
    expect(vectorUnit([20, 10])).toEqual(vectorUnit([1, 0.5]))
  })
})

describe('vectorRound(vector)', () => {
  test('vectorRound(vector)', () => {
    expect(vectorRound([0.1, 0.4, 0.5, 0.6, 0.9])).toEqual([0, 0, 1, 1, 1])
  })
})

describe('vectorCeil(vector)', () => {
  test('vectorCeil(vector)', () => {
    expect(vectorCeil([0.1, 0.4, 0.5, 0.6, 0.9])).toEqual([1, 1, 1, 1, 1])
  })
})

describe('vectorFloor(vector)', () => {
  test('vectorFloor(vector)', () => {
    expect(vectorFloor([0.1, 0.4, 0.5, 0.6, 0.9])).toEqual([0, 0, 0, 0, 0])
  })
})
