const http = require('http')
const Device = require('../lib/Devices')
const Proxy = require('../lib/Proxy')

const program = require('commander')

function list (options) {
  Device.list({
    all: options.all
  }).then((descriptions) => {
    process.stdout.write(JSON.stringify(descriptions, null, ' '))
  }).catch((err) => {
    console.error(err.stack || err.message)
  })
}

function proxy (iri, options) {
  Device.open(iri, options).then((device) => {
    const server = http.createServer(Proxy.createMiddleware(device))

    console.error('start server on port: ' + options.port)

    server.listen(options.port)
  }).catch((err) => {
    console.error(err.stack || err.message)
  })
}

program
  .command('list')
  .option('-a, --all', 'list all devices')
  .action(list)

program
  .command('proxy <device>')
  .option('-p, --port <port>', 'port', 8080, parseInt)
  .action(proxy)

program.parse(process.argv)
