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