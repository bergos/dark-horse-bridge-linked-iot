/* global describe, it */

const assert = require('assert')
const SerialPort = require('../lib/SerialPort')

describe('SerialPort', () => {
  it('should be a constructor', () => {
    assert.equal(typeof SerialPort, 'function')
  })

  it('should have a static .list method', () => {
    assert.equal(typeof SerialPort.list, 'function')
  })

  it('should have a static .open method', () => {
    assert.equal(typeof SerialPort.open, 'function')
  })
})
