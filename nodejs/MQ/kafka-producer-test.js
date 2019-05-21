const producer = require('./kafka-producer')
process.on('message', (channel) => {
    console.log(`${process.pid} sub ${channel}`)
    producer()
})