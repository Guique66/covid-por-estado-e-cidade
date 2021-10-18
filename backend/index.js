const express = require('express')
const server = express()
const allowCors = require('./public/cors')
const port = 8000
const api = require('./public/api')
server.use(allowCors)
server.use('/public', api)

server.listen(port, () => console.log(`Listening on port ${port}!`))

module.exports = server