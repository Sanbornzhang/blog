const kafka = require('kafka-node')
const client = new kafka.KafkaClient({kafkaHost: '127.0.0.1:9092'})
const Producer = kafka.Producer
const producer = new Producer(client);
function sendMessage() {
  producer.on('ready', () => {
    producer.send([{
        topic: 'test',
        messages: 'hi',
        partition: 0
      }], (err, data)=>{
        if(err) throw err
        console.log(`success send message`)
      })
  })

  producer.on('error', (err) => {
    throw err
  })
}
module.exports = sendMessage