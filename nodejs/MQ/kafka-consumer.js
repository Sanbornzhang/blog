const kafka = require('kafka-node')
const ConsumerGroup  = kafka.ConsumerGroup
const consumerGroupOptions =  {
  kafkaHost: '127.0.0.1:9092',
  groupId: 'ExampleTestGroup',
  protocol: ['roundrobin'],
}
function consumerListening(){
  const consumer = new ConsumerGroup (consumerGroupOptions, 'test')
  consumer.on('error', (err)=>{
    console.log(err)
  })
  consumer.on('message', (message) => {
    console.log(message)
    try {
      // your handler
    } catch (error) {
      consumer.close()
    }
  })
}
module.exports = consumerListening
