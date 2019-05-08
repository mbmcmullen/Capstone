const {MCAS} = require('./mcas.js');
const {Sensor} = require('./sensor.js');
const socketIOClient = require("socket.io-client");
const { Observable, zip } = require('rxjs')
const { withLatestFrom } = require('rxjs/operators')

const debug = false;
var pilotState = 'none'
var noseAngle = -3;

var socket = socketIOClient("http://backend:3001/");
socket.on('connect', socket => {
    console.log('demo connected')
})

socket.on('pilot_up', angle=>{
    noseAngle = angle;
    pilotState = 'up';
})

socket.on('pilot_down', angle=>{
    noseAngle = angle;
    pilotState = 'down';
})

var pilot = Observable.create(function(observer){
    const interval = setInterval(()=>{
        observer.next(pilotState);
        pilotState = 'none'
    },500);
    return () => clearInterval(interval);
})

AoT1 = new Sensor(()=>noseAngle);
AoT2 = new Sensor(()=>noseAngle);
// Object.keys(AoT1).map(x=>log(`sensor1[${x}]: ${AoT1[x]}`))

var args = [AoT1,AoT2];

AoT1.result.subscribe(x =>{
    log(`AoT1: ${JSON.stringify(x)}`);
    socket.emit('aot1', x)
})

AoT2.result.subscribe(x =>{
    log(`AoT2: ${JSON.stringify(x)}`);
    socket.emit('aot2', x)
})

socket.on('kill_aot1', () => {
    AoT1.status = 'invalid'
});

socket.on('kill_aot2',() => {
    AoT2.status = 'invalid'
});

socket.on('restart_aot1',() => { 
    AoT1.status = 'valid'
});

socket.on('restart_aot2',() => {
    AoT2.status = 'valid'
});

Object.keys(AoT1.result).map(x=>log(`sensor1.result[${x}]: ${AoT1.result[x]}`))

mcas = new MCAS(args);

mcas.result.subscribe(x => {
    socket.emit('diff', x)
    log(`MCAS diff event emitted: ${x}\n`)
})

combined = pilot.pipe(withLatestFrom(mcas.result))
combined.subscribe(([x,y])=>
    {
        // log(`(?,?): (${x},${y})`);

        if(x==y||x==='none'||x==='invalid'){
            switch(y){
                case 'up':
                    noseAngle++;
                    socket.emit('nose_angle', noseAngle);
                    log(`nose_angle event emitted ${Date.now()} : ${noseAngle}`)
                    break;
                case 'down':
                    noseAngle--;
                    socket.emit('nose_angle',noseAngle);
                    log(`nose_angle event emitted ${Date.now()} : ${noseAngle}`)
                    break;
                case 'invalid':
                    log(`no nose_angle event emitted`)
                    break;
                case 'none':
                    log(`no nose_angle event emitted`)
                    break;
                case 'default':
                    log(`no nose_angle event emitted`)
            }
        }else if(y==='none'){
            switch(x){
                case 'up':
                    noseAngle++;
                    socket.emit('nose_angle',noseAngle);
                    log(`nose_angle event emitted ${Date.now()} : ${noseAngle}`)
                    break;
                case 'down':
                    noseAngle--;
                    socket.emit('nose_angle',noseAngle);
                    log(`nose_angle event emitted ${Date.now()} : ${noseAngle}`)
                    break;
                case 'invalid':
                    log(`no nose_angle event emitted`)
                    break;
                case 'none':
                    log(`no nose_angle event emitted`)
                    break;
            }
        }
    })

// Object.keys(AoT1.result).map(x=> log(`sensor1.result[${x}]: ${AoT1.result[x]}\n`))

function log(message) {
  if (debug === true){
    console.log(message)
  }
}
//mcas.result.subscribe(x=>console.log(`result: ${x}`))