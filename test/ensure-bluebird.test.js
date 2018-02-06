/* eslint-env jest */

const ensureBluebird = require('../index.js')

describe('ensureBluebird', () => {
  it('must pass through any non-function props', () => {
    expect.assertions(1)

    expect(ensureBluebird({ unicorn: '🦄', '🚀': 1 })).toEqual({
      unicorn: '🦄',
      '🚀': 1,
    })
  })

  it('must return synchronous values directly', () => {
    expect.assertions(1)
    const transformed = ensureBluebird({
      awes() {
        return '💑'
      },
    })

    expect(transformed.awes()).toBe('💑')
  })

  it('must return a bluebird promise when given a regular promise', () => {
    expect.assertions(2)
    const transformed = ensureBluebird({
      awesLater() {
        return Promise.resolve('🎆')
      },
    })

    const result = transformed.awesLater()
    expect(result).toBeInstanceOf(require('bluebird'))
    return expect(result).resolves.toBe('🎆')
  })

  it('must resolve a bluebird promise when given any thenable', () => {
    expect.assertions(2)
    const transformed = ensureBluebird({
      awesLater() {
        return {
          then(cb) {
            setTimeout(cb, 50, '🎆')
          },
        }
      },
    })

    const result = transformed.awesLater()
    expect(result).toBeInstanceOf(require('bluebird'))
    return expect(result).resolves.toBe('🎆')
  })

  it('must reject a bluebird promise when given a thenable calling the second cb', () => {
    expect.assertions(2)
    const err = Error('example error')
    const transformed = ensureBluebird({
      awesLater() {
        return {
          then(cb, errCb) {
            setTimeout(errCb, 50, err)
          },
        }
      },
    })

    const result = transformed.awesLater()
    expect(result).toBeInstanceOf(require('bluebird'))
    return expect(result).rejects.toBe(err)
  })

  it('must pass any arguments through', () => {
    expect.assertions(1)
    const transformed = ensureBluebird({
      awes() {
        return '💑' + '_' + arguments[3]
      },
    })

    expect(transformed.awes('a', 'b', 'c', 'd')).toBe('💑_d')
  })

  it('must retain the function name', () => {
    expect.assertions(1)
    const transformed = ensureBluebird({
      awes() {
        return '💑'
      },
    })

    expect(transformed.awes.name).toBe('awes')
  })

  it('must retain the function length', () => {
    expect.assertions(1)
    const transformed = ensureBluebird({
      awes(arg1, arg2) {
        return '💑'
      },
    })

    expect(transformed.awes).toHaveLength(2)
  })

  it('must ensureBluebird functions', () => {
    expect.assertions(2)

    const transformed = ensureBluebird(function foo() {
      return Promise.resolve('⭐🌟⭐')
    })

    const result = transformed()
    expect(result).toBeInstanceOf(require('bluebird'))
    return expect(result).resolves.toBe('⭐🌟⭐')
  })
})
