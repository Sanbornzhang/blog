const sleep = (time)=>{
  return new Promise(resolve=>{
     setTimeout(_=>{
       console.log(time)
       return resolve(time)},time)
   })
 }
//  sleep(30)
//  .then(_=>{
//    return sleep(10)
//  })
//  .then(_=>{
//    return sleep(20)
//  })
//  .then(_=>{
//    return sleep(25)
//  })
 
 const queue = (params = [], promiseFunc)=>{
   return params.reduce((promiseList, value)=>{
     return promiseList.then(_=>promiseFunc(value))
   },
   Promise.resolve() //起始值
   )
 
 }
 queue([40,10,5,30,20],sleep)
 .then(_=>{
   console.log('quqe')
 })