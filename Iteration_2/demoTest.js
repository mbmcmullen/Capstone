const {MCAS} = require('./MCAS.js');
const {Sensor} = require('./sensor.js');

var noseAngle = -3;

AoT1 = new Sensor(()=>noseAngle+0.5);
AoT2 = new Sensor(()=>noseAngle);
Object.keys(AoT1).map(x=>console.log(`sensor1[${x}]: ${AoT1[x]}`))

var args = [AoT1,AoT2];

//Object.keys(AoT1).map(x => console.log(`\tAoT1[${x}] : ${AoT1[x]}`))
//Object.keys(AoT1.result).map(x => console.log(`\tAoT1.result[${x}] : ${AoT1.result[x]}`))
AoT1.result.subscribe(x=>console.log(`AoT1.data: ${x.data}`))
AoT2.result.subscribe(x=>console.log(`AoT2.data: ${x.data}`))
Object.keys(AoT1.result).map(x=>console.log(`sensor1.result[${x}]: ${AoT1.result[x]}`))


mcas = new MCAS(args);
mcas.result.subscribe(x=>
    {
        console.log(x);
        switch(x){
            case 'up':
                noseAngle++;
                break;
            case 'down':
                noseangle--;
                break;
            case 'invalid':
                break;
            case 'none':
                break;
        }
    })

    Object.keys(AoT1.result).map(x=>console.log(`sensor1.result[${x}]: ${AoT1.result[x]}\n`))

//mcas.result.subscribe(x=>console.log(`result: ${x}`))