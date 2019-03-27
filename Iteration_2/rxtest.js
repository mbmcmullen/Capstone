const { range, combineLatest,Subject, Observable, zip, merge} = require('rxjs');
const { map, filter, reduce } = require('rxjs/operators');
const { Rx } = require('rxjs/Rx')


const subject1 = new Subject();
const sum = subject1.scan((acc,x)=>acc+x);
const count1 = subject1.scan((acc,x) => acc+1,0);


const subject2 = new Subject();
const count2 = subject2.scan((acc,x) => acc+1,0);

const combine = combineLatest(subject1, subject2);
const runningAvg = zip(sum,count1).map(([x,y])=>x/y);

const avg = combine.map(([x,y])=>(x+y)/2);

const sub1 = subject1.subscribe(value => console.log('data received from subject1:'+value));
const sub2 = sum.subscribe(x=>console.log('subject1 current sum:'+x));
const sub3 = count1.subscribe(x=>console.log('subject1 current count:' +x));
const sub7 = runningAvg.subscribe(x=>console.log('subject1 running average:'+x+'\n'));
const sub4 = subject2.subscribe(x=>console.log('data recieved from subject2:'+x));
const sub8 = count2.subscribe(x=>console.log('subject2 current count:'+x+'\n'));
const sub5 = combine.subscribe(x=>console.log('combined:'+x));
const sub6 = avg.subscribe(x=>console.log('current average of subjects:'+x+'\n'));


function createSource2(val =0){
  return Observable.create(function(observer){
    let value = val;
    const interval = setInterval(()=>{
      if (value%2 === 1){
        observer.next(value);
      }
      if(value==5) observer.error(value);
      value++;
    },500);
    return () => clearInterval(interval);
  })
}

const source1 = Observable.create(function(observer){
  let value = 0;
  const interval = setInterval(()=>{
    if (value%2 === 0){
      observer.next(value);
    }
    //if(value===10) observer.error('ten');
    value++;
  },1000);
  return () => clearInterval(interval);
})

 

source1.subscribe(x => subject1.next(x));

function f(src, init) {
   src(init).subscribe(x =>subject2.next(x), (err) => {console.log(`err: ${err}\n`); f(src,err+1)});
}
f(createSource2, 0);


/*class myObserver extends Subject{
  constructor(x){
    super();
    var acc = x;
  }

  next(x){
    acc = x + acc;
  
  }
}
*/