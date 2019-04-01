'use strict'

const express = require('express')
var mqtt = require('mqtt')

const PORT = 80
const HOST = '0.0.0.0'

var client = mqtt.connect('tcp://mosquitto-broker:1883')
var clientCurMessages = [] 

const app = express()
app.get('/', (req, res) => {
    res.send('Placeholder for Node status monitoring App.\n')
})

client.on('connect', () => {
    client.subscribe('current_time/client_1')
    console.log('DEBUG: Server subscribed to topic: current_time/client_1')
})

client.on('message', (topic, message) => {
    console.log(`DEBUG: Server message - topic: ${topic}, message: ${message}`)
    clientCurMessages.push(message.toString())
    //client.end()
})

app.get('/client1', (req, res) => {
    console.log(`DEBUG: Server clientCurMessages: ${clientCurMessages}`)
    res.send({messages: clientCurMessages})
})

app.listen(PORT, HOST)
console.log(`DEBUG: Running on http://${HOST}:${PORT}`)