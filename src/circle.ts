import { Coord2d, coord2dTranslate } from './coord2d'

import { Rect } from './rect'

import { Vector } from './vector'

export type Circle = [Coord2d, number] // [[cx, cy], radius]

export const circleRect = ([[cx, cy], radius]: Circle): Rect => [
  [cx - radius, cy - radius],
  [cx + radius, cy + radius],
]

export const circleTranslate = (
  [center, radius]: Circle,
  delta: Vector
): Circle => [coord2dTranslate(center, delta), radius]
