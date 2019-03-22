const mqtt = require('mqtt')
var client  = mqtt.connect()

//Object.keys(client).map(key => console.log(`${key}: ${client[key]}`))
//console.log(client)

try {
	client.on('connect', function () {
	  	client.subscribe('presence', function () {
	      	client.publish('presence', 'Hello mqtt')
	      	client.end()
		  })
	})
}
catch(error){
	Object.keys(error).map(key => console.log(`${key}: ${error[key]}`))
}
finally {
	console.log('finally')
}

