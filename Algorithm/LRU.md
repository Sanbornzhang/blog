---
title: LRU 算法
date: 2018/7/16
top: 2
categories: 
- redis
- algorithm
- Node.js
tags: 
- redis
- algorithm
- Node.js
---

# LRU 算法以及实现
## 什么是LRU
    LRU（Least recently used，最近最少使用）算法根据数据的历史访问记录来进行淘汰数据，其核心思想是 '如果数据最近被访问过，那么将来被访问的几率也更高'。

## 为什么使用链表
- 数组  
  数组的内存地址是连续的，一般来讲里面类型也是一致的。只是js做了特殊的处理。[如果长度大于2000，如果类型不一致，就会带来相当大的性能影响]
- 链表  
  链表中的元素可存储在内存的任何地方。链表的每个元素都存储了下一个元素的地址，从而使一系列随机的内存地址串在一起。


## 双向链表的简单实现
```
class Node {
  constructor(data, next = null, previous = null) {
    this.data = data
    this.next = next
    this.previous = previous
  }
}

class LList {
  constructor() {
    this.head = null
    this.length = 0
  }

  findV(v) {
    let current = this.head
    while (current.data !== current.data) {
      current = current.next
    }
    return current
  }
  findI(i) {
    let current = this.head
    let index = 0
    if (i < 0) return null
    while (i !== index) {
      current = current.next
      index++
    }
    return current
  }
  insert(v, i) {
    const newNode = new Node(v)
    if (!this.head) {
      this.head = newNode
    } else if (i) {
      if (i === 0) {
        const node = this.head
        newNode.next = node
      }
      if (i) {
        const current = this.findI(i)
        if (current) {
          const node = current.next
          node.previous = node
          current.next = newNode
          newNode.next = node
          newNode.previous = current
          
        } else {
          // if can't find previous node is new list
          this.head = newNode
        }
      }
    } else {
      const lastNode = this.end()
      lastNode.next = newNode
      newNode.previous = lastNode
    }
    this.length ++
    return newNode
  }

  remove(i) {
    const node = this.findI(i)
    let result = 0
    if (node !== null && Object.keys(node).length) {
      const previous = node.previous
      if (previous !== null  && Object.keys(previous).length) {
        previous.next = node.next
      } else {
        this.head = node.next
      }
      result = 1
    }
    this.length --
    return result
  }

  end() {
    let current = this.head
    while (current.next) {
      current = current.next
    }
    return current
  }
  iterator(){
    let current = this.head
    const list = []
    list.push(current.data)
    while (current.next) {      
      current = current.next
      list.push(current.data)
    }
    return list
  }
}
module.exports = LList
```

## LRU实现
我们采用`双链表 + Object`的方式

```
const LinkList = require('./utils/LList')
const assert = require('assert')
class LRUCache {
    constructor(limit) {
        this.limit = limit || 1000
        this.linkList = new LinkList()
        this.map = {}
    }
    set(k, v) {
        const cacheNodeData = this.get(k)

        if (cacheNodeData !== undefined && cacheNodeData !== null) {
            return cacheNodeData
        } else {
            if (this.linkList.length === this.limit) {
                let latestNode = this.linkList.end()
                this.linkList.remove(this.linkList.length - 1)
                const latestKey = latestNode.key
                this['map'][latestKey]['node'] = null
                this['map'][latestKey] = null
            }
            this['map'][k] = {}
            const node = this.linkList.insert(v)
            node.key = k
            this['map'][k]['node'] = node
            return node
        }
    }
    get(k) {
        if (this['map'][k] !== undefined && this['map'][k] !== null &&
            Object.keys(this['map'][k])) {
            if (this['map'][k]['node'] === this.linkList.head) {
                return this.linkList.head.data
            } else {
                const node = this['map'][k]['node']
                const previous = node.previous
                if (previous) {
                    const next = node.next
                    previous.next = next
                    if (next) {
                        next.previous = previous
                    }
                }
                this.linkList.head.previous = node
                node.next = this.linkList.head

                node.previous = null
                this.linkList.head = node
                return node.data
            }
        } else {
            return null
        }

    }
}
const test = (count = 10 * 100 * 1000) => {
    console.time('cache test')
    const cacheInstance = new LRUCache(200)
    for (let loop = 0; loop < count; loop++) {
        for (let i = 1; i < 3000; i++) {
            cacheInstance.set(i, i)
            const v = cacheInstance.get(i)
            assert(v !== undefined && v === i, `k: ${i} v:${v},${JSON.stringify(cacheInstance.data)}`)
        }
    }
    console.timeEnd('cache test')
    const item = cacheInstance.linkList.iterator()
    console.log(item.length)
    console.time('cache get')
    cacheInstance.get(99)
    console.timeEnd('cache get')

}
test(10000)
```
### 测试
```
cache test: 16298.695ms
链表长度: 20
cache get: 0.004ms
-----------------------
cache test: 55168.847ms
链表长度: 200
cache get: 0.006ms
```

### TODO:优化
可以存`链表的end`结尾，不然随着数据的超出限制以后 set 速度会随之下降 O(n)