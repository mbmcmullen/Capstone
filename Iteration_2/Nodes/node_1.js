var mqtt = require('mqtt')
var client = mqtt.connect('tcp://mosquitto-broker:1883')

function publishClient1() {
    client.publish('current_time/client_1', `client_1 time: ${Date.now().toString()}`)
}

function loopCurrentTime() {
    var loop = setInterval(publishClient1, 1000)
    
    // cancel execution of loop after 60 seconds
    //setTimeout(() => clearTimeout(loop), 60000)

    while(true){
        
    }
}

setInterval(publishClient1, 1000)

//client.on('connect', loopCurrentTime)

