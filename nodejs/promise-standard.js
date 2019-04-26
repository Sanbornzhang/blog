const step1 = ()=>{
  return new Promise((resolve, reject)=>{
    console.log('step1')
    return resolve('step1')
  })
}
const step2 = ()=>{
  return new Promise((resolve, reject)=>{
    console.log('step2')
    return resolve('step2')
  })
}
const step3 = ()=>{
  return new Promise((resolve, reject)=>{
    console.log('step3')
    return resolve('step3')
  })
}

const err = ()=>{
  return new Promise((resolve, reject)=>{
    console.log('error')
    return reject(new Error('test'))
  })
}

step1()
.then(_=>{
  console.log(_)
})

step1()
.then(step2)
.then(step3)

execStep2 = step1().then(step2)
execStep3 = execStep2.then(step3)
execStep3
.then(_=>{
  console.log(`execStep3 ${_}`)
})
step1()
.then(_=>{
  console.log(_)
},_=>{
  console.log(`will not exec ${_}`)
})

err()
.then(_=>{
  console.log(_)
},_=>{
  console.log(`will be err ${_}`)
})
.catch(_=>{
  console.log('will not exec')
})


step1()
.then(_=>'code step2')
.then(_=>'code step3')
.then(_=>{
  console.log(_)
})

staticPromiseResolve = Promise.resolve('static resolve') 
staticPromiseResolve.then(_=>{
  console.log(_)
})

staticPromiseReject = Promise.reject(new Error('reject error')) 
staticPromiseReject
.then(_=>{
  console.log(_) // not exec
})
.catch(_=>{
  console.log(_)
})
