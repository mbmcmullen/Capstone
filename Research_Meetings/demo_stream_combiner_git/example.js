var util = require('util')
  , Transform = require('stream').Transform
  , StreamCombiner = require('./streamcombiner');

var chunks1 = [];
var stream1 = new Transform();
var soFar = '';
stream1._transform = function(chunk, encoding, done) {
  chunks1.push(chunk.toString());
  var pieces = (soFar + chunk).split('\n');
  console.log(`stream1 pieces: ${pieces}`)
  soFar = pieces.pop();
  for (var i = 0; i < pieces.length; i++) {
    var piece = pieces[i];
    console.log(`stream1 loop piece: ${piece}`)
    this.push(piece);
  }
  return done();
};

var chunks2 = [];
var count = 0;
var stream2 = new Transform();
stream2._transform = function(chunk, encoding, done) {
  chunks2.push(chunk.toString());
  count = count + 1;
  console.log(`stream2 push ${count + ' ' + chunk.toString() + '\n'}`)
  this.push(count + ' ' + chunk.toString() + '\n');
  done();
};

var stdin = process.stdin;
var stdout = process.stdout;

process.on('exit', function () {
    console.error('chunks1: ' + JSON.stringify(chunks1));
    console.error('chunks2: ' + JSON.stringify(chunks2));
});
process.stdout.on('error', process.exit);

// Test with `stream1` and `stream2`
// stdin.pipe(stream1).pipe(stream2).pipe(stdout);

// $ (printf "abc\nd"; sleep 1; printf "ef\nghi\n") | node example.js
// Outputs:
// 1 abc
// 2 def
// 3 ghi
// chunks1: ["abc\nd","ef\nghi\n"]
// chunks2: ["abc","def","ghi"]

// Now combine into `stream3` to "hide" `stream1` and `stream2` from user
var stream3 = new StreamCombiner(stream1, stream2);
stdin.pipe(stream3).pipe(stdout);

// $ (printf "abc\nd"; sleep 1; printf "ef\nghi\n") | node example.js
// Outputs:
// 1 abc
// 2 def
// 3 ghi
// chunks1: ["abc\nd","ef\nghi\n"]
// chunks2: ["abc","def","ghi"]
