export type Interval = [number, number]

export const intervalContainsValue = (
  [start, end]: Interval,
  value: number
) => (
  start <= value &&
  end >= value
)

export const intervalContainsInterval = (
  [start, end]: Interval,
  [valueStart, valueEnd]: Interval
) => (
  start <= valueStart &&
  end >= valueEnd
)

export const intervalContains = (
  interval: Interval,
  ...values: (Interval | number)[]
):boolean => values.every(value => (
  typeof value === 'number'
    ? intervalContainsValue(interval, value)
    : intervalContainsInterval(interval, value)
))

export const intervalContainingValues = (
  [first, ...values]:number[]
):Interval => values.reduce(([currentStart, currentEnd], value) => (
  value < currentStart
    ? [value, currentEnd]
    : value > currentEnd
      ? [currentStart, value]
      : [currentStart, currentEnd]
), [first, first])
