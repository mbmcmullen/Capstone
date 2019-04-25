const rx = require("rxjs")
const { Rx } = require('rxjs/Rx')

/**
 * README:
 * 
 *      Use following format to run program:
 * 
 *          > node dummy2.js [cmdArg]
 * 
 *          where cmdArg = source_class, observable_create, interval, switchMap
 * 
 *      Errors can come from both observables and observers. 
 *          What makes these errors different? 
 *          How are these errors handled?
 * 
 *      Error in Observable
 *          The createSource() function will throw an error when the next value is 5. 
 *          The 'observable_create' case will throw an error in it's subscribe function when the value is 5. 
 *          Therefore every case should throw an error when the value is 5. 
 * 
 *      Error in Observer
 *          Errors can also be thrown in observers. Is this a concern for the fault tolerance that we want to implement?                   
 */


if (process.argv.length !== 3) {
    throw new Error('ERROR : invalid number of arguments\n')
}

var observableAType = process.argv[2]
var observableA = null

function createSource(val = 0){
    return rx.Observable.create(
    function(observer) {
        let value = val;
        const interval = setInterval(()=>{
            console.log(`createSource value : ${value}\n`)
            observer.next(value)
            value++;
        }, 1000);

        return () => clearInterval(interval);
    })
}


switch (observableAType) {
    case 'source_class' : {

        console.log('observableA is being created with Source Class.')

        //#region Observable A using Source Class

        /**
         *  Object.keys(observableA):
         *      observableA[_isScalar] : false
         *      observableA[observers] :
         *      observableA[closed] : false
         *      observableA[isStopped] : false
         *      observableA[hasError] : false
         *      observableA[thrownError] : null
         */

        //note: Source doesn't extend Observable but constructor returns a Subject 
        class Source {
            //createFunc: used to create and recreate the source when an error occurs
            //handle: used to handle errors
            //value: initial value to create source at 
            constructor(createFunc, errHandle, value){
                this.createSrc = createFunc;
                this.link = new rx.Subject();
                this.sub(this.createSrc(value), errHandle);
                return this.link;
            }
            
            //src: the new source, created by createSrc function
            sub(src, errHandle){
                // console.log(`DEBUG Source.sub() called`)
                src.subscribe( 
                    x => this.link.next(x), 
                    err => this.sub(this.createSrc(errHandle(err)), 
                    errHandle) )
            }
        }

        observableA = new Source(createSource, x => x+1, 0);

        //#endregion

        break
    }

    case 'observable_create' : {

        console.log('observableA is being created with Rx.Observable.Create(...).')

        //#region Observable A using rx.Observable.create()

        /**
         *  Object.keys(observableA):
                observableA[_isScalar] : false
                observableA[_subscribe] : function (observer) {
                        var curVal, lastValidValue, i = 0;
                        var arr = [1, 2, 3, 4, 5, "apple", 7]
                        
                        var interval = setInterval(() => {
                            curVal = arr[i++]

                            if (isNaN(curVal)) {
                                observer.error(`(Observable A) Value is NaN : ${curVal}`)
                            }
                            else {
                                // console.log(`Observable A: ${curVal}`)
                                observer.next(curVal)
                            }
                        }, 1000)

                        return function unsubscribe() {
                            clearInterval(interval)
                        }
                    }
        */

        observableA = new rx.Observable.create(
            function (observer) {
                var curVal, lastValidValue, i = 0;
                var arr = [1, 2, 3, 4, 5, 6, 7, 8]
                
                var interval = setInterval(() => {
                    curVal = arr[i++]

                    if (i == arr.length){
                        observer.complete()
                    }
                    else {
                        if (curVal === 5) {
                            console.log(`Observable.create() Error value : ${curVal}`)
                            observer.error(curVal)
                        }
                        else {
                            observer.next(curVal)
                        }
                    }

                }, 1000)

                return function unsubscribe() {
                    clearInterval(interval)
                }
            }
        );

        //#endregion

        break
    }

    case 'interval' : {

        console.log('observableA is being created with Rx.interval(1000)')

        //#region Observable A using rx.interval()

        /**
         *  Object.keys(observableA):
                observableA[_isScalar] : false
                observableA[_subscribe] : function (subscriber) {
                    subscriber.add(scheduler.schedule(dispatch, period, { subscriber: subscriber, counter: 0, period: period }));
                    return subscriber;
                }
        */

        observableA = rx.interval(1000)

        //#endregion
        break
    }

    case 'switchMap' : {

        console.log('observableA is being created with createSource(0).switchMap(...)')

        //#region Observable A using switchMap

        /**
         *  Object.keys(observableA):
                observableA[_isScalar] : false
                observableA[source] : [object Object]
                observableA[operator] : [object Object]
        */

        var sourceObservable = createSource(0);

        observableA = sourceObservable
            .switchMap((x) => 
                rx.Observable.of(x)    
                    .map(x => {
                        if (x === 5) {
                            throw new Error(`ERROR switchMap : ${x}\n`)
                        }
                        else {
                            console.log(`switchMap : ${x}\n`)
                            return x;
                        }
                    })
                    .catch(error => rx.Observable.of(x))
            )
            .scan((accum, curVal) => {return curVal + accum})


        //#endregion
        break
    }

    default : {
        console.log('observableA is being created with Rx.interval(1000)')

        observableA = rx.interval(1000);
        break
    } 

}
 
//console.log('Object.keys(observableA): ')
//Object.keys(observableA).map(x => console.log(`\tobservableA[${x}] : ${observableA[x]}`))
console.log()

var observerA = {
    next: (v) =>  {
        if (v == 2)
            throw new Error(`Observer A: ${v}`)
        console.log(`Observer A: ${v}\n`)
    }, 
    error: (err) => {
        console.log(`ERROR Observer A : ${err}\n`)
    }, 
    complete: () => {
        console.log('COMPLETE Observer A \n')
    }
}

var subscriptionA = observableA.subscribe(observerA)

// var observableB = observableA.filter(
//     (x) => {
//         return x % 2 == 0
//     })

// var observerB = {
//     next: (v) =>  {
//         console.log(`Observer B : ${v}\n`)
//     }, 
//     error: (err) => {
//         console.log(`ERROR Observer B : ${err}\n`)
//     }, 
//     complete: () => {
//         console.log('COMPLETE Observer B \n')
//     }
// }

// var subscriptionB = observableB.subscribe(observerB)

// var observableC = observableB.scan((accum, curVal) => {return curVal + accum})

// var observerC = {
//     next: (v) =>  {
//         console.log(`Observer C : ${v}\n`)
//         // if (v > 4) {
//         //     throw new Error(`Observer C Error value : ${v}`)
//         // }
//     }, 
//     error: (err) => {
//         console.log(`ERROR Observer C : ${err}\n`)
//     }, 
//     complete: () => {
//         console.log('COMPLETE Observer C \n')
//     }
// }

// var subscriptionC = observableC.subscribe(observerC)

// //Rx.merge(observableA, observableB).subscribe(observer)

