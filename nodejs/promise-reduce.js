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
