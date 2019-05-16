const fork = require('child_process').fork
const numCPUs = require('os').cpus().length
const assert = require('assert')
function lockTest() {
    const workers = []
    for( let i = 0;i < numCPUs; i++){
        const forkProcess = fork(`${__dirname}/lock.js`)
        forkProcess.send('start exec')
        forkProcess.on('message',(_=>{
            console.log(_) //这里可以加入统计 然后最后计算看5s中有没有2个或者2个以上的消息收到。
        }))
        workers.push(forkProcess)
    }
    
}
lockTest()