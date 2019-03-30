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

client.subscribe('current_time/client_1')

client.on('message', (topic, message) => {
    clientCurMessages.push(message.toString())
    client.end()
})

app.get('/client1', (req, res) => {
    res.send(clientCurMessages)
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)