let socket = null

window.onload = () => {
    console.log('App loaded')
    socket = io('http://localhost:8124')
    socket.on('connect', () => {
        console.log('Connected')
    })
}

function onEmitSocketIo() {
    let MsgName = document.getElementById('EmitName').value
    console.log('MsgName: %s', MsgName)
    socket.emit(MsgName,'')
}