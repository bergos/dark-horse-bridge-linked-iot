const httpClient = require('http-streams/client')
const omit = require('lodash/omit')
const merge = require('lodash/merge')
const SerialPort = require('./SerialPort')

class SerialPortDevice {
  constructor (iri) {
    this.iri = iri
  }

  init () {
    return SerialPort.open(this.iri.slice(6)).then((stream) => {
      this.stream = stream

      return this
    })
  }

  fetch (url, options) {
    return httpClient(this.stream, url, options)
  }

  static list (options) {
    options = options || {}

    return SerialPort.list().then((ports) => {
      return ports.filter((description) => {
        if (options.all) {
          return true
        }

        return description.manufacturer === 'SparkFun'
      }).map((port) => {
        return merge({
          '@id': 'file:/' + port.comName
        }, omit(port, ['comName']))
      })
    })
  }

  static open (iri) {
    const device = new SerialPortDevice(iri)

    return device.init()
  }
}

module.exports = SerialPortDevice
