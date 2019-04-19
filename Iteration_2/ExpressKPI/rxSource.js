const { Subject, Observable } = require('rxjs');

//note: Source doesn't extend Observable but constructor returns a Subject 
class Source {
    //createFunc: used to create and recreate the source when an error occurs
    //handle: used to handle errors
    //value: initial value to create source at 
    constructor(createFunc, errHandle, value){
        this.createSrc = createFunc;
        this.link = new Subject();
        this.sub(this.createSrc(value), errHandle);
        return this.link;
    }
    
    //src: the new source, created by createSrc function
    sub(src, errHandle){
        console.log(`DEBUG Source.sub() called`)
        src.subscribe( 
            x => this.link.next(x), 
            err => this.sub(this.createSrc(errHandle(err)), 
            errHandle) )
    }
}

module.exports = {
    Source: Source
}



/**
 * Source 
 *      on init:
 *          1. Create a Subject that lasts for the duration of the objects life
 *          2. Create an Observable using the createSrc function passed into it
 *          3. Pass this Observable to the sub function with the errHandle function
 *          4. sub function then subscribes to this Observable (src) using a 
 *              recursive strategy 
 */

 