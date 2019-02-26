var mqtt = require('mqtt')
var client  = mqtt.connect()
 
client.subscribe('presence')

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})