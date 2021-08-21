import {
  Interval,
  intervalContainsValue,
  intervalContainingValues,
} from './interval'

import { Set, setIntersection } from './set'

import { Vector, vectorSum, vectorMult, vectorSub, vectorUnit } from './vector'

import {
  Coord2d,
  coord2dTranslate,
  coord2dScale,
  coord2dIsS,
  coord2dIsN,
  coord2dIsE,
  coord2dIsW,
} from './coord2d'

export type Rect = [Coord2d, Coord2d]

export const rectIntervalOnAxis = (
  axisCoordinateValue: (Coord2d) => number,
  [c0, c1]: Rect
): Interval => {
  const v0 = axisCoordinateValue(c0)
  const v1 = axisCoordinateValue(c1)

  return v1 > v0 ? [v0, v1] : [v1, v0]
}

export const rectIntervalOnX = rectIntervalOnAxis.bind(null, ([x]) => x)
export const rectIntervalOnY = rectIntervalOnAxis.bind(null, ([, y]) => y)

export const rectIsValid = ([[x0, y0], [x1, y1]]: Rect): boolean =>
  x0 !== x1 && y0 !== y1

export const rectDirection = ([c0, c1]: Rect): Vector =>
  vectorUnit(vectorSub(c1, c0))

export const rectRelativePosition = (rect: Rect, pos: Vector): Coord2d =>
  vectorSum(rect[0], vectorMult(pos, vectorSub(rect[1], rect[0]))) as Coord2d

export const rectCenter = ([[x0, y0], [x1, y1]]: Rect): Coord2d => [
  (x0 + x1) / 2,
  (y0 + y1) / 2,
]

const rectLengthOnAxis = (
  axisInterval: (rect: Rect) => Interval,
  rect: Rect
): number => {
  const [v0, v1] = axisInterval(rect)

  return v1 - v0
}

export const rectWidth = rectLengthOnAxis.bind(null, rectIntervalOnX)
export const rectHeight = rectLengthOnAxis.bind(null, rectIntervalOnY)

export const rectTranslate = ([c0, c1]: Rect, delta: Vector): Rect => [
  coord2dTranslate(c0, delta),
  coord2dTranslate(c1, delta),
]

export const rectScale = (
  [c0, c1]: Rect,
  delta: Vector,
  origin: Coord2d = [0, 0]
): Rect => [coord2dScale(c0, delta, origin), coord2dScale(c1, delta, origin)]

export const rectContainsCoord = (
  rect: Rect,
  ...coords: Coord2d[]
): boolean => {
  const xInterval = rectIntervalOnX(rect)
  const yInterval = rectIntervalOnY(rect)

  return coords.every(
    ([x, y]) =>
      intervalContainsValue(xInterval, x) && intervalContainsValue(yInterval, y)
  )
}

const rectIntersectsionOnAxis = (
  axisInterval: (rect: Rect) => Interval,
  rect: Rect,
  ...rects: Rect[]
): Set =>
  setIntersection(
    [axisInterval(rect)],
    ...rects.map((rect) => [axisInterval(rect)])
  )

const rectIntersectsOnAxis = (
  axisInterval: (rect: Rect) => Interval,
  rect: Rect,
  ...rects: Rect[]
): boolean => rectIntersectsionOnAxis(axisInterval, rect, ...rects).length > 0

export const rectIntersectionOnY = rectIntersectsionOnAxis.bind(
  null,
  rectIntervalOnY
)
export const rectIntersectsOnY = rectIntersectsOnAxis.bind(
  null,
  rectIntervalOnY
)

export const rectIntersectionOnX = rectIntersectsionOnAxis.bind(
  null,
  rectIntervalOnX
)
export const rectIntersectsOnX = rectIntersectsOnAxis.bind(
  null,
  rectIntervalOnX
)

export const rectIntersectionRect = (
  rect: Rect,
  ...rects: Rect[]
): Rect | null => {
  const xIntersection = rectIntersectionOnX(rect, ...rects)
  const yIntersection = rectIntersectionOnY(rect, ...rects)

  return xIntersection.length > 0 && yIntersection.length > 0
    ? [
        [xIntersection[0][0], yIntersection[0][0]],
        [xIntersection[0][1], yIntersection[0][1]],
      ]
    : null
}

export const rectIntersects = (rect: Rect, ...rects: Rect[]): boolean =>
  Boolean(rectIntersectionRect(rect, ...rects))

export const rectContainingCoords = ([first, ...coords]: Coord2d[]): Rect => {
  const [[x0, x1], [y0, y1]] = coords.reduce(
    ([xInterval, yInterval], [x, y]) => [
      intervalContainingValues([...xInterval, x]),
      intervalContainingValues([...yInterval, y]),
    ],
    [
      [first[0], first[0]],
      [first[1], first[1]],
    ]
  )

  return [
    [x0, y0],
    [x1, y1],
  ]
}

export const rectIsS = ([, [refX1, refY1]]: Rect, [rect0]: Rect): boolean =>
  coord2dIsS([refX1, refY1 - 1], rect0)

export const rectIsN = ([ref0]: Rect, [, [rectX1, rectY1]]: Rect): boolean =>
  coord2dIsN(ref0, [rectX1, rectY1 - 1])

export const rectIsE = ([, [refX1, refY1]]: Rect, [rect0]: Rect): boolean =>
  coord2dIsE([refX1 - 1, refY1], rect0)

export const rectIsW = ([ref0]: Rect, [, [rectX1, rectY1]]: Rect): boolean =>
  coord2dIsW(ref0, [rectX1 - 1, rectY1])

export const rectDistanceX = (rect0: Rect, rect1: Rect): number =>
  rectIsE(rect0, rect1)
    ? rect1[0][0] - rect0[1][0]
    : rectIsW(rect0, rect1)
    ? rect0[0][0] - rect1[1][0]
    : 0

export const rectDistanceY = (rect0: Rect, rect1: Rect): number =>
  rectIsS(rect0, rect1)
    ? rect1[0][1] - rect0[1][1]
    : rectIsN(rect0, rect1)
    ? rect0[0][1] - rect1[1][1]
    : 0
