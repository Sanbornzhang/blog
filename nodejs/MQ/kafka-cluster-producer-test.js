const child_process = require('child_process')
const numCPUs = require('os').cpus().length


const workers = []
for(let i = 0; i < numCPUs; i++){
   const worker =  child_process.fork(`${__dirname}/kafka-producer-test.js`)
   worker.send('start')
   workers.push(worker)
}

