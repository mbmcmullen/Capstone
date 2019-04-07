'use strict'

const {Source} = require('./rxSource')
const {Observable} = require('rxjs')

const express = require('express')
var mqtt = require('mqtt')

const PORT = 80
const HOST = '0.0.0.0'

var client = mqtt.connect('tcp://mosquitto-broker:1883')
var clientCurMessages = {
    client_1: null, 
    client_2: null,
    client_3: null
} 

function mqttSource(){
    
    return Observable.create( function(observer){
        const interval = setInterval( () => {
            //console.log(`DEBUG mqttSource.next: ${clientCurMessages.client_1}`)
            if (clientCurMessages.client_1 && clientCurMessages.client_1 % 3 == 0){
                observer.error()
            }
            observer.next(clientCurMessages.client_1)
        }, 4000)
        return () => clearInterval(interval)
    })
}

let subject1 = new Source(mqttSource, () => {console.log('DEBUG: Server MqttSource ERROR')})
subject1.subscribe(x => console.log(`DEBUG: subject.subscribe ${x}`))

const app = express()
app.get('/', (req, res) => {
    res.send('Placeholder for Node status monitoring App.\n')
})

client.on('connect', () => {
    client.subscribe('current_time/client_1')
    //client.subscribe('current_time/client_2')
    //client.subscribe('current_time/client_3')
    console.log('DEBUG: Server subscribed to client topics')
})

client.on('message', (topic, message) => {
    console.log(`DEBUG: Server message - topic: ${topic}, message: ${message}`)
    switch(topic) {
        case 'current_time/client_1':
            clientCurMessages.client_1 = message.toString();
        default :
    }
    //clientCurMessages.push({"topic": topic.toString(), "message": message.toString()})
    //client.end()
})

app.get('/clients_all', (req, res) => {
    console.log(`DEBUG: Server clientCurMessages: ${clientCurMessages}`)
    res.send({length: clientCurMessages.length, messages: clientCurMessages})
})

app.listen(PORT, HOST)
console.log(`DEBUG: Running on http://${HOST}:${PORT}`)