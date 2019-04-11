'use strict'

const {Source} = require('./rxSource')
const {Observable} = require('rxjs')

const express = require('express')
var mqtt = require('mqtt')

const PORT = 80
const HOST = '0.0.0.0'

//#region MQTT connection

var client = mqtt.connect('tcp://mosquitto-broker:1883')
var clientMessages = {
    client_1: {
        time: null, 
        value: null
    },     
    client_2: null,     
    client_3: null      
} 

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
            clientMessages.client_1 = message.toString();
        case 'current_time/client_2':

        default :
    }
    //clientMessages.push({"topic": topic.toString(), "message": message.toString()})
    //client.end()
})

//#endregion

//#region RxJS

function mqttSource(){
    
    return Observable.create( function(observer){
        /**
         * TODO: 
         *      Check whether client message is current ( 'not stale': within specified time interval)
         *      If value is deemed 'stale' begin sending value objects with 'status': 'invalid'
         *          else continue sending current data with value objects containing 'status': 'valid'
         *      Keep count of number of 'stale/invalid' data values 
         *          clear count if new 'current/valid' value is recieved
         *          if count exceeds predefined limit then send 'complete' notification
         *      Define way to message client stating that current value is in 'stale/invalid' mode
         *          responsibility for handling error message from server is put on the client node. 
         *              if client wants to restart or keep sending error/ not sending current values, that's it's choice
         *      
         */ 

        const interval = setInterval( () => {
            
            if (clientMessages.client_1 && clientMessages.client_1 % 3 == 0){
                observer.error()
            }
            observer.next(clientMessages.client_1)
        }, 4000)
        return () => clearInterval(interval)
    })
}

/**
 * TODO: 
 *      Note the current implementation of Source takes in an Error Handler function
 *          but this error handler function cannot access any status variables within the Obervable's scope
 *          This could become an issue when a specific error handler needs to access the number of 'invalid' 
 *              data values to determine if it should send a 'complete' notification
 */
let subject1 = new Source(mqttSource, () => {console.log('DEBUG: Server MqttSource ERROR')})
subject1.subscribe(x => console.log(`DEBUG: subject.subscribe ${x}`))

//#endregion

//#region  API

const app = express()
app.get('/', (req, res) => {
    res.send('Placeholder for Node status monitoring App.\n')
})

app.get('/clients_all', (req, res) => {
    console.log(`DEBUG: Server clientMessages: ${clientMessages}`)
    res.send({length: clientMessages.length, messages: clientMessages})
})

app.listen(PORT, HOST)
console.log(`DEBUG: Running on http://${HOST}:${PORT}`)

//#endregion