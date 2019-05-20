const consumer = require('./consumer')
process.on('message', (channel) => {
    console.log(`${process.pid} sub ${channel}`)
    consumer(channel)
})