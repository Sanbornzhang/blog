const consumer = require('./kafka-consumer')
process.on('message', (channel) => {
    console.log(`${process.pid} sub ${channel}`)
    consumer()
})