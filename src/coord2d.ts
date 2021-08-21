import {
  Vector,
  vectorSum,
  vectorSub,
  vectorMult
} from './vector'

export type Coord2d = [number, number]

export const coord2dTranslate = (
  coord:Coord2d,
  delta:Vector
):Coord2d => vectorSum(coord, delta) as Coord2d

export const coord2dScale = (
  coord:Coord2d,
  delta:Vector,
  origin:Coord2d = [0, 0]
):Coord2d => vectorSum(
  origin,
  vectorMult(
    delta,
    vectorSub(
      coord,
      origin
    )
  )
) as Coord2d

export const coord2dIsS = (
  [, refY]:Coord2d,
  [, coordY]:Coord2d
):boolean => coordY > refY

export const coord2dIsN = (
  [, refY]:Coord2d,
  [, coordY]:Coord2d
):boolean => coordY < refY

export const coord2dIsE = (
  [refX]:Coord2d,
  [pointX]:Coord2d
):boolean => pointX > refX

export const coord2dIsW = (
  [refX]:Coord2d,
  [pointX]:Coord2d
):boolean => pointX < refX
