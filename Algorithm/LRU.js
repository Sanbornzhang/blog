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