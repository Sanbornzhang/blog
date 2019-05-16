const child_process = require('child_process')
const numCPUs = require('os').cpus().length
const worker = []

for(let i = 0; i < numCPUs; i++) {
    console.log('fork process')
    const forkProcess = child_process.fork(`${__dirname}/child.js`)
    forkProcess.send('send messages')
    worker.push(forkProcess)
}
