var mqtt = require('mqtt')
var client = mqtt.connect('tcp://mosquitto-broker:1883')

function publishClient(){
    let curTime = Date.now()
    //console.log(`DEBUG: Client_3 publishing: ${curTime}`)
    client.publish('current_time/client_3', `${curTime}`)
}

function loopCurrentTime() {
    var loop = setInterval(publishClient, 3000)
}

client.on('connect', () => {
    console.log('DEBUG: Client_3 connected')
    loopCurrentTime()
})