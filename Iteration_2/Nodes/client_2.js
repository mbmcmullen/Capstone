var mqtt = require('mqtt')
var client = mqtt.connect('tcp://mosquitto-broker:1883')

function publishClient(){
    let curTime = Date.now()
    //console.log(`DEBUG: Client_2 publishing: ${curTime}`)
    client.publish('current_time/client_2', `${curTime}`)
}

function loopCurrentTime() {
    var loop = setInterval(publishClient, 2000)
}

client.on('connect', () => {
    console.log('DEBUG: Client_2 connected')
    loopCurrentTime()
})