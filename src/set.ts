import {
  Interval,
  intervalContainsValue,
  intervalContains
} from './interval'

// For TypeScript
// https://github.com/microsoft/TypeScript/issues/16069#issuecomment-557540056
function isNotNull<T>(it: T): it is NonNullable<T> {
  return it != null
}

export type Set = Interval[]

export const setContains = (
  setIntervals: Set,
  ...values: (Interval | number)[]
):boolean => values.every(value => (
  setIntervals.some(setInterval => (
    intervalContains(setInterval, value)
  ))
))

/**
 * Computes the complementary set
 * starting at -Infinity
 * and
 * ending at Infinity
 */
export const setComplement = (
  setIntervals: Set
):Set => (
  setIntervals.length === 0
    ? [[-Infinity, Infinity]]
    : setIntervals.reduce((complementIntervals, [currentStart, currentEnd], index) => {
      const isFirst = index === 0
      const isLast = index === setIntervals.length - 1

      if (isFirst && isLast) {
        return [
          [-Infinity, currentStart - 1],
          [currentEnd + 1, Infinity]
        ]

      } else if (isFirst) {
        return [
          [-Infinity, currentStart - 1]
        ]

      } else if (isLast) {
        const [, previousEnd] = setIntervals[index - 1]
        return [
          ...complementIntervals,
          [previousEnd + 1, currentStart - 1],
          [currentEnd + 1, Infinity]
        ]

      } else {
        const [, previousEnd] = setIntervals[index - 1]

        return [
          ...complementIntervals,
          [previousEnd + 1, currentStart - 1]
        ]
      }
    }, [])
)

/**
 * Returns a set of intervals that contains all
 * intervals: each interval and its complementary
 */
export const setAllIntervals = (set: Set):Set => setComplement(set)
  .reduce((allIntervals, complementInterval, index, complementIntervals) => (
    index === 0
      ? [complementInterval]
      : [...allIntervals, set[index - 1], complementInterval]
  ), [])

/**
 * Calculates the position of a value (values) within a set
 */
export const setPosition = (
  set: Set,
  ...values: number[]
):number[] => {
  const allIntervals = setAllIntervals(set)

  return values.map(value => (
    (allIntervals.findIndex(interval => (
      intervalContainsValue(interval, value)
    )) - 1) / 2
  ))
}

export const setUnion = (
  fromSet: Set,
  ...unionSets: Set[]
):Set => unionSets.reduce((resultingSet, unionSetIntervals) => (
  unionSetIntervals.reduce((resultingSet1, [start, end]) => {

    const [startAnchor, endAnchor] = setPosition(resultingSet1, start, end)

    const startsInside = startAnchor % 1 === 0
    const endsInside = endAnchor % 1 === 0

    const startsAdjacent = (
      !startsInside &&
      startAnchor >= 1/2 &&
      resultingSet1[startAnchor - 1/2][1] === start - 1
    )

    const endsAdjacent = (
      !endsInside &&
      endAnchor <= resultingSet1.length - 1 - 1/2 &&
      resultingSet1[endAnchor + 1/2][0] === end + 1
    )

    const replacementStart = startsInside
      ? resultingSet1[startAnchor][0]
      : startsAdjacent
        ? resultingSet1[startAnchor - 1/2][0]
        : start

    const replacementEnd = endsInside
      ? resultingSet1[endAnchor][1]
      : endsAdjacent
        ? resultingSet1[endAnchor + 1/2][1]
        : end

    const dropStartIndex = startsInside
      ? startAnchor
      : startsAdjacent
        ? startAnchor - 1/2
        : startAnchor + 1/2

    const dropEndIndex = endsInside
      ? endAnchor
      : endsAdjacent
        ? endAnchor + 1/2
        : endAnchor - 1/2

    return [
      ...resultingSet1.slice(0, dropStartIndex),
      [replacementStart, replacementEnd],
      ...resultingSet1.slice(dropEndIndex + 1)
    ]
  }, resultingSet)
), fromSet)

/**
 * Creates a set from intervals
 */
export const set = (
  ...intervals: Interval[]
):Set => setUnion([], intervals)

export const setDifference = (
  fromSet: Set,
  ...differenceSets: Set[]
):Set => differenceSets.reduce((resultingSet, differenceSetIntervals) => (
  differenceSetIntervals.reduce((resultingSet1, [start, end]) => {
    const [startAnchor, endAnchor] = setPosition(resultingSet1, start, end)

    const startsInside = startAnchor % 1 === 0
    const endsInside = endAnchor % 1 === 0

    const dropStartIndex = startsInside
      ? startAnchor
      : startAnchor <= resultingSet1.length - 1 - 1/2
        ? startAnchor + 1/2
        : null
    const dropEndIndex = endsInside
      ? endAnchor
      : endAnchor >= 1/2
        ? endAnchor - 1/2
        : null

    const dropStartReplacement:(Interval | null) = (
      dropStartIndex !== null &&
      start > resultingSet1[dropStartIndex][0]
    )
      ? [resultingSet1[dropStartIndex][0], start - 1]
      : null

    const dropEndReplacement:(Interval | null) = (
      dropEndIndex !== null &&
      end < resultingSet1[dropEndIndex][1]
    )
      ? [end + 1, resultingSet1[dropEndIndex][1]]
      : null

    const replacement:Interval[] = [
      dropStartReplacement,
      dropEndReplacement
    ].filter(isNotNull)

    return dropStartIndex !== null && dropEndIndex !== null
      ? [
          ...resultingSet1.slice(0, dropStartIndex),
          ...replacement,
          ...resultingSet1.slice(dropEndIndex + 1)
        ]
      : resultingSet1
  }, resultingSet)
), fromSet)

export const setIntersection = (
  fromSet: Set,
  ...intersectionSets: Set[]
):Set => intersectionSets.reduce((resultingSet, intersectionSet) => (
  resultingSet.length === 0
    ? resultingSet
    : setDifference(resultingSet, setComplement(intersectionSet))
), fromSet)
