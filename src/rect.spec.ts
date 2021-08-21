import {
  Rect,
  rectCenter,
  rectContainsCoord,
  rectIntervalOnX,
  rectIntervalOnY,
  rectDirection,
  rectRelativePosition,
  rectWidth,
  rectHeight,
  rectTranslate,
  rectIntersectionOnY,
  rectIntersectsOnY,
  rectIntersectionOnX,
  rectIntersectsOnX,
  rectIntersectionRect,
  rectIntersects,
  rectContainingCoords,
  rectIsS,
  rectIsN,
  rectIsE,
  rectIsW,
  rectScale,
  rectDistanceX,
  rectDistanceY
} from './rect'

import {
  Coord2d
} from './coord2d'

import {
  vectorMult,
  vectorSub
} from './vector'

//      -15   -5    5     15
//      |     |     |     |
// -15_ ___________________
//      |     |     |     |
//      | r00 | r10 | r20 |
//  -5_ |_____|_____|_____|
//      |     |     |     |
//      | r01 | r11 | r21 |
//   5_ |_____|_____|_____|
//      |     |     |     |
//      | r02 | r12 | r22 |
//  15_ |_____|_____|_____|
//

const r00_start = [-15, -15] as Coord2d
const r00_end   = [-5, -5] as Coord2d
const r01_start = [-15, -5] as Coord2d
const r01_end   = [-5, 5] as Coord2d
const r02_start = [-15, 5] as Coord2d
const r02_end   = [-5, 15] as Coord2d

const r10_start = [-5, -15] as Coord2d
const r10_end   = [5, -5] as Coord2d
const r11_start = r00_end as Coord2d
const r11_end   = [5, 5] as Coord2d
const r12_start = r01_end as Coord2d
const r12_end   = [5, 15] as Coord2d

const r20_start = [5, -15] as Coord2d
const r20_end   = [15, -5] as Coord2d
const r21_start = r10_end as Coord2d
const r21_end   = [15, 5] as Coord2d
const r22_start = r11_end as Coord2d
const r22_end   = [15, 15] as Coord2d

const r00 = [r00_start, r00_end] as Rect
const r01 = [r01_start, r01_end] as Rect
const r02 = [r02_start, r02_end] as Rect
const r10 = [r10_start, r10_end] as Rect
const r11 = [r11_start, r11_end] as Rect
const r12 = [r12_start, r12_end] as Rect
const r20 = [r20_start, r20_end] as Rect
const r21 = [r21_start, r21_end] as Rect
const r22 = [r22_start, r22_end] as Rect

describe('rectCenter', () => {
  test('r00', () => {
    expect(rectCenter(r00))
      .toEqual([-10, -10])
  })
  test('r11', () => {
    expect(rectCenter(r11))
      .toEqual([0, 0])
  })
})

describe('rect[AXIS]Interval(rect)', () => {
  const rect = [[20, 80], [100, 200]] as Rect

  test('rectIntervalOnY(rect)', () => {
    expect(rectIntervalOnY(rect)).toEqual([80, 200])
  })
  test('rectIntervalOnX(rect)', () => {
    expect(rectIntervalOnX(rect)).toEqual([20, 100])
  })
})

describe('rectRelativePosition(rect, pos)', () => {
  const rect = [[20, 80], [100, 200]] as Rect

  test('[1/2, 1/2]', () => {
    expect(rectRelativePosition(rect, [1/2, 1/2]))
      .toEqual([60, 140])
  })

  test('[1, 1]', () => {
    expect(rectRelativePosition(rect, [1, 1]))
      .toEqual(rect[1])
  })

  test('[0, 0]', () => {
    expect(rectRelativePosition(rect, [0, 0]))
      .toEqual(rect[0])
  })
})

describe('rect[DIMENSION](rect)', () => {
  const rect = [[20, 80], [100, 200]] as Rect

  test('rectWidth(rect)', () => {
    expect(rectWidth(rect)).toEqual(80)
  })

  test('rectHeight(rect)', () => {
    expect(rectHeight(rect)).toEqual(120)
  })
})

describe('rectTranslate(rect, delta)', () => {
  const rect = [[20, 80], [100, 200]] as Rect

  test('', () => {
    expect(rectTranslate(rect, [20, 100]))
      .toEqual([
        [40, 180],
        [120, 300]
      ])
  })
})

