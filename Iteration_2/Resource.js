const { range, combineLatest,Subject, Observable, zip, merge} = require('rxjs');
const { map, filter, reduce } = require('rxjs/operators');
const { Rx } = require('rxjs/Rx')

class Resource{
    //createFunc: used to create and recreate the source when an error occurs
    //handle: used to handle errors
    //value: initial value
    constructor(createFunc, errHandle, previous, value){
        this.createSrc = createFunc;
        this.output = new Subject();
        this.uplink = previous;
        this.handle = errHandle;
        this.status = 'valid';
        this.faults = 0;
        this.sub(this.createSrc(value));
        return this;
    }
    
    //src: the new source, created by createSrc function
    sub(src){
        if(this.uplink instanceof Resource){
            console.log('Object.keys(uplink): ')
            Object.keys(this.uplink.output).map(x => console.log(`\tuplink.output[${x}] : ${this.uplink.output[x]}`))
          //  this.uplink.output.subscribe(x=>this.output.next(this.createSrc(x)));
            
            this.uplink.output.switchMap((x) =>
                Observable.of(x)
                    .map(x=>this.createSrc(x))
                    .catch(
                        error=>Observable.of(this.restart(error))
                    ))
                .subscribe(x=>this.output.next(x))    
            
            
        }else{
            src.subscribe(x=>this.output.next(x), err => this.restart(err))
        }
    }

    restart(error){
        this.status = 'invalid';
        if(this.uplink instanceof Resource){
            faults++;
            uplink.restart();
        }else{
            this.sub(this.createSrc(this.handle(error)))
        } 
    }    

    /*
    //initial subsciption
    //value: intital value given to createSrc function
    init(handle,value){
        this.sub(this.createSrc(value),handle);
        return this.link;
    }
    */
}

//a sample createSource function for testing
//throws an error whenever value is divisible by 3
function createSource(val = 0){
    return Observable.create(function(observer){
        let value = val;
        const interval = setInterval(()=>{
        if (value%2 === 1){
            observer.next(value);
        }
        if(value%3===0) observer.error(value);
        value++;

        },500);
        return () => clearInterval(interval);
    })
}


//test
subject = new Resource(createSource,x=>x+1,null,1);
//Object.keys(subject).map(x=>console.log(`${x} : ${subject[x]}`));
subject.output.subscribe(x=>console.log(x))
double = new Resource(x=>x*2,null,subject, 1)
subject.output.scan((acc,x)=>(acc+x)).subscribe(x=>console.log(`sum: ${x}`))
double.output.subscribe(x=>console.log(`doubled: ${x}`))