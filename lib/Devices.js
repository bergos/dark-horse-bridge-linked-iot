const SerialPortDevice = require('./SerialPortDevice')
const VirtualSerialPortDevice = require('./VirtualSerialPortDevice')

class Devices {
  static list (options) {
    return Promise.all([
      SerialPortDevice.list(options),
      VirtualSerialPortDevice.list(options)
    ]).then((result) => {
      return Array.prototype.concat.apply([], result)
    })
  }

  static open (iri, options) {
    iri = iri['@id'] || iri

    if (iri.indexOf('file://dev/tty') === 0) {
      return SerialPortDevice.open(iri, options)
    } else if (iri.indexOf('virtual://tty') === 0) {
      return VirtualSerialPortDevice.open(iri, options)
    }

    return Promise.reject(new Error('unknown device'))
  }
}

module.exports = Devices
