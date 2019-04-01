const { range, combineLatest,Subject, Observable, zip, merge} = require('rxjs');
const { map, filter, reduce } = require('rxjs/operators');
const { Rx } = require('rxjs/Rx')

//note: Source doesn't extend Observable but constructor returns a Subject 
export default class Source{
    //createFunc: used to create and recreate the source when an error occurs
    //handle: used to handle errors
    //value: initial value
    constructor(createFunc,handle, value=0){
        this.createSrc = createFunc;
        this.link = new Subject();
        return this.init(handle,value);
    }
    
    //src: the new source, created by createSrc function
    sub(src,handle){
        src.subscribe( x =>this.link.next(x), err => this.sub(this.createSrc(handle(err)), handle) )
    }

    //initial subsciption
    //value: intital value given to createSrc function
    init(handle,value){
        this.sub(this.createSrc(value),handle);
        return this.link;
    }
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
subject = new Source(createSource,x=>x+1);
subject.subscribe(x=>console.log(x))
subject.scan((acc,x)=>(acc+x)).subscribe(x=>console.log(`sum: ${x}`))
  