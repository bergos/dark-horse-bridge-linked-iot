const Duplex = require('stream').Duplex
const Promise = require('bluebird')
const RawSerialPort = require('serialport')

class SerialPort extends Duplex {
  constructor (serial, options) {
    super(options)

    this.serial = serial

    this.serial.on('data', (chunk) => {
      this.push(chunk)

      chunk = chunk.toString().split('\r').join('\\r').split('\n').join('\\n\n')

      process.stderr.write(chunk)
    })

    this.serial.on('end', () => {
      this.push(null)
    })

    this.serial.on('close', () => {
      this.push(null)
    })
  }

  _write (chunk, encoding, done) {
    this.serial.write(chunk)

    chunk = chunk.toString().split('\r').join('\\r').split('\n').join('\\n\n')

    process.stderr.write(chunk)
    done()
  }

  _read () {}

  static list () {
    return Promise.promisify(RawSerialPort.list)()
  }

  static open (name) {
    const port = new RawSerialPort(name, {autoOpen: false})

    return Promise.promisify(port.open, {context: port})().then(() => {
      return new SerialPort(port)
    })
  }
}

module.exports = SerialPort
