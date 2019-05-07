const {Subject, BehaviorSubject, Observable, zip} = require('rxjs');

class Sensor{
    constructor(func){
        this.status = 'valid'        
        this.result = new BehaviorSubject({status: this.status, data: func()});
        this.end$ = new Subject();
        this.subscribe(func);
    }

    subscribe(func){
        let src = Observable.create(function(observer){
            const interval = setInterval(()=>{
                //console.log(`Math.sin(${value}): ${Math.sin(value)}`)
                //observer.next( 7.5+(10*Math.sin(value*Math.PI/180)) ); 
            observer.next(func())
            },500);
            return () => clearInterval(interval);
        })
        .takeUntil(this.end$);
        src.subscribe(x=>this.result.next( {status:this.status, data:x} ));
    }

    restart(){
        this.end$.next();
        this.subscribe();
        // setTimeout(this.subscribe,1000);
    }
}
module.exports = {Sensor:Sensor};