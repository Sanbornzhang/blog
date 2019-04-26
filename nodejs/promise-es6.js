const PENDING = Symbol('pending')
const FULFILLED = Symbol('fulfilled')
const REJECTED = Symbol('rejected')

class Promise {
  constructor(exec) {
    this.status = PENDING
    this.data = undefined
    this.reason = undefined

    const self = this
    const resolve = (data)=>{
    if (data instanceof Promise) {
      return data.then(resolve, reject)
    }
    setImmediate(_=>{
      if(this.status === PENDING) {
        this.status = FULFILLED
        this.data = data
        return data
      }})
    }
    function reject(reason){
      if (data instanceof Promise) {
        return data.then(resolve, reject)
      }
      setImmediate(_=>{
        if(self.status === PENDING) {
          self.status = FULFILLED
          self.reason = reason
          return reason
        }})
    }
    try {
      console.log(resolve,reject)
      exec(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected){
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function() {}
    onRejected = typeof onRejected === 'function' ? onRejected : function() {}
  }
}
a=new Promise((_,__)=>{
  return _('1')
})
a.then(_=>{
  
})
