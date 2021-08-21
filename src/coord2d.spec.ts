import { vectorSum } from './vector'

import {
  Coord2d,
  coord2dTranslate,
  coord2dScale,
  coord2dIsS,
  coord2dIsN,
  coord2dIsE,
  coord2dIsW,
} from './coord2d'

describe('coord2dTranslate(coord, delta)', () => {
  test('coord2dTranslate(coord, delta)', () => {
    expect(coord2dTranslate([0, 0], [20, 100])).toEqual([20, 100])
    expect(coord2dTranslate([0, 0], [-20, 100])).toEqual([-20, 100])
  })
})

describe('coord2dScale(coord, delta, origin)', () => {
  test('origin [0, 0]', () => {
    const coord = [10, 10] as Coord2d

    expect(coord2dScale(coord, [2, 2])).toEqual([20, 20])
    expect(coord2dScale(coord, [-2, -1.5])).toEqual([-20, -15])
  })

  test('origin [5, 5]', () => {
    const coord = [10, 10] as Coord2d
    const origin = [5, 5] as Coord2d

    expect(coord2dScale(coord, [2, 2], origin)).toEqual([15, 15])

    expect(coord2dScale(coord, [-2, -2], origin)).toEqual([-5, -5])
  })

  test('origin [15, 15]', () => {
    const coord = [10, 10] as Coord2d
    const origin = [15, 15] as Coord2d

    expect(coord2dScale(coord, [2, 2], origin)).toEqual([5, 5])
    expect(coord2dScale(coord, [-2, -2], origin)).toEqual([25, 25])
  })
})

describe('coord2dIs[DIRECTION](ref, coord)', () => {
  const REF = [0, 0] as Coord2d
  const S = [0, 1] as Coord2d
  const N = [0, -1] as Coord2d
  const E = [1, 0] as Coord2d
  const W = [-1, 0] as Coord2d
  const SE = vectorSum(S, E) as Coord2d
  const SW = vectorSum(S, W) as Coord2d
  const NE = vectorSum(N, E) as Coord2d
  const NW = vectorSum(N, W) as Coord2d

  test('coord2dIsS(ref, coord)', () => {
    expect(coord2dIsS(REF, REF)).toEqual(false)

    expect(coord2dIsS(REF, S)).toEqual(true)
    expect(coord2dIsS(REF, N)).toEqual(false)
    expect(coord2dIsS(REF, E)).toEqual(false)
    expect(coord2dIsS(REF, W)).toEqual(false)

    expect(coord2dIsS(REF, SE)).toEqual(true)
    expect(coord2dIsS(REF, SW)).toEqual(true)
    expect(coord2dIsS(REF, NE)).toEqual(false)
    expect(coord2dIsS(REF, NW)).toEqual(false)
  })
  test('coord2dIsN(ref, coord)', () => {
    expect(coord2dIsN(REF, REF)).toEqual(false)

    expect(coord2dIsN(REF, S)).toEqual(false)
    expect(coord2dIsN(REF, N)).toEqual(true)
    expect(coord2dIsN(REF, E)).toEqual(false)
    expect(coord2dIsN(REF, W)).toEqual(false)

    expect(coord2dIsN(REF, SE)).toEqual(false)
    expect(coord2dIsN(REF, SW)).toEqual(false)
    expect(coord2dIsN(REF, NE)).toEqual(true)
    expect(coord2dIsN(REF, NW)).toEqual(true)
  })
  test('coord2dIsE(ref, coord)', () => {
    expect(coord2dIsE(REF, REF)).toEqual(false)

    expect(coord2dIsE(REF, S)).toEqual(false)
    expect(coord2dIsE(REF, N)).toEqual(false)
    expect(coord2dIsE(REF, E)).toEqual(true)
    expect(coord2dIsE(REF, W)).toEqual(false)

    expect(coord2dIsE(REF, SE)).toEqual(true)
    expect(coord2dIsE(REF, SW)).toEqual(false)
    expect(coord2dIsE(REF, NE)).toEqual(true)
    expect(coord2dIsE(REF, NW)).toEqual(false)
  })
  test('coord2dIsW(ref, coord)', () => {
    expect(coord2dIsW(REF, REF)).toEqual(false)

    expect(coord2dIsW(REF, S)).toEqual(false)
    expect(coord2dIsW(REF, N)).toEqual(false)
    expect(coord2dIsW(REF, E)).toEqual(false)
    expect(coord2dIsW(REF, W)).toEqual(true)

    expect(coord2dIsW(REF, SE)).toEqual(false)
    expect(coord2dIsW(REF, SW)).toEqual(true)
    expect(coord2dIsW(REF, NE)).toEqual(false)
    expect(coord2dIsW(REF, NW)).toEqual(true)
  })
})
