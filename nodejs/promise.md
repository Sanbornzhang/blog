---
title: Promise
date: 2018/6/8
categories: 
  - Node.js
  - Promise
tags: 
  - Node.js
  - Promise
  - 手写Promise
---
# Promise
## Promise 
Promise 对象是 JavaScript 的异步操作解决方案，为异步操作提供统一接口。它起到代理作用（proxy），充当异步操作与回调函数之间的中介，使得异步操作具备同步操作的接口。Promise 可以让异步操作写起来，就像在写同步操作的流程，而不必一层层地嵌套回调函数。
### Callback Hell
![Callback Hell](./images/callback-hell.jpg)
<!--more--> 
> 在使用callback的同时会遇到一些痛点
- 代码不利于维护以及阅读.
- 回调函数基本上都是匿名函数不利于DEBUG.
### Promise
```
step1
.then(step2)
.then(step3)
.then(step4)
...
```
    可以看出使用了`Promise`之后流程变得非常清晰，代码也变得通熟易懂。
### `Promise A+` 规范
#### Promise 三种状态
- Fulfilled  
  处于执行态时，promise 需满足以下条件：
  + 不能迁移至其他任何状态
  + 必须拥有一个不可以改变的值
- Rejected    
  处于拒绝态时，promise 需满足以下条件：
  + 不能迁移至其他任何状态
  + 必须有一个原因，以及不可以改变。
- pending  
  处于等待态时，promise 需满足以下条件：
  1. 可以迁移至执行态或拒绝态
#### `Then` 方法
    一个`Promise` 必须提供一个`then`方法，可以访问当前值或中值和拒绝原因  
    Promise 的 then 方法接受2个参数  
```
Promise.then(onFulfilled, onRejected)
```
  - onFulfilled 以及 onRejected 都是可选参数 但是都必须为函数
  - function: onFulfilled
    + 必须在Promise完成以后调用也就是状态为 `Fulfilled`, 值为第一个参数。
    + 必须在完成以后才能调用。也就是说`.then(value=>{})` 值必须是这个`Promise`完成以后才会拥有
    + 只能够被调用一次
  - function: onRejected
    + 只能在被拒绝之后调用，并且值为原因。一般是Error。
    + 在Rejected之后才会调用
    + 也只能被调用一次 
  - `onFulfilled`或者`onRejected`在执行上下文堆栈仅包含平台代码之前不得调用
  - `onFulfilled`并且`onRejected`必须作为函数调用（即没有this值)
  - `then`方法可以在同一个`Promise`中被调用多次
  - `then` 方法必须返回的是一个`Promise`  

```
  promise2 = promise1.then(onFulfilled, onRejected);
```
- 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)
- 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
- 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
- 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因  
以上也是Promise可以使用调用链的原因
### 手动实现`Promise`
    没有实现Promise的链式调用以及需要改为setImmediate 或者是 process.nextTick
```
function myPromise(exec) {
  const self = this
  self.statusMap = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
  }
  self.status = self.statusMap.PENDING
  self.data = undefined
  function resolve(data) {
    if (self.status === self.statusMap.PENDING) { // 状态必须为 pending 才能赋值
      self.status = self.statusMap.FULFILLED
      self.data = data
    }
   }
  function reject(err) {
    if (self.status === self.statusMap.PENDING) { // 状态必须为 pending 才能赋值
      self.status = self.statusMap.REJECTED
      self.error = err
    }
  }

  try {
    exec(resolve, reject)
  } catch (error) {
    reject(error)
  }
}
myPromise.resolve = (data)=>new myPromise((resolve, reject)=>resolve(data))
myPromise.reject= (reason)=>new myPromise((resolve, reject)=>reject(reason))
// 实例.then方法
/** 
 * then function
 * @param {Function} onFulfilled
 * @param {Function} onRejected
 */
myPromise.prototype.then = function (onFulfilled, onRejected) {
  if(this.status === this.statusMap.FULFILLED) {
    try {
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function() {}
      const result = onFulfilled(this.data)
      if( result instanceof myPromise) result.then(myPromise.resolve, myPromise.reject)
      myPromise.resolve(this.data)
    } catch (error) {
      myPromise.reject(error)
    }
  }
  if(this.status === this.statusMap.REJECTED) {
    try {
      onRejected = typeof onFulfilled === 'function' ? onFulfilled : function() {}
      const result = onRejected(this.data)
      if( result instanceof myPromise) result.then(myPromise.resolve, myPromise.reject)
      myPromise.resolve(this.data)
    } catch (error) {
      myPromise.reject(error)
    }
  }
  if(this.status === this.statusMap.PENDING) {
    if (onFulfilled) {
    try {
      const result = onFulfilled(this.data)
      if( result instanceof myPromise) result.then(myPromise.resolve, myPromise.reject)
      myPromise.resolve(this.data)
      } catch (error) {
        myPromise.reject(error)
      }
    }
    else if (onRejected) {
      try {
        const result = onRejected(this.data)
        if( result instanceof myPromise) result.then(myPromise.resolve, myPromise.reject)
        myPromise.resolve(this.data)
      } catch (error) {
        myPromise.reject(error)
      }
    }
  else {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function() {}
  }
  }
}


myPromise.prototype.catch = function(onRejected){
  return this.then(null, onRejected)
}
```
### Promise 执行顺序
  在很多时候我们需要执行一些有状态的异步调用,有相互依赖关系.  
这时候我们可以选择 `bluebird`的[reduce](http://bluebirdjs.com/docs/api/promise.reduce.html)函数，或则是使用`async/await `,  
当然也可以用`array.reduce`构建自己的函数.
其实Promise函数在创建的时候就已经开始运行了，    
那么确保创建的时候是顺序的那么自然确保了执行的结果是顺序的。
```
const sleep = (time)=>{
  return new Promise(resolve=>{
     setTimeout(_=>{
       return resolve(time)},time)
   })
 }
 // .then 构建 复杂且阅读 大量的重复代码
 sleep(30)
 .then(_=>{
   return sleep(10)
 })
 .then(_=>{
   return sleep(20)
 })
 .then(_=>{
   return sleep(25)
 })
 
//  构建queue函数
 const queue = (params = [], promiseFunc)=>{
   const result = []
   return params.reduce((promiseList, value)=>{
     return promiseList.then(_=>{
      return promiseFunc(value)
    }).then(_=>{
      if (_ !== undefined){
        result.push(_)
      }
      return result
    })
   },
   Promise.resolve() //起始值
   )
 
 }
 queue([40,10,5,30,20],sleep)
 .then(_=>{
   console.log('quqe',_)
 })
```
### 其它常用的一些API
- Promise.all
- Promise.reject()
- Promise.resolve()
### Ref
[Promise A+](https://promisesaplus.com/)  
[Promise A+[中文版]](http://www.ituring.com.cn/article/66566)  
[阮一峰 Promise](http://javascript.ruanyifeng.com/advanced/promise.html)  
[We have a problem with promises](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)  
[google git Promise](https://chromium.googlesource.com/v8/v8/+/3.29.45/src/promise.js?autodive=0/)  
[q design](https://github.com/kriskowal/q/tree/v1/design)