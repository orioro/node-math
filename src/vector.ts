export type Vector = number[]

const vectorOp = (opFn, first: Vector, ...others: Vector[]): Vector =>
  others.reduce(
    (acc, next) => acc.map((value, index) => opFn(value, next[index])),
    first
  )

const sum = (a, b) => a + b
export const vectorSum = (first: Vector, ...others: Vector[]): Vector =>
  vectorOp(sum, first, ...others)

const sub = (a, b) => a - b
export const vectorSub = (first: Vector, ...others: Vector[]): Vector =>
  vectorOp(sub, first, ...others)

const mult = (a, b) => a * b
export const vectorMult = (first: Vector, ...others: Vector[]): Vector =>
  vectorOp(mult, first, ...others)

const div = (a, b) => a / b
export const vectorDiv = (first: Vector, ...others: Vector[]): Vector =>
  vectorOp(div, first, ...others)

export const vectorMagnitude = (vector: Vector): number =>
  Math.sqrt(vector.reduce((acc, v) => acc + Math.pow(v, 2), 0))

export const vectorUnit = (vector: Vector): Vector =>
  vectorScale(vector, 1 / vectorMagnitude(vector))

export const vectorScale = (vector: Vector, scalar: number): Vector =>
  vector.map((v) => v * scalar)

export const vectorRound = (vector: Vector): Vector =>
  vector.map((value) => Math.round(value))
export const vectorCeil = (vector: Vector): Vector =>
  vector.map((value) => Math.ceil(value))
export const vectorFloor = (vector: Vector): Vector =>
  vector.map((value) => Math.floor(value))
