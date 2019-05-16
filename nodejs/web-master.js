const child_process = require('child_process')
const http = require('http')

const numCPUs = require('os').cpus().length

const workers = []
for( let i = 0; i < numCPUs; i++ ){
    workers.push(child_process.fork(`${__dirname}/web-child.js`))
}

const server = http.createServer()
server.listen(3000, ()=>{

    server.on('connection',()=>{
        console.log('--1--')
        const worker = workers.pop()
        worker.send({},server)
        workers.unshift(worker)
    })
    
})
