var mqtt = require('mqtt')
var client = mqtt.connect([{host: 'mosquitto-broker', port:1883}])

function publishClient1(){
    var time = new Date()
    client.publish('client1', `client1 time: ${time.toDateString()}`)
}

client.on('connect', () => {
    while(true){
        setTimeout(publishClient1, 2000);
    }
})

