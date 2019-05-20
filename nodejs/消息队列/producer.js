const Redis = require('ioredis')
const localIPs = require('os').networkInterfaces()['vEthernet (Primary Virtual Switch)']
const localIPv4 = localIPs.find(_ => Object.keys(_) && _.family === 'IPv4')
const pub = new Redis(6379, localIPv4.address)
const required = _ => {
  throw (new Error(`arguments must required`))
}
function send(channel = require(), message = required()) {
  pub.publish(channel, message)
  pub.lpush(`${channel}_job`, message)
}
exports.send = send