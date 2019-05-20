const producer = require('./producer')
const channel = 'testSub'
for (let index = 0; index < 100; index++) {
    producer.send(channel, `${index}`)
    
}
