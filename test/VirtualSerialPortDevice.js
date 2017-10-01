/* global describe, it */

const assert = require('assert')
const concatStream = require('concat-stream')
const VirtualSerialPortDevice = require('../lib/VirtualSerialPortDevice')

describe('VirtualSerialPortDevice', () => {
  it('should be a constructor', () => {
    assert.equal(typeof VirtualSerialPortDevice, 'function')
  })

  describe('.list', () => {
    it('should be a static method', () => {
      assert.equal(typeof VirtualSerialPortDevice.list, 'function')
    })

    it('should return a Promise', () => {
      const result = VirtualSerialPortDevice.list()

      assert.equal(typeof result.then, 'function')
      assert.equal(typeof result.catch, 'function')
    })

    it('should return a of virtual devices', () => {
      return VirtualSerialPortDevice.list().then((list) => {
        assert(Array.isArray(list))
        assert.deepEqual(list, [{'@id': 'virtual://tty0'}])
      })
    })
  })

  describe('.open', () => {
    it('should be a static method', () => {
      assert.equal(typeof VirtualSerialPortDevice.open, 'function')
    })

    it('should return a Promise', () => {
      const result = VirtualSerialPortDevice.open()

      assert.equal(typeof result.then, 'function')
      assert.equal(typeof result.catch, 'function')
    })

    it('should return a VirtualSerialPortDevice', () => {
      return VirtualSerialPortDevice.open('virtual://tty0').then((device) => {
        assert(device instanceof VirtualSerialPortDevice)
      })
    })

    it('should return a VirtualSerialPortDevice', () => {
      return VirtualSerialPortDevice.open('virtual://tty0').then((device) => {
        assert(device instanceof VirtualSerialPortDevice)
      })
    })
  })

  describe('.fetch', () => {
    it('should be a method', () => {
      return VirtualSerialPortDevice.open('virtual://tty0').then((device) => {
        assert.equal(typeof device.fetch, 'function')
      })
    })

    it('should send a device description response', () => {
      const expected = {
        '@id': 'virtual://tty0',
        '@type': 'Device',
        radio: 'radio'
      }

      return VirtualSerialPortDevice.open('virtual://tty0').then((device) => {
        return device.fetch('/')
      }).then((res) => {
        return new Promise((resolve, reject) => {
          res.pipe(concatStream((content) => {
            Promise.resolve().then(() => {
              const json = JSON.parse(content.toString())

              assert.deepEqual(json, expected)
            }).then(resolve).catch(reject)

            res.end()
          }))
        })
      })
    })
  })
})
