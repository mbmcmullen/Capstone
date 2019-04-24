const {Subject, Observable, zip} = require('rxjs');
const { map } = require('rxjs/operators');

class MCAS{
    constructor(parents, handle){
        this.sensor = parents;
        this.AoT = zip(sensor[0],sensor[1]);
        this.result = new BehaviorSubject();
        this.handle = handle;
        this.resets = 0;
        subscribe();
    }

    subscribe(){
        this.AoT.subscribe(
            ([a1,a2])=>{
                if(abs(a1-a2)<.05){
                    this.result.next((a1+a2)/2);
                }else{
                    throw new Error('AoT Variance Overflow');
                }
            },
            _ => this.restart()
        )    
        
        /*
        this.AoT.switchMap(x=>
            Observable.of(x)
                .map(([a1,a2])=>{
                    if(abs(a1-a2)<.05){
                        this.result.next(sensor[0].valid ? a1:a2);
                    }else{
                        throw new Error('AoTVarianceOverflow');
                    }
                }).catch(error=>Observable.of(restart(error)))                  
        )
        */
    }

    restart(){
        if(resets<3){
            resets++;
            subscribe();
        }else{
            this.sensors.forEach(element => {
                if(element.status === 'invalid') element.restart();
            });
        }
    }
}