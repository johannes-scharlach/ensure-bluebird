'use strict'

const bb = require('bluebird')

const ensureBluebirdFn = fn => {
  const newFn = function() {
    const result = fn.apply(this, arguments)

    if (result == null) return result
    if (bb.prototype.isPrototypeOf(result)) return result
    if (result.then && typeof result.then === 'function')
      return bb.resolve(result)

    return result
  }

  Object.defineProperty(newFn, 'length', { value: fn.length })
  Object.defineProperty(newFn, 'name', { value: fn.name })

  return newFn
}

module.exports = obj => {
  const keys = Object.keys(obj)
  const newObj = typeof obj === 'function' ? ensureBluebirdFn(obj) : {}

  keys.forEach(key => {
    const val = obj[key]

    if (typeof val !== 'function') {
      newObj[key] = val
      return
    }

    newObj[key] = ensureBluebirdFn(val)
  })

  return newObj
}
