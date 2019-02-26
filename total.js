'use strict'

const func_stream = require('./OurModule.js')
const { Transform } = require('stream');


let timesThree = new func_stream.MapStream((curVal) => { return curVal.length === 0 ? 0 : parseInt(curVal)*3})

let total = new func_stream.ReduceStream((accum, curVal) => { return curVal.length === 0 ? accum : parseInt(curVal) + accum});

let filterEven = new func_stream.FilterStream((curVal) => (parseInt(curVal) % 2) === 0)

let count = new func_stream.ReduceStream((accum,curVal) =>(accum+1))

//let inStreams = new func_stream.DuplicateStream(process.stdin,2);

let tupleStream = new func_stream.CombinatorStream();

let commaSplitter = new func_stream.DuplicateStream(3, true, true,
  (chunk) => {
    return chunk.toString().trim().split(',');
  }
)

let objectToString = new func_stream.DuplicateStream(4, false, true,
  (chunk) =>{
    return (JSON.stringify(chunk) + '\n')
  }
)
/*const commaSplitter = new Transform({
  readableObjectMode: true,
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().trim().split(','));
    callback();
  }
});

const objectToString = new Transform({
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
      this.push(JSON.stringify(chunk) + '\n');
      callback()
  }
});
*/


const splitter = commaSplitter.getStreams();
const ots = objectToString.getStreams();

process.stdin
  .pipe(splitter[0])
  //
  //.pipe(filterEven.getStream())
  .pipe(total.getStream())
  .pipe(timesThree.getStream())
  .pipe(count.getStream())
  .pipe(ots[0])
  .pipe(process.stdout)

/*process.stdin
  .pipe(splitter[1])
  .pipe(count.getStream())
  .pipe(ots[1])
  .pipe(process.stdout)

process.stdin
  .pipe(splitter[0])
  .pipe(timesThree.getStream())
  .pipe(ots[2])
  .pipe(process.stdout)


tupleStream.pump(process.stdin, timesThree.getStream());
tupleStream.getStream()
  .pipe(ots[3])
  .pipe(process.stdout)
*/