const process = require('process')
const fs = require('fs')
// function someAsyncOperation(callback) {
//     // Assume this takes 95ms to complete
//     // fs.readFile('/path/to/bigFile', callback);
//     // fs.readFile('evenloop.js',callback)
// }

// const timeoutScheduled = Date.now();

// setTimeout(() => {
// const delay = Date.now() - timeoutScheduled;

// console.log(`${delay}ms have passed since I was scheduled`);
// }, 10);


// // do someAsyncOperation which takes 95 ms to complete
// someAsyncOperation(() => {
// const startCallback = Date.now();

// // do something that will take 10ms...
// while (Date.now() - startCallback < 10) {
//     // do nothing
// }
// });

// setTimeout(function() {
//     console.log('setTimeout')
// }, 0);
// setImmediate(function() {
//     console.log('setImmediate')
// });
__filename='eventloop.js'
fs.readFile(__filename, () => {
    Promise.resolve().then(() => console.log('promise1 resolved'));
    Promise.resolve().then(() => console.log('promise2 resolved'));
    process.nextTick(() => console.log('next tick4'));
    Promise.resolve().then(() => {
        console.log('promise3 resolved');
        process.nextTick(() => console.log('next tick inside promise resolve handler'));
    });
    process.nextTick(() => console.log('next tick1'));
    Promise.resolve().then(() => console.log('promise4 resolved'));
    Promise.resolve().then(() => console.log('promise5 resolved'));
    setImmediate(() => console.log('set immediate1'));
    setImmediate(() => console.log('set immediate2'));

    process.nextTick(() => console.log('next tick2'));

    setTimeout(() => console.log('set timeout'), 0);
    setImmediate(() => console.log('set immediate3'));
    setImmediate(() => console.log('set immediate4'));
    process.nextTick(() => console.log('next tick3'));
})
