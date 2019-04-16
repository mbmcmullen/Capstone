const { range, combineLatest,Subject, Observable, interval, zip, merge} = require('rxjs');
const { map, filter, reduce } = require('rxjs/operators');
const { Rx } = require('rxjs/Rx')


function createSource(val = 0){
    return Observable.create(function(observer){
        let value = val;
        const interval = setInterval(()=>{
        observer.next({value: value,status:'valid'});        
        //if(value%3===0) observer.error(value);
        value++;

        },1000);
        return () => clearInterval(interval);
    })
}

const obs$ = createSource(0);
const filter$ = obs$.filter(x=>x.value%2===0);

const notDivisible$ = filter$
.switchMap((x) => 
    Observable.of(x)    
        .map(x => {
            if (x.value%3===0) {
                throw new Error('Divisible by 3');
            } else {
                return x;
            }
        })
        .catch(error => Observable.of({value:x.value,status: `invalid ${error.message}`}))
)


notDivisible$.subscribe(x=>console.log(x))
notDivisible$.scan((acc,x)=>{
    if(x.status === 'valid')return acc+x.value;
    else return acc;   
},0).subscribe(x=>console.log(`sum: ${x}`))

