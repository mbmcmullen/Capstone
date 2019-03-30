var mqtt = require('mqtt')
var client = mqtt.connect('tcp://mosquitto-broker:1883')

function publishClient1(curTime) {
    client.publish('current_time/client_1', 'working')
}

function loopCurrentTime() {
    //var loop = setInterval(publishClient1, 1000)
    let y, x = Date.now()
    
    while(true){
        y = Date.now()
        if(((y - x) / 1000) >= 1.0){
            publishClient1(x)
            x = Date.now()
        }
    }
}


//setInterval(publishClient1, 1000)

//client.on('connect', loopCurrentTime)

loopCurrentTime()