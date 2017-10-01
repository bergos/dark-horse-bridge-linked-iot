const httpServer = require('http-streams/server')
const SerialPortDevice = require('./SerialPortDevice')

class VirtualSerialDevice {
  constructor (iri, options) {
    options = options || {}

    this.iri = iri

    this.context = {
      '@vocab': 'https://ns.bergnet.org/dark-horse/'
    }

    this.radio = {
      '@type': 'RFM69',
      frequency: 868000000,
      network: 0,
      client: 2,
      password: '1234'
    }

    this.stream = httpServer(this.handler.bind(this))

    this.fetch = SerialPortDevice.prototype.fetch.bind(this)
  }

  handler (req, res) {
    if (req.path === '/') {
      return this.send(req, res, {
        '@id': this.iri,
        '@type': 'Device',
        radio: 'radio'
      })
    }

    if (req.path === '/context') {
      return this.send(req, res, this.context)
    }

    if (req.path === '/radio') {
      return this.send(req, res, this.radio)
    }

    this.sendNotFound(req, res)
  }

  send (req, res, content) {
    const contentString = JSON.stringify(content)

    res.headers['content-type'] = 'application/ld+json'
    res.headers['content-length'] = contentString.length
    res.headers['link'] = '<context>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'

    res.end(contentString)
  }

  sendNotFound (req, res) {
    res.statusCode = 404
    res.end()
  }

  static list () {
    return Promise.resolve([{
      '@id': 'virtual://tty0'
    }])
  }

  static open (iri) {
    return Promise.resolve(new VirtualSerialDevice(iri))
  }
}

module.exports = VirtualSerialDevice
