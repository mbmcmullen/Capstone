// const { range, combineLatest,Subject, Observable, interval, zip, merge} = require('rxjs');
const { Observable } = require('rxjs');
// const { map, filter, reduce } = require('rxjs/operators')
const { Rx } = require('rxjs/Rx')

const startTimeStamp = Date.now()

class Source {
    constructor(createSource, startValue) {
        
    }
}

function createSource(val = 0){
    return Observable.create(function(observer){
        let value = val
        const interval = setInterval(()=>{
            observer.next({
                value: (Date.now() % 7 == 0) ? 'apple' : value,
                timestamp: Date.now(),
                status:'valid'
            });        
        
            value++;

        }, 1000);
        return () => clearInterval(interval);
    })
}

const obs$ = createSource(0);

const notDivisible$ = obs$
    .switchMap((x) => 
        Observable.of(x)    
            .map(x => {
                if (Date.now() - x.timestamp > 1000){
                    throw new Error('Timestamp expired')
                }
                else if (isNaN(x.value)){
                    throw new Error('Value is NaN')
                }
                else {
                    return x;
                }
            })
            .catch(error => Observable.of({
                value: x.value, 
                timestamp: Date.now(),
                status: `invalid ${error.message}`
            }))
    )

notDivisible$
    .subscribe(x => console.log(x))

notDivisible$
    .scan( (accum /*= {value: 0, numInvalid: 0}*/, x) => {

        //console.log(`DEBUG  accum.numInvalid : ${accum.numInvalid}`)

        if(x.status === 'valid')
            return accum + x.value
        else 
            return accum++
    }, 0)
    .subscribe(x => console.log(`sum: ${x}\n`))


/**
 * Meeting with Tian 4.16
 * 
 *      Main Objective:
 *          Create an overloaded Observable to which an observer can back propagate 
 *          a reset signal with the last known valid value. 
 * 
 *          Observers need to save last known valid value(s)
 */