const Redis = require('ioredis')
const localIPs = require('os').networkInterfaces()['vEthernet (Primary Virtual Switch)']
const localIPv4 = localIPs.find(_ => Object.keys(_) && _.family === 'IPv4')
const sub = new Redis(6379, localIPv4.address)
const redis = new Redis(6379, localIPv4.address)

const required = _ => {
  throw (new Error(`arguments must required`))
}

function consumer(channel = required()) {
  return sub.subscribe(channel, (err, count) => {
    return sub.on('message', (err, data) => {
      redis.blpop(`${channel}_job`, 5, (err, data)=>{
        if(data) {
          console.log(`${process.pid}: get data: ${data[1]}`)
          // do something
        }
      })
    })
  })
}

module.exports = consumer