describe('rectContainsCoord(rect, ...points)', () => {
  test('both within', () => {
    const rect:Rect = [[-20, 100], [20, 200]]

    expect(rectContainsCoord(rect, [15, 120]))
      .toEqual(true)
  })

  test('both at lower boundary', () => {
    const rect:Rect = [[-20, 100], [20, 200]]

    expect(rectContainsCoord(rect, [-20, 100]))
      .toEqual(true)
  })

  test('both at upper boundary', () => {
    const rect:Rect = [[-20, 100], [20, 200]]

    expect(rectContainsCoord(rect, [20, 200]))
      .toEqual(true)
  })

  test('x lower than boundary', () => {
    const rect:Rect = [[-20, 100], [20, 200]]

    expect(rectContainsCoord(rect, [-21, 200]))
      .toEqual(false)
  })

  test('y lower than boundary', () => {
    const rect:Rect = [[-20, 100], [20, 200]]

    expect(rectContainsCoord(rect, [0, 99]))
      .toEqual(false)
  })
})

describe('rectScale(rect, delta, origin)', () => {
  test('r11, r21, r12 and r22; origin r11_start; delta [2, 2]', () => {
    const origin = r11_start
    const delta = [2, 2]

    const r11_ = rectScale(r11, delta, origin)
    const r21_ = rectScale(r21, delta, origin)
    const r12_ = rectScale(r12, delta, origin)
    const r22_ = rectScale(r22, delta, origin)

    //      -15   -5    5     15
    //      |     |     |     |
    // -15_ ___________________
    //      |     |     |     |
    //      | r00 | r10 | r20 |
    //  -5_ |_____+_____|_____|
    //      |     |     |     |
    //      | r01 | r11 | r21 |
    //   5_ |_____|_____|_____|
    //      |     |     |     |
    //      | r02 | r12 | r22 |
    //  15_ |_____|_____|_____|
    //
    // TO
    //
    //      -15   -5    5     15          35
    //      |     |     |     |           |
    // -15_ ___________________
    //      |     |     |     |
    //      | r00 | r10 | r20 |
    //  -5_ |_____+_____|_____|____________
    //      |     |           |           |
    //      | r01 |           |           |
    //   5_ |_____|   r11_    |   r21_    |
    //      |     |           |           |
    //      | r02 |           |           |
    //  15_ |_____|___________|___________|
    //            |           |           |
    //            |           |           |
    //            |   r12_    |   r22_    |
    //            |           |           |
    //            |           |           |
    //  35_       |___________|___________|

    expect(r11_).toEqual([
      [-5, -5],
      [15, 15]
    ])
    expect(r21_).toEqual([
      [15, -5],
      [35, 15]
    ])
    expect(r12_).toEqual([
      [-5, 15],
      [15, 35]
    ])
    expect(r22_).toEqual([
      [15, 15],
      [35, 35]
    ])
  })

  test('r01, r11, r21, r02, r12 and r22; origin r11_start; delta [-2, 1]', () => {
    const origin = r01_start
    const delta = [-2, 1]

    const r01_ = rectScale(r01, delta, origin)
    const r11_ = rectScale(r11, delta, origin)
    const r21_ = rectScale(r21, delta, origin)

    const r02_ = rectScale(r02, delta, origin)
    const r12_ = rectScale(r12, delta, origin)
    const r22_ = rectScale(r22, delta, origin)

    //      -15   -5    5     15
    //      |     |     |     |
    // -15_ ___________________
    //      |     |     |     |
    //      | r00 | r10 | r20 |
    //  -5_ +_____|_____|_____|
    //      |     |     |     |
    //      | r01 | r11 | r21 |
    //   5_ |_____|_____|_____|
    //      |     |     |     |
    //      | r02 | r12 | r22 |
    //  15_ |_____|_____|_____|
    //
    // TO
    //
    //      -75         -55         -35         -15   -5    5     15
    //      |           |           |           |     |     |     |
    // -15_                                     ___________________
    //                                          |     |     |     |
    //                                          | r00 | r10 | r20 |
    //  -5_ ____________________________________+_____|_____|_____|
    //      |           |           |           |
    //      |   r21_    |   r11_    |   r01_    |
    //   5_ |___________|___________|___________|
    //      |           |           |           |
    //      |   r22_    |   r12_    |   r02_    |
    //  15_ |___________|___________|___________|

    expect(r01_).toEqual([
      [-15, -5],
      [-35, 5]
    ])
    expect(r02_).toEqual([
      [-15, 5],
      [-35, 15]
    ])

    expect(r11_).toEqual([
      [-35, -5],
      [-55, 5]
    ])
    expect(r12_).toEqual([
      [-35, 5],
      [-55, 15]
    ])

    expect(r21_).toEqual([
      [-55, -5],
      [-75, 5]
    ])
    expect(r22_).toEqual([
      [-55, 5],
      [-75, 15]
    ])
  })
})

