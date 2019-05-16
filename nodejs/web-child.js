
const http = require('http')
function startProcess(server){
    console.log('====')
    server.on('request', (req,res)=>{
        console.log('request')
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200
        res.write(`this is child process ${process.pid}`)
        res.end()
    })
}


process.on('message',(m, handler)=>{
    startProcess(handler)
})