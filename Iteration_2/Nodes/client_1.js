var mqtt = require('mqtt')
var client = mqtt.connect('tcp://mosquitto-broker:1883')

function publishClient(i){
    let curTime = Date.now()
    //console.log(`DEBUG: Client_1 publishing: ${curTime}`)
    client.publish('current_time/client_1', JSON.stringify({time: curTime, value: i}))
}

function loopCurrentTime() {
    var i = 0;
    var loop = setInterval( () => {publishClient(i++)}, 1000)
}

client.on('connect', () => {
    console.log('DEBUG: Client_1 connected')
    loopCurrentTime()
})