describe('rects[AXIS]IntersectionSet(rect, ...rects), rect[AXIS]Intersect(rect, ...rects)', () => {

  test('r00 and r22 (no intersection)', () => {
    expect(rectIntersectsOnY(r00, r22)).toEqual(false)
    expect(rectIntersectsOnX(r00, r22)).toEqual(false)
  })

  test('[r00_start, r22_end] and r11 (containing)', () => {
    expect(rectIntersectionOnY(
      [r00_start, r22_end],
      r11
    ))
    .toEqual([rectIntervalOnY(r11)])

    expect(rectIntersectionOnX(
      [r00_start, r22_end],
      r11
    ))
    .toEqual([rectIntervalOnX(r11)])
  })

  test('[r00_start, r11_end] and [r11_start, r22_end] (overlapping)', () => {
    const first = [r00_start, r11_end]
    const other = [r11_start, r22_end]

    expect(rectIntersectionOnY(first, other))
      .toEqual([rectIntervalOnY(r11)])

    expect(rectIntersectionOnX(first, other))
      .toEqual([rectIntervalOnX(r11)])

    expect(rectIntersectionRect(first, other))
      .toEqual(r11)
  })

  test('r00 and r01 (exact on x, tangential on y)', () => {
    expect(rectIntersectionOnY(r00, r01))
      .toEqual([[r00_end[1], r00_end[1]]])
    expect(rectIntersectionOnX(r00, r01))
      .toEqual([rectIntervalOnX(r00)])
    expect(rectIntersectionRect(r00, r01))
      .toEqual([
        [r00_start[0], r00_end[1]],
        [r00_end[1], r00_end[1]]
      ])
  })

  test('[r00_start, r10_end], [r10_start, r20_end] and r22 (2 overlapping + 1 out)', () => {
    const first = [r00_start, r10_end] as Rect
    const second = [r10_start, r20_end] as Rect

    expect(rectIntersects(first, second)).toEqual(true)
    expect(rectIntersects(first, second, r22)).toEqual(false)
    expect(rectIntersects(first, r22)).toEqual(false)
    expect(rectIntersects(second, r22)).toEqual(false)

    expect(rectIntersectsOnY(first, r22)).toEqual(false)
    expect(rectIntersectsOnY(second, r22)).toEqual(false)

    expect(rectIntersectionOnX(first, r22))
      .toEqual([[r10_end[0], r10_end[0]]]) // tangential
    expect(rectIntersectionOnX(second, r22))
      .toEqual([rectIntervalOnX(r22)]) // containing
  })
})

describe('rectContainingCoords(coords)', () => {
  test('', () => {
    expect(rectContainingCoords([
      [20, 20],
      [100, 0],
      [50, 80],
      [50, -80],
      [10, 200]
    ]))
    .toEqual([
      [10, -80],
      [100, 200]
    ])
  })
})

describe('rectIs[DIRECTION](ref, coord)', () => {
  //      -15   -5    5     15
  //      |     |     |     |
  // -15_ ___________________
  //      |     |     |     |
  //      | r00 | r10 | r20 |
  //  -5_ |_____|_____|_____|
  //      |     |     |     |
  //      | r01 | r11 | r21 |
  //   5_ |_____|_____|_____|
  //      |     |     |     |
  //      | r02 | r12 | r22 |
  //  15_ |_____|_____|_____|
  //

  const REF = r11
  const S = r12
  const N = r10
  const E = r21
  const W = r01

  const SE = r22
  const SW = r02
  const NE = r20
  const NW = r00

  test('rectIsS(ref, coord)', () => {
    expect(rectIsS(REF, REF)).toEqual(false)

    expect(rectIsS(REF, S)).toEqual(true)
    expect(rectIsS(REF, N)).toEqual(false)
    expect(rectIsS(REF, E)).toEqual(false)
    expect(rectIsS(REF, W)).toEqual(false)

    expect(rectIsS(REF, SE)).toEqual(true)
    expect(rectIsS(REF, SW)).toEqual(true)
    expect(rectIsS(REF, NE)).toEqual(false)
    expect(rectIsS(REF, NW)).toEqual(false)
  })
  test('rectIsN(ref, coord)', () => {
    expect(rectIsN(REF, REF)).toEqual(false)

    expect(rectIsN(REF, S)).toEqual(false)
    expect(rectIsN(REF, N)).toEqual(true)
    expect(rectIsN(REF, E)).toEqual(false)
    expect(rectIsN(REF, W)).toEqual(false)

    expect(rectIsN(REF, SE)).toEqual(false)
    expect(rectIsN(REF, SW)).toEqual(false)
    expect(rectIsN(REF, NE)).toEqual(true)
    expect(rectIsN(REF, NW)).toEqual(true)
  })
  test('rectIsE(ref, coord)', () => {
    expect(rectIsE(REF, REF)).toEqual(false)

    expect(rectIsE(REF, S)).toEqual(false)
    expect(rectIsE(REF, N)).toEqual(false)
    expect(rectIsE(REF, E)).toEqual(true)
    expect(rectIsE(REF, W)).toEqual(false)

    expect(rectIsE(REF, SE)).toEqual(true)
    expect(rectIsE(REF, SW)).toEqual(false)
    expect(rectIsE(REF, NE)).toEqual(true)
    expect(rectIsE(REF, NW)).toEqual(false)
  })
  test('rectIsW(ref, coord)', () => {
    expect(rectIsW(REF, REF)).toEqual(false)

    expect(rectIsW(REF, S)).toEqual(false)
    expect(rectIsW(REF, N)).toEqual(false)
    expect(rectIsW(REF, E)).toEqual(false)
    expect(rectIsW(REF, W)).toEqual(true)

    expect(rectIsW(REF, SE)).toEqual(false)
    expect(rectIsW(REF, SW)).toEqual(true)
    expect(rectIsW(REF, NE)).toEqual(false)
    expect(rectIsW(REF, NW)).toEqual(true)
  })
})

