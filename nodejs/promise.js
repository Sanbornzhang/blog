
// TODO:  
// 1. setImmediate call back func
// 2. then 链式调用 如果 return 返回的是一个Promise
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

const test = new myPromise((resolve, reject)=>{
  return resolve('111')
})
test
.then(_=>{
  console.log('value',_)
//   return myPromise.resolve('resolve')
})
// .then(_=>{
//   console.log('aaa')
// })

myPromise.resolve('resolve')
.then(_=>{
//   return myPromise.resolve('aaa')
console.log(_)
})
// .then(_=>{
//   console.log(_)
// })