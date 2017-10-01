const url = require('url')

class Proxy {
  constructor (device) {
    this.device = device
    this.handle = this._handle.bind(this)
  }

  _handle (req, res, next) {
    next = next || Proxy.handleNext(res)

    const path = req.path || url.parse(req.url).path

    this.device.fetch(path, {
      method: req.method,
      headers: req.headers,
      body: req
    }).then((result) => {
      if (result.statusCode === 404) {
        return next()
      }

      Object.keys(result.headers).forEach((key) => {
        res.setHeader(key, result.headers[key])
      })

      result.pipe(res)
    }).catch(next)
  }

  static handleNext (res) {
    return (err) => {
      if (err) {
        const content = (err.stack || err.message).toString()

        res.statusCode = 500
        res.headers = res.headers || []
        res.headers['content-length'] = content.length
        res.end(content)
      } else {
        res.statusCode = 404
        res.end()
      }
    }
  }

  static createMiddleware (device) {
    const proxy = new Proxy(device)

    return proxy.handle
  }
}

module.exports = Proxy