describe('rectDistanceX(rect0, rect1)', () => {
  //      -15   -5    5     15
  //      |     |     |     |
  // -15_ ___________________
  //      |     |     |     |
  //      | r00 | r10 | r20 |
  //  -5_ |_____|_____|_____|
  //      |     |     |     |
  //      | r01 | r11 | r21 |
  //   5_ |_____|_____|_____|
  //      |     |     |     |
  //      | r02 | r12 | r22 |
  //  15_ |_____|_____|_____|
  //

  test('r00 and r0Y', () => {
    expect(rectDistanceX(r00, r00)).toEqual(0)

    expect(rectDistanceX(r00, r01)).toEqual(0)
    expect(rectDistanceX(r01, r00)).toEqual(0)

    expect(rectDistanceX(r00, r02)).toEqual(0)
    expect(rectDistanceX(r02, r00)).toEqual(0)
  })

  test('r00 and r1Y', () => {
    expect(rectDistanceX(r00, r10)).toEqual(0)
    expect(rectDistanceX(r10, r00)).toEqual(0)

    expect(rectDistanceX(r00, r11)).toEqual(0)
    expect(rectDistanceX(r11, r00)).toEqual(0)

    expect(rectDistanceX(r00, r12)).toEqual(0)
    expect(rectDistanceX(r12, r00)).toEqual(0)
  })

  test('r00 and r2Y', () => {
    expect(rectDistanceX(r00, r20)).toEqual(10)
    expect(rectDistanceX(r20, r00)).toEqual(10)

    expect(rectDistanceX(r00, r21)).toEqual(10)
    expect(rectDistanceX(r21, r00)).toEqual(10)

    expect(rectDistanceX(r00, r22)).toEqual(10)
    expect(rectDistanceX(r22, r00)).toEqual(10)
  })
})

describe('rectDistanceY(rect0, rect1)', () => {
  //      -15   -5    5     15
  //      |     |     |     |
  // -15_ ___________________
  //      |     |     |     |
  //      | r00 | r10 | r20 |
  //  -5_ |_____|_____|_____|
  //      |     |     |     |
  //      | r01 | r11 | r21 |
  //   5_ |_____|_____|_____|
  //      |     |     |     |
  //      | r02 | r12 | r22 |
  //  15_ |_____|_____|_____|
  //

  test('r00 and rX0', () => {
    expect(rectDistanceY(r00, r00)).toEqual(0)

    expect(rectDistanceY(r00, r10)).toEqual(0)
    expect(rectDistanceY(r10, r00)).toEqual(0)

    expect(rectDistanceY(r00, r20)).toEqual(0)
    expect(rectDistanceY(r20, r00)).toEqual(0)
  })

  test('r00 and rX1', () => {
    expect(rectDistanceY(r00, r01)).toEqual(0)
    expect(rectDistanceY(r01, r00)).toEqual(0)

    expect(rectDistanceY(r00, r11)).toEqual(0)
    expect(rectDistanceY(r11, r00)).toEqual(0)

    expect(rectDistanceY(r00, r21)).toEqual(0)
    expect(rectDistanceY(r21, r00)).toEqual(0)
  })

  test('r00 and rX2', () => {
    expect(rectDistanceY(r00, r02)).toEqual(10)
    expect(rectDistanceY(r02, r00)).toEqual(10)

    expect(rectDistanceY(r00, r12)).toEqual(10)
    expect(rectDistanceY(r12, r00)).toEqual(10)

    expect(rectDistanceY(r00, r22)).toEqual(10)
    expect(rectDistanceY(r22, r00)).toEqual(10)
  })
})

