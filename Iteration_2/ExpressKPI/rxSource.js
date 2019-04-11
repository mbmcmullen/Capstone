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
        src.subscribe( x => this.link.next(x), err => this.sub(this.createSrc(errHandle(err)), errHandle) )
    }
}

module.exports = {
    Source: Source
}

