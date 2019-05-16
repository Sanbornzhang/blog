process.on('message', (_)=>{
    console.log(`get message on master ${_}, child process pid: ${process.pid}`)
})
