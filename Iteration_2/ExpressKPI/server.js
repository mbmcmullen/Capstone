'use strict'

const express = require('express')
var mqtt = require('mqtt')

const PORT = 80
const HOST = '0.0.0.0'

var client = mqtt.connect([{host: 'mosquitto-broker', port:1883}])
var clientCurMessage = ''

const app = express()
app.get('/', (req, res) => {
    res.send('Placeholder for Node status monitoring App.\n')
})

client.on('message', (topic, message) => {
    clientCurMessage = message.toString()
    client.end()
})

app.get('/client1', (req, res) => {
    res.send(clientCurMessage + '\n')
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)