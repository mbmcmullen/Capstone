
const { Transform } = require('stream');

const commaSplitter = new Transform({
  readableObjectMode: true,
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().trim().split(','));
    callback()
  }
});

function myCallback(chunk) {
  let total = chunk.reduce((accum, curVal) => { return parseInt(curVal) + accum}, 0)
  let average = total/chunk.length

  return {'average':average}
}

const arrayToObject = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    
    // const obj = {};
    // for(let i=0; i < chunk.length; i+=2) {
    //   obj[chunk[i]] = chunk[i+1];
    //   console.log(`obj[${chunk[i]}] = ${chunk[i+1]}`)
    // }

    this.push(myCallback(chunk))
    callback()
  }
});

const objectToString = new Transform({
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    this.push(JSON.stringify(chunk) + '\n');
    callback();
  }
});

//Object.keys(arrayToObject).map(x => console.log(`${x}: ${JSON.stringify(arrayToObject[x])}`))

process.stdin
  .pipe(commaSplitter)
  .pipe(arrayToObject)
  .pipe(objectToString)
  .pipe(process.stdout)


/**
  Allow users to define callbacks to calculate kpis from readable streams
  Pass these callbacks to the 'transform' function defined for a Transform stream
  Pass the returned object from the callback to the 'transform' function's 'this.push()' as the writeable stream object
  Allow users to define length of sliding window calculations
  Typescript?


  TODO:
    Create github repo for dir
    Refactor createReduceStream into a class structure
    Create filter, map stream functionality 
    Multiplexing streams into a singular stream 
      see: https://gist.github.com/nicolashery/5910969
    
    General questions for Tian's meeting doc on Onedrive

*/
