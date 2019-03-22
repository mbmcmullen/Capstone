
/**
  Allow users to define callbacks to calculate kpis from readable streams
  Pass these callbacks to the 'transform' function defined for a Transform stream
  Pass the returned object from the callback to the 'transform' function's 'this.push()' as the writeable stream object
  Allow users to define length of sliding window calculations



  import {TransformReduceStream} from ourmodule


  const mycallback = ...

  let sum = (reduceCallback, window)
  
  sum.pipe(avg).pipe(display)
  


  Signatures

  
*/

'use strict'

const { Transform } = require('stream');

// (?) refactor class name to kebab-case for future extraction of packages in npm
class ReduceStream {
  constructor(myCallback){
    let current_context = this
    this._reduceAccumulator = 0
    this._stream = new Transform({
      readableObjectMode: true,
      writableObjectMode : true,  
      transform(chunk, encoding, callback) {
          //console.log(`_reduceAccumulator before: ${current_context._reduceAccumulator}`)
          current_context._reduceAccumulator = chunk.reduce(myCallback, current_context._reduceAccumulator)
          //console.log(`_reduceAccumulator after: ${current_context._reduceAccumulator}`)          
          this.push(current_context._reduceAccumulator)
          callback()
      }
    })
  }

  getStream(){
    return this._stream;
  }
}

class MapStream {
  constructor(myCallback){
    this._stream = new Transform({
      readableObjectMode: true, 
      writableObjectMode: true, 
      transform(chunk, encoding, callback) {
        if(chunk instanceof Object){
          chunk = chunk.map(myCallback)
        }else{
          chunk = [chunk].map(myCallback)
        }
        
        this.push(chunk)
        callback()
      }
    })
  }

  getStream(){
    return this._stream;
  }
}

class FilterStream {
  constructor(myCallback){
    this._stream = new Transform({
      readableObjectMode: true, 
      writableObjectMode: true, 
      transform(chunk, encoding, callback){
        chunk = chunk.filter(myCallback) 
        this.push(chunk)
        callback()
      }
    })
  }

  getStream(){
    return this._stream;
  }
}

class DuplicateStream{
  constructor(numDuplicates, readableObject, writableObject, transformCallback){
    
    this._streams = []
    for(let i=0; i< numDuplicates; i++){
      this._streams[i] = new Transform({
        readableObjectMode: readableObject, 
        writableObjectMode: writableObject, 
        transform(chunk,encoding,callback){
          this.push(transformCallback(chunk))
          callback()
        }
      });
    }
  }

  getStreams(){
    return this._streams;
  }
}

class CombinatorStream{
  constructor(streamA,streamB){
    this.buffer = []
    let current_context = this
    
    this._stream1 = new Transform({
      readableObjectMode: true, 
      writableObjectMode: true, 
      transform(chunk, encoding, callback) {
        for(let i=0; i<chunk.length; i++){
          current_context.buffer[i] = [chunk[i], current_context.buffer[i]]
        }
        this.push(chunk)
        callback()
      }
    })

    this._stream2 = new Transform({
      readableObjectMode: true, 
      writableObjectMode: true, 
      transform(chunk, encoding, callback) {
        for(let i=0; i<chunk.length; i++){
          current_context.buffer[i] = [current_context.buffer[i],chunk[i]]
        }
        this.push(chunk)
        callback()
      }
    })

    this._result = new Transform({
      readableObjectMode: true, 
      writableObjectMode: true, 
      transform(chunk, encoding, callback) {
        for(let i=0;i<chunk.length;i++){
          chunk[i] = current_context.buffer[i]
          //console.log("("+i+":"+chunk[i]+")")

        }
        //current_context.flush();
        this.push(chunk)
        callback()
      }
    })

  }

  getStream(){
    return this._result;
  }

  pump(inStreamA,inStreamB){
    inStreamA.pipe(this._stream1)
    inStreamB.pipe(this._stream2).pipe(this._result)
  }

  flush(){
    this.buffer = [];
  }
}

module.exports = {
  ReduceStream: ReduceStream,
  MapStream: MapStream,
  FilterStream: FilterStream,
  DuplicateStream: DuplicateStream,
  CombinatorStream: CombinatorStream
}
//const total = createReduceStream((accum, curVal) => { return parseInt(curVal) + accum})



/*multipipeSynchronous(a,b,c,d,e)
    .pipe(commaSplitter)
    .pipe(total)
    .pipe(objectToString)
    .pipe(singleDisplayOutputStream)      
  */    
