const child_process = require('child_process')
const numCPUs = require('os').cpus().length


const workers = []
const channel = 'testSub'
for(let i = 0; i < numCPUs; i++){
   const worker =  child_process.fork(`${__dirname}/consumer-test.js`)
   worker.send(channel)
   workers.push(worker)
}

