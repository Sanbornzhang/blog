const Redis = require('ioredis')
const redis = new Redis()
const util = require('util')

async function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function locked(keyName, expireTime = 1000 * 5) {
  if(!util.isFunction(this.getData)) {
    return Promise.reject('arguments error, getData is not function . e.g: locked.call({getData:()=>{}, keyName, expireTime})')
  }
  // if(!keyName){
      // error rejected
  // }
  const nxKey = `${keyName}_nx`
  const tryLock = await redis.setnx(nxKey, (Date.now() + expireTime)) 
  if(tryLock) {
    await redis.pexpire(nxKey, expireTime) // 有个问题是没有运行到这一步的时候程序crash了... 然后就出现了死锁, 需要增加参数判断是第几次去重试
    const data = await this.getData() // 使用传参的方式可能会更好一点 但是有Error rejected 也可以接受看具体吧
    await redis.set(keyName, data)
    // 这里需要释放锁 
    // redis.del(nxKey) 为了测试。 注释掉了
    return data
  }
  else {
    await sleep(expireTime) 
    // 这里其实是锁的实现，具体业务应该是 到 getCacheData(keyName) -> cache中为空 -> 设置锁拉取数据 -> 设置锁成功-> 拉取成功 -》 删除锁 返回数据
    // getCacheData(keyName) -> cache中为空 -> 设置锁拉取数据 -> 设置锁失败-> 等待一段时间(1S完全足够了) -> getCacheData(keyName) 而不是再去调用locked() 
    return locked.call(this, keyName, expireTime)
  }
}

async function lockedTest() {
  const fake = {
    getData: function () {
      return Promise.resolve('fake data')
    }
  }
  const data = await locked.call(fake, "noSql-redis-lock-test")
  console.log(data)
  process.send(new Date())
}

process.on('message',()=>{
  lockedTest()
})