import {
  Set,
  setContains,
  setComplement,
  setAllIntervals,
  setPosition,
  setUnion,
  set,
  setDifference,
  setIntersection,
} from './set'

describe('set', () => {
  const i0_4: Set = [
    [-90, -70],
    [-50, -30],
    [-10, 10],
    [30, 50],
    [70, 90],
  ]
  const [i0, i1, i2, i3, i4] = i0_4
  const [
    [i0start, i0end],
    [i1start, i1end],
    [i2start, i2end],
    [i3start, i3end],
    [i4start, i4end],
  ] = i0_4
  const i0_1 = [i0, i1]
  const i0_2 = [i0, i1, i2]
  const i0_3 = [i0, i1, i2, i3]
  const i1_2 = [i1, i2] // eslint-disable-line @typescript-eslint/no-unused-vars
  const i1_3 = [i1, i2, i3] // eslint-disable-line @typescript-eslint/no-unused-vars
  const i1_4 = [i1, i2, i3, i4]
  const i2_3 = [i2, i3]
  const i2_4 = [i2, i3, i4] // eslint-disable-line @typescript-eslint/no-unused-vars
  const i3_4 = [i3, i4]

  describe('setContains(set, ...values)', () => {
    test('[=v1, v2, v3=][]', () => {
      expect(setContains(i3_4, i3start, (i3start + i3end) / 2, i3end)).toEqual(
        true
      )
    })
    test('[]v[]', () => {
      expect(setContains(i3_4, (i3end + i4start) / 2)).toEqual(false)
    })
    test('v5[][]', () => {
      expect(setContains(i3_4, i3start - 5)).toEqual(false)
    })
  })

  describe('setComplement(set)', () => {
    test('[]', () => {
      expect(setComplement([i0])).toEqual([
        [-Infinity, i0start - 1],
        [i0end + 1, Infinity],
      ])
      expect(setComplement([[0, 0]])).toEqual([
        [-Infinity, -1],
        [1, Infinity],
      ])
    })
    test('[][], [][][][][]', () => {
      expect(setComplement(i2_3)).toEqual([
        [-Infinity, i2start - 1],
        [i2end + 1, i3start - 1],
        [i3end + 1, Infinity],
      ])

      expect(setComplement(i0_4)).toEqual([
        [-Infinity, i0start - 1],
        [i0end + 1, i1start - 1],
        [i1end + 1, i2start - 1],
        [i2end + 1, i3start - 1],
        [i3end + 1, i4start - 1],
        [i4end + 1, Infinity],
      ])
    })
    test('empty set', () => {
      expect(setComplement([])).toEqual([[-Infinity, Infinity]])
    })
  })

  describe('setAllIntervals', () => {
    test('[]', () => {
      expect(setAllIntervals([i3])).toEqual([
        [-Infinity, i3start - 1],
        i3,
        [i3end + 1, Infinity],
      ])

      expect(setAllIntervals([[0, 0]])).toEqual([
        [-Infinity, -1],
        [0, 0],
        [1, Infinity],
      ])
    })
    test('[][], [][][][][]', () => {
      expect(setAllIntervals(i3_4)).toEqual([
        [-Infinity, i3start - 1],
        i3,
        [i3end + 1, i4start - 1],
        i4,
        [i4end + 1, Infinity],
      ])

      expect(setAllIntervals(i0_4)).toEqual([
        [-Infinity, i0start - 1],
        i0,
        [i0end + 1, i1start - 1],
        i1,
        [i1end + 1, i2start - 1],
        i2,
        [i2end + 1, i3start - 1],
        i3,
        [i3end + 1, i4start - 1],
        i4,
        [i4end + 1, Infinity],
      ])
    })
  })

  describe('setPosition(set, ...values)', () => {
    test('v1,v2[][][][][]', () => {
      expect(setPosition(i0_4, i0start - 10, i0start - 5)).toEqual([
        -1 / 2,
        -1 / 2,
      ])
    })

    test('[]v1,v2[][][][], [][]v1,v2[][][]', () => {
      expect(setPosition(i0_4, i0end + 5, i1start - 5)).toEqual([
        0 + 1 / 2,
        0 + 1 / 2,
      ])
      expect(setPosition(i0_4, i1end + 5, i2start - 5)).toEqual([
        1 + 1 / 2,
        1 + 1 / 2,
      ])
    })

    test('[][][][][]v1,v2', () => {
      expect(setPosition(i0_4, i4end + 5, i4end + 10)).toEqual([
        4 + 1 / 2,
        4 + 1 / 2,
      ])
    })

    test('[v1][][][][v2], [][v1][][][v2]', () => {
      expect(setPosition(i0_4, i0start + 5, i4start + 5)).toEqual([0, 4])
      expect(setPosition(i0_4, i1start + 5, i4start + 5)).toEqual([1, 4])
    })

    test('[v1=][][][][=v2]', () => {
      expect(setPosition(i0_4, i0end, i4start)).toEqual([0, 4])
    })

    test('[v1][][][][=v2]', () => {
      expect(setPosition(i0_4, i0end - 5, i4start)).toEqual([0, 4])
    })

    test('[]v1[][][][=v2], [v1=][][][]v2[]', () => {
      expect(setPosition(i0_4, i0end, i3end + 5)).toEqual([0, 3 + 1 / 2])
    })
  })

  describe('setUnion(fromSet, unionSet)', () => {
    test('<-->[][][][][]', () => {
      expect(setUnion(i0_4, [[i0start - 10, i0start - 5]])).toEqual([
        [i0start - 10, i0start - 5],
        ...i0_4,
      ])
    })
    test('<-->+[][][][][] (adjacency)', () => {
      expect(setUnion(i0_4, [[i0start - 10, i0start - 1]])).toEqual([
        [i0start - 10, i0end],
        ...i1_4,
      ])

      expect(setUnion(i0_4, [[i0start - 10, i0start - 2]])).toEqual([
        [i0start - 10, i0start - 2],
        ...i0_4,
      ])
    })
    test('[][][][][]<-->', () => {
      expect(setUnion(i0_4, [[i4end + 5, i4end + 10]])).toEqual([
        ...i0_4,
        [i4end + 5, i4end + 10],
      ])
    })
    test('[][][][][]+<--> (adjacency)', () => {
      expect(setUnion(i0_4, [[i4end + 1, i4end + 10]])).toEqual([
        ...i0_3,
        [i4start, i4end + 10],
      ])
    })
    test('[]<-->[][][][], [][][]<-->[][]', () => {
      expect(setUnion(i0_4, [[i0end + 5, i1start - 5]])).toEqual([
        i0,
        [i0end + 5, i1start - 5],
        ...i1_4,
      ])
      expect(setUnion(i0_4, [[i2end + 5, i3start - 5]])).toEqual([
        ...i0_2,
        [i2end + 5, i3start - 5],
        ...i3_4,
      ])
    })
    test('[]+<-->[][][][], [][][]<-->+[][] (adjacency)', () => {
      expect(setUnion(i0_4, [[i0end + 1, i1start - 5]])).toEqual([
        [i0start, i1start - 5],
        ...i1_4,
      ])
      expect(setUnion(i0_4, [[i2end + 5, i3start - 1]])).toEqual([
        ...i0_2,
        [i2end + 5, i3end],
        i4,
      ])
    })
    test('[][<-][][->][]', () => {
      expect(setUnion(i0_4, [[i1end - 5, i3start + 5]])).toEqual([
        i0,
        [i1start, i3end],
        i4,
      ])
    })
    test('[][<-][]->[][]', () => {
      expect(setUnion(i0_4, [[i1end - 5, i2end + 5]])).toEqual([
        i0,
        [i1start, i2end + 5],
        ...i3_4,
      ])
    })
    test('[][<-][]->+[][] (adjacency)', () => {
      expect(setUnion(i0_4, [[i1end - 5, i3start - 1]])).toEqual([
        i0,
        [i1start, i3end],
        i4,
      ])
    })
    test('<-[][][][][]->', () => {
      expect(setUnion(i0_4, [[i0start - 5, i4end + 5]])).toEqual([
        [i0start - 5, i4end + 5],
      ])
    })
    test('[][]+<-->+[][][] (adjacency)', () => {
      expect(setUnion(i0_4, [[i1end + 1, i2start - 1]])).toEqual([
        i0,
        [i1start, i2end],
        ...i3_4,
      ])
    })
    test('[0]+<-->+[1<-][2][->3][4] => [0123][4]', () => {
      expect(
        setUnion(i0_4, [
          [i0end + 1, i1start - 1],
          [i1end - 5, i3start + 5],
        ])
      ).toEqual([[i0start, i3end], i4])
    })
  })

  describe('set(...intervals)', () => {
    test('from interconnecting intervals', () => {
      expect(set([10, 20], [30, 40], [15, 35], [-20, 9])).toEqual([[-20, 40]])
    })

    test('when intervals are out of order', () => {
      expect(set([10, 20], [-10, 0], [-30, -40], [5, 5])).toEqual([
        [-30, -40],
        [-10, 0],
        [5, 5],
        [10, 20],
      ])
    })
  })

  describe('setDifference(fromSet, differenceSet)', () => {
    test('<-->[][][][][]', () => {
      expect(setDifference(i0_4, [[i0start - 10, i0start - 5]])).toEqual(i0_4)
    })
    test('[][][]<-->[][]', () => {
      expect(setDifference(i0_4, [[i2end + 5, i3start - 5]])).toEqual(i0_4)
    })
    test('[][][][][]<-->', () => {
      expect(setDifference(i0_4, [[i4end + 5, i4end + 10]])).toEqual(i0_4)
    })
    test('<-[=>][][][][]', () => {
      expect(setDifference(i0_4, [[i0start - 10, i0start]])).toEqual([
        [i0start + 1, i0end],
        ...i1_4,
      ])
    })
    test('[][][<=]->[][]', () => {
      expect(setDifference(i0_4, [[i2end, i3start - 5]])).toEqual([
        ...i0_1,
        [i2start, i2end - 1],
        ...i3_4,
      ])
    })
    test('[][][<=][=>][]', () => {
      expect(setDifference(i0_4, [[i2end, i3start]])).toEqual([
        ...i0_1,
        [i2start, i2end - 1],
        [i3start + 1, i3end],
        i4,
      ])
    })
    test('[]<-[][][]->[], []<=[][][]=>[]', () => {
      expect(setDifference(i0_4, [[i1start - 5, i3end + 5]])).toEqual([i0, i4])
      expect(setDifference(i0_4, [[i1start, i3end]])).toEqual([i0, i4])
    })
    test('[]<=[][][->][]', () => {
      expect(setDifference(i0_4, [[i1start, i3start + 5]])).toEqual([
        i0,
        [i3start + 6, i3end],
        i4,
      ])
    })
    test('<-[][][][][]->, <=[][][][][]=>', () => {
      expect(setDifference(i0_4, [[i0start - 5, i4end + 5]])).toEqual([])
      expect(setDifference(i0_4, [[i0start, i4end]])).toEqual([])
    })

    test('<-[0][1][=>2<-][3][=>4] => [*2*][*4]', () => {
      expect(
        setDifference(i0_4, [
          [i0start - 5, i2start],
          [i2end - 5, i4start],
        ])
      ).toEqual([
        [i2start + 1, i2end - 6],
        [i4start + 1, i4end],
      ])
    })
  })

  describe('setIntersection(fromSet, intersectionSet)', () => {
    test('<-->[][][][][]', () => {
      expect(setIntersection(i0_4, [[i0start - 10, i0start - 5]])).toEqual([])
    })
    test('[][]<-->[][][]', () => {
      expect(setIntersection(i0_4, [[i1end + 5, i2start - 5]])).toEqual([])
    })
    test('[][][][][]<-->', () => {
      expect(setIntersection(i0_4, [[i4end + 5, i4end + 10]])).toEqual([])
    })
    test('<-[][][][][]->', () => {
      expect(setIntersection(i0_4, [[i0start - 10, i4end + 5]])).toEqual(i0_4)
    })

    test('<-[->][][][][]', () => {
      expect(setIntersection(i0_4, [[i0start - 5, i0end - 5]])).toEqual([
        [i0start, i0end - 5],
      ])
    })

    test('<-[=>][][][][]', () => {
      expect(setIntersection(i0_4, [[i0start - 5, i0start]])).toEqual([
        [i0start, i0start],
      ])
    })

    test('<-[][][=>][][]', () => {
      expect(setIntersection(i0_4, [[i0start - 5, i2start]])).toEqual([
        ...i0_1,
        [i2start, i2start],
      ])
    })

    test('[<=][][=>][][], [<-][][=>][][]', () => {
      expect(setIntersection(i0_4, [[i0end, i2start]])).toEqual([
        [i0end, i0end],
        i1,
        [i2start, i2start],
      ])

      expect(setIntersection(i0_4, [[i0end - 5, i2start]])).toEqual([
        [i0end - 5, i0end],
        i1,
        [i2start, i2start],
      ])
    })

    test('[][][<-][][]->', () => {
      expect(setIntersection(i0_4, [[i2end - 5, i4end + 5]])).toEqual([
        [i2end - 5, i2end],
        ...i3_4,
      ])
    })

    test('[0<=][1]=>[2<-][3][4]-> => [0*][1][*2][3][4]', () => {
      expect(
        setIntersection(i0_4, [
          [i0end, i1end],
          [i2end - 5, i4end + 5],
        ])
      ).toEqual([[i0end, i0end], i1, [i2end - 5, i2end], ...i3_4])
    })
  })
  describe('setIntersection(fromSet, ...intersectionSets)', () => {
    test('[0<=][1]=>[2<-][3][4]-> AND <=[0][1]=>[2][3]<-[->4]', () => {
      expect(
        setIntersection(
          i0_4,
          [
            [i0end, i1end],
            [i2end - 5, i4end + 5],
          ],
          [
            [i0start, i1end],
            [i4start - 5, i4start + 5],
          ]
        )
      ).toEqual([[i0end, i0end], i1, [i4start, i4start + 5]])
    })
    test('<-->[][][][][] AND <-[][][][][]->', () => {
      expect(
        setIntersection(
          i0_4,
          [[i0start - 10, i0start - 5]],
          [[i0start - 10, i4end + 5]]
        )
      ).toEqual([])
    })
  })
})
