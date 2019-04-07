const { Subject, Observable } = require('rxjs');

//note: Source doesn't extend Observable but constructor returns a Subject 
class Source {
    //createFunc: used to create and recreate the source when an error occurs
    //handle: used to handle errors
    //value: initial value to create source at 
    constructor(createFunc, errHandle, value){
        this.createSrc = createFunc;
        this.link = new Subject();
        return this.init(errHandle, value);
    }
    
    //src: the new source, created by createSrc function
    sub(src, errHandle){
        src.subscribe( x => this.link.next(x), err => this.sub(this.createSrc(errHandle(err)), errHandle) )
    }

    //initial subsciption
    //value: intital value given to createSrc function
    init(errHandle, value){
        this.sub(this.createSrc(value), errHandle);
        return this.link;
    }
}

module.exports = {
    Source: Source
}

// //a sample createSource function for testing
// //throws an error whenever value is divisible by 3
// function createSource(val = 0){
//     return Observable.create(function(observer){
//         let value = val;
//         const interval = setInterval(()=>{
//         if (value%2 === 1){
//             observer.next(value);
//         }
//         if(value%3===0) observer.error(value);
//         value++;

//         },500);
//         return () => clearInterval(interval);
//     })
// }



// //test
// subject = new Source(createSource,x=>x+1, 0);
// subject.subscribe(x=>console.log(x))
// subject.scan((acc,x)=>(acc+x)).subscribe(x=>console.log(`sum: ${x}`))
  
