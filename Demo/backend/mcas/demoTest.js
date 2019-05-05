const {MCAS} = require('./mcas.js');
const {Sensor} = require('./sensor.js');
const socketIOClient = require("socket.io-client");
const { Observable, zip } = require('rxjs')
const { withLatestFrom } = require('rxjs/operators')

var pilotState = 'none'
var noseAngle = -3;

var socket = socketIOClient("http://localhost:3001/");
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
Object.keys(AoT1).map(x=>console.log(`sensor1[${x}]: ${AoT1[x]}`))

var args = [AoT1,AoT2];

//Object.keys(AoT1).map(x => console.log(`\tAoT1[${x}] : ${AoT1[x]}`))
//Object.keys(AoT1.result).map(x => console.log(`\tAoT1.result[${x}] : ${AoT1.result[x]}`))
AoT1.result.subscribe(x=>console.log(`AoT1.data ${Date.now()} : ${x.data}`))
AoT2.result.subscribe(x=>console.log(`AoT2.data ${Date.now()} : ${x.data}`))
Object.keys(AoT1.result).map(x=>console.log(`sensor1.result[${x}]: ${AoT1.result[x]}`))


mcas = new MCAS(args);

mcas.result.subscribe(x => console.log(`mcas observer ${x}\n`))

combined = pilot.pipe(withLatestFrom(mcas.result))
combined.subscribe(([x,y])=>
    {
        console.log(`(${x},${y})`);

        if(x==y||x==='none'||x==='invalid'){
            switch(y){
                case 'up':
                    noseAngle++;
                    socket.emit('nose_angle', noseAngle);
                    console.log(`nose_angle event emitted ${Date.now()} : ${noseAngle}`)
                    break;
                case 'down':
                    noseAngle--;
                    socket.emit('nose_angle',noseAngle);
                    console.log(`nose_angle event emitted ${Date.now()} : ${noseAngle}`)
                    break;
                case 'invalid':
                    console.log(`no nose_angle event emitted`)
                    break;
                case 'none':
                    console.log(`no nose_angle event emitted`)
                    break;
                case 'default':
                    console.log(`no nose_angle event emitted`)
            }
        }else if(y==='none'){
            switch(x){
                case 'up':
                    noseAngle++;
                    socket.emit('nose_angle',noseAngle);
                    console.log(`nose_angle event emitted ${Date.now()} : ${noseAngle}`)
                    break;
                case 'down':
                    noseAngle--;
                    socket.emit('nose_angle',noseAngle);
                    console.log(`nose_angle event emitted ${Date.now()} : ${noseAngle}`)
                    break;
                case 'invalid':
                    console.log(`no nose_angle event emitted`)
                    break;
                case 'none':
                    console.log(`no nose_angle event emitted`)
                    break;
            }
        }    
    })

    Object.keys(AoT1.result).map(x=>console.log(`sensor1.result[${x}]: ${AoT1.result[x]}\n`))

//mcas.result.subscribe(x=>console.log(`result: ${x}`))