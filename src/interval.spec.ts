import {
  intervalContains,
  intervalContainingValues
} from './interval'

describe('interval', () => {
  describe('intervalContains(interval, valueOrInterval)', () => {
    test('[value]', () => {
      expect(intervalContains([0, 100], 50)).toEqual(true)
    })
    test('value[]', () => {
      expect(intervalContains([0, 100], -20)).toEqual(false)
    })
    test('[]value', () => {
      expect(intervalContains([0, 100], 120)).toEqual(false)
    })
    test('[=value]', () => {
      expect(intervalContains([0, 100], 0)).toEqual(true)
    })
    test('[value=]', () => {
      expect(intervalContains([0, 100], 100)).toEqual(true)
    })

    test('[<-->]', () => {
      expect(intervalContains([0, 100], [1, 99])).toEqual(true)
    })
    test('[<-->=]', () => {
      expect(intervalContains([0, 100], [1, 100])).toEqual(true)
    })
    test('[=<-->]', () => {
      expect(intervalContains([0, 100], [0, 99])).toEqual(true)
    })
    test('[=<-->=]', () => {
      expect(intervalContains([0, 100], [0, 100])).toEqual(true)
    })
    test('[<-]->', () => {
      expect(intervalContains([0, 100], [0, 120])).toEqual(false)
    })
    test('<-[]->', () => {
      expect(intervalContains([0, 100], [-20, 120])).toEqual(false)
    })
    test('<-[->]', () => {
      expect(intervalContains([0, 100], [-20, 80])).toEqual(false)
    })
  })

  describe('intervalContainingValues(value, ...values)', () => {
    test('[value]', () => {
      expect(intervalContainingValues([-50, 50, 0]))
        .toEqual([-50, 50])
    })
    test('[]value', () => {
      expect(intervalContainingValues([-50, 50, 70]))
        .toEqual([-50, 70])
    })
    test('value[]', () => {
      expect(intervalContainingValues([-50, 50, -70]))
        .toEqual([-70, 50])
    })
    test('v1[v4]v2,v3', () => {
      expect(intervalContainingValues([-50, 50, -70, 70, 100, 30]))
        .toEqual([-70, 100])
    })
  })
})
