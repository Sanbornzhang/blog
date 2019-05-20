---
title: 使用`Redis`作为消息队列
date: 2019/4/28
categories: 
- Nodejs
- redis
- 消息队列
tags: 
- Nodejs
- redis
- 消息队列
---
# 使用`Redis`作为消息队列
## 为什么要使用消息队列
- 解耦： ISP
- 扩展性： 水平扩展
- 灵活性： 不同的语言
- 可恢复性：系统的一部分组件失效时，不会影响到整个系统
- 顺序保证： 秒杀类场景
- 异步处理： 延时任务

使用`redis`作为消息队列的包有 [kue](https://github.com/Automattic/kue)

## 思路
1. 订阅对应的`channel`，
2. 在`channel` 中发送对应的消息
3. `consumer` 收到消息，然后消费
4. 确保只有有且只能有一个消费成功
   简单的实现使用`blpop` 复杂的可以使用`hash`，确保只有一个使用成功可以使用`setnx`来实现
5. 消费失败以后进行回滚操作  
   <!--more-->  
   
    TODO: `List`{channel, data, reCount} 成功的话就删除，没成功定时去从新push到对应的`channel`中
>这里仅仅是简单使用`redis`实现一个消息队列,更推荐是使用`kafka`,如果使用`redis`作为消息队列的话推荐`kue`

## 实现一个简单的消息队列
- consumer.js
```js
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
```

- producer.js
- 
```js 
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
```
- pub-test.js

```js
const producer = require('./producer')
const channel = 'testSub'
for (let index = 0; index < 100; index++) {
    producer.send(channel, `${index}`)
    
}
```

- consumer-test.js
``` js
const consumer = require('./consumer')
process.on('message', (channel) => {
    console.log(`${process.pid} sub ${channel}`)
    consumer(channel)
})
```

- multiWorker.js
```js
const child_process = require('child_process')
const numCPUs = require('os').cpus().length


const workers = []
const channel = 'testSub'
for(let i = 0; i < numCPUs; i++){
   const worker =  child_process.fork(`${__dirname}/consumer-test.js`)
   worker.send(channel)
   workers.push(worker)
}


```

## REF
[redis pub/sub](https://redis.io/topics/pubsub)  
[redis blpop](https://redis.io/commands/blpop)