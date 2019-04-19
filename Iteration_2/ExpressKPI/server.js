const {Source} = require('./rxSource')
const {Observable, Subject} = require('rxjs')
const { Rx } = require('rxjs/Rx')

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
    //console.log(`DEBUG: Server message - topic: ${topic}, message: ${message}`)
    switch(topic) {
        case 'current_time/client_1':
            clientMessages.client_1 = JSON.parse(message.toString());
        case 'current_time/client_2':

        default :
    }
    //clientMessages.push({"topic": topic.toString(), "message": message.toString()})
    //client.end()
})

//#endregion

//#region RxJS

// this state variable needs a new home; can't seem to put it in the function mqttSource, try putting it in the Source class?
var consecInvalid = 0;

function mqttSource(){
    
    return Observable.create( function subscribe(observer){
        
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
         */ 

        console.log(`DEBUG mqttSource() called`)

        const interval = setInterval( () => {
            if ( consecInvalid > 3) {
                console.log(`consecInvalid = ${consecInvalid}`)
                observer.complete()
            }

            // send error notification if client_1 time is over 2 seconds old
            if ( clientMessages.client_1.time ) {
                if ( (Date.now() - clientMessages.client_1.time) > 2000 ){
                    consecInvalid += 1
                    console.log(`conseqInvlid = ${consecInvalid}`)
                    observer.error()
                }
                else {
                    consecInvalid = 0
                    console.log(`conseqInvlid = ${consecInvalid}`)
                    observer.next(clientMessages.client_1.value)
                }
            }

        }, 1000)
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

let subject1 = new Source(mqttSource, () => {console.log(`DEBUG: Server MqttSource ERROR\n`)})

//Object.keys(subject1).map(x => console.log(`subject1[${x}] : ${subject1[x]}`))

//console.log(`instanceof(subject1, Subject) : ${subject1 instanceof Subject }`)

subject1.subscribe(x => console.log(`DEBUG: subject1 subscription value: ${x}\n`))

//subject1.scan((acc,x)=>acc+x).subscribe(x=>console.log('subject1 current sum:'+x));

//let subject2 = new Source(()=>{/*something happens*/})

//subject2.subscribe(subject1)

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