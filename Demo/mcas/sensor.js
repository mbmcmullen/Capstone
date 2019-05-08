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
        Observable.create(function(observer){
            const interval = setInterval(()=>{
                observer.next(read()+Math.random())
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