var mqtt = require('mqtt')
var client = mqtt.connect('tcp://mosquitto-broker:1883')

function publishClient1(){
    client.publish('client1', `client1 time: ${Date.now().toString()}`)
}

client.on('connect', () => {    
    setTimeout(publishClient1, 2000);
})

