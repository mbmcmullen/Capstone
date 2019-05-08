const {Subject, swithcMap, BehaviorSubject, Observable,zip} = require('rxjs');
const { map, takeUntil } = require('rxjs/operators');
const { Rx } = require('rxjs/Rx')

class MCAS{
    constructor(parents){
        this.sensors = parents
        this.result = new Subject();
        this.end = new Subject();
        this.resets = 0;
        this.subscribe();
    }

    subscribe(){
        //console.log(JSON.stringify(this.sensors,null,'\t'))
        
        var AoT = zip(this.sensors[0].result,this.sensors[1].result)
        .takeUntil(this.end);
        
        AoT.subscribe(
            ([a1,a2])=>{
                if((a1.status === 'valid')&&(a2.status === 'valid')){
                    if(Math.abs(a1.data-a2.data) < .5){
                        let res = (a1.data+a2.data)/2;
                        if(res >= 15) this.result.next('down');
                        else if(res <=0) this.result.next('up');
                        else this.result.next('none')
                    }else{
                        this.result.next('invalid')
                        this.restart();
                    }
                }
                else if(a1.status === 'valid'){
                    if(a1.data >= 15) this.result.next('down');
                    else if(a1.data <=0) this.result.next('up');
                    else this.result.next('none')
                    this.sensors[1].restart();
                } 
                else if(a2.status === 'valid'){
                    if(a2.data >= 15) this.result.next('down');
                    else if(a2.data <=0) this.result.next('up');
                    else this.result.next('none')
                    this.sensors[0].restart();
                }
                else{
                    this.result.next('invalid');
                    this.restart()
                }
            },
            ()=>this.restart()
        )
             
    }

    restart(){
        this.end.next();
        if(this.resets<3){
            this.resets++
            // console.log(`increment reset ${this.resets}`)
        }
        else{
            this.sensors.forEach(element => element.restart());
            this.resets = 0
            // console.log(`reached sensors.restart`)
        }
        
        this.subscribe()
        // setTimeout(this.subscribe,500);
        
    }
}

module.exports = {MCAS:MCAS};