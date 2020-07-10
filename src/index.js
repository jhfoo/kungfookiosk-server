const restify = require('restify'),
    server = restify.createServer(),
    socketio = require('socket.io'),
    io = socketio.listen(server.server),
    constants = require('./constants')

let sockets = {}

io.on('connection', (socket) => {
    console.log('New socket connection')
    socket.on('register', (data, cb) => {
        console.log(`[socketio] register: Device id ${data.id} `)
        if (!data.id) {
            cb('ERROR: Missing id param')
        }
        sockets[data.id] = socket
        cb('OK')
    })
})

server.use(restify.plugins.bodyParser({
}))

server.get('/ping', (req, res, next) => {
    res.send('pong')
    next()
})

server.post('/socketio', (req, res, next) => {
    if (req.body.EmitData.DeviceId) {
        // direct to device
        sockets[req.body.EmitData.DeviceId].emit(req.body.EmitName, req.body.EmitData)
    } else {
        // broadcast
        io.emit(req.body.EmitName, req.body.EmitData)
    }
    res.send(`${req.body.EmitName} sent`)
    next()
})

server.get('/*', restify.plugins.serveStaticFiles('./public'))

server.listen(constants.server.PORT, function () {
    console.log('socket.io server listening at %s', server.url)
})