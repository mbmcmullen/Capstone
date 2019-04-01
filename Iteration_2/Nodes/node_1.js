var mqtt = require('mqtt')
var client = mqtt.connect('tcp://mosquitto-broker:1883')

function publishClient1(){
    let curTime = Date.now()
    console.log(`DEBUG: Client_1 publishing: ${curTime}`)
    client.publish('current_time/client_1', `${curTime}`)
}

// function publishClient1(curTime) {
//     console.log(`DEBUG: Client_1 publishing: ${curTime.toString()}`)
//     client.publish('current_time/client_1', curTime.toString())
// }

function loopCurrentTime() {
    var loop = setInterval(publishClient1, 1000)
    // let y, x = Date.now()
    
    // publishClient1(x)
    
    // while(true){
    //     y = Date.now()
    //     if(((y - x) / 1000) >= 1.0){
    //         publishClient1(x)
    //         x = Date.now()
    //     }
    // }
}

//setInterval(publishClient1, 1000)

//client.on('connect', loopCurrentTime)

client.on('connect', () => {
    console.log('DEBUG: Client_1 connected')
    loopCurrentTime()
})

//loopCurrentTime()

// try {
//     client.on('connect', function() {
//         // subscribe to current topic feedback
//         client.subscribe('current_time/client_1/feedback', loopCurrentTime())
//     })
// } catch (err) {
//     Object.keys(error.map(key => console.log(`${key}: ${error[key]}`)))
// } finally {
//     console.log('finally')
// }