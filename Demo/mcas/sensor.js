const {Subject, BehaviorSubject, Observable, zip} = require('rxjs');

class Sensor{
    constructor(read){
        this.status = 'valid';   
        this.read = read     
        this.result = new Subject();
        this.end$ = new Subject();
        this.subscribe(read);
    }

    subscribe(read){
        var tempStatus = this.status
        Observable.create(function(observer){
            const interval = setInterval(()=>{
                var curNoseAngle = read()

                // add a bit of variance to aot sensor to simulate tolerances/turbulence 
                var nextVal = curNoseAngle+Math.random()
                // if (tempStatus === "valid"){
                //     console.log(`AOT SENSOR status:${tempStatus}\tcurNoseAngle: ${curNoseAngle}\tNext val: ${nextVal}`)
                // }
                observer.next(nextVal)
            },500);
            return () => clearInterval(interval);
        })
        .takeUntil(this.end$)
        .subscribe(
                x=>this.result.next({status:this.status, data:x}),
                ()=>this.restart
            );
    }

    restart(){
        this.end$.next();
        this.subscribe(this.read);
    }
}
module.exports = {Sensor:Sensor};