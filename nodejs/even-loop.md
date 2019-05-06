---
title: 从 *even loop*中说 `setImmediate()`、`setTimeout()`、`process.nextTick()`的区别
date: 2018/6/8
categories: 
  - Node.js
  - even loop
tags: 
  - Node.js
  - even loop
  - setImmediate setTimeout() process.nextTick()
---
# 从*even loop*中说 `setImmediate()`、`setTimeout()`、`process.nextTick()`的区别
## even loop
## 什么是事件循环
Event loop是一种程序结构，是实现异步的一种机制。Event loop可以简单理解为：

1. 所有任务都在主线程上执行，形成一个执行栈（execution context stack）。

2. 主线程之外，还存在一个"任务队列"（task queue）。系统把异步任务放到"任务队列"之中，然后主线程继续执行后续的任务。

3. 一旦"执行栈"中的所有任务执行完毕，系统就会读取"任务队列"。如果这个时候，异步任务已经结束了等待状态，就会从"任务队列"进入执行栈，恢复执行。

主线程不断重复上面的第三步。
<!--more--> 
> REF: [What the heck is the event loop anyway?](https://2014.jsconf.eu/speakers/philip-roberts-what-the-heck-is-the-event-loop-anyway.html)
## 事件轮询机制解析
官方的事件循环机制解析图
```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```
> 图中每个“方框”都是event loop执行的一个阶段（phase）  

     每个阶段都有一个 FIFO 队列来执行回调。虽然每个阶段都是特殊的，但通常情况下，当事件循环进入给定的阶段时，它将执行特定于该阶段的任何操作，然后在该阶段的队列中执行回调，直到队列用尽或最大回调数已执行。当该队列已用尽或达到回调限制，事件循环将移动到下一阶段，等等。
### 阶段概述
- **timers**: 本阶段执行已经安排的 `setTimeout()` 和 `setInterval()` 的回调函数。
- **pending callbacks**: 执行延迟到下一个循环迭代的 I/O 回调。
- **idle, prepare**: 仅系统内部使用
- **poll** 检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，它们由计时器和 setImmediate() 排定的之外），其余情况 node 将在此处阻塞。
- **check**:  setImmediate()  回调函数在这里执行
- **close callbacks**: 一些准备关闭的回调函数, e.g. socket.on('close', ...).
#### **timers**
计时器指定`threshold` 在`threshold`之后执行回调，而不是指定的时间执行。  
会受到其回调的执行时间影响  
[ Nodejs是**单线程处理**的，在**轮询队列中**执行，所以会受到其他回调的影响。有些时候前一个死掉以后后面就会出现无法执行的情况。]
> REF: [Timers in Node.js and beyond](https://nodejs.org/uk/docs/guides/timers-in-node/)  
> REF: [Node.js 文档timer](http://nodejs.cn/api/timers.html)
#### **pending callbacks**
此阶段对某些系统操作（如 TCP 错误类型）执行回调。例如，如果 TCP 套接字在尝试连接时接收到 ECONNREFUSED，则某些 *nix 的系统希望等待报告错误。这将被排队以在 挂起的回调 阶段执行。
#### **poll**
**轮询** 阶段有两个重要的功能:
1. 计算应该阻塞和轮询`I/O`的时间
2. 处理`轮询`队列的事件
当事件循环进入**轮询**阶段并且没有`timer`的计划,将发生以下两种情况之一：
   1. 如果轮询队列**不是空**的，事件循环将遍历`callback`队列，且同步执行，直到队列执行完毕或者达到系统上限。
   2. 如果轮询队列中**是空的**，会发生以下两件事情之一.
      - 如果脚本中包含`setImmediate()`计划，则事件循环会结束轮询阶段并且在检查阶段去执行这些调度脚本。
      - 如果脚本中不包含`setImmediate()`计划，事件循环将等待callback并且添加到队列中，并且立即执行  
  
  一旦轮询队列清空，事件循环会检查`timer`已经到预期执行时间的。如果一个或者多个定时器准备就绪，`even loop `会回到`Timer`阶段去执行这些回调
#### **check**
这个阶段允许人们在`poll`阶段执行完成以后立即执行回调。  
如果`poll`阶段空闲，并且有被setImmediate()设定的回调，event loop会转到 check 阶段而不是继续等待。  

setImmediate()实际上是一个特殊的timer，跑在event loop中一个独立的阶段。它使用libuv的API来设定在 poll 阶段结束后**立即执行**回调。  
通常上来讲，随着代码执行，event loop终将进入 poll 阶段，在这个阶段等待 `incoming` `connection`, `request` 等等。但是，只要有被`setImmediate()`设定了回调，一旦 `poll` 阶段空闲，那么程序将结束 `poll` 阶段并进入 `check` 阶段，而不是继续等待 `poll` 事件。
#### **close callbacks**
如果一个 socket 或 handle 被突然关掉（比如 socket.destroy()），close事件将在这个阶段被触发，否则将通过process.nextTick()触发。
## `setImmediate()` 和 `setTimeout()`
setImmediate() 和 setTimeout() 很类似，但是根据`even loop`的描述来说： 完全是不同的调度行为。
- `setImmediate()` 设计为在当前 轮询 阶段完成后执行脚本。
- `setTimeout()` 计划在毫秒的最小阈值经过后运行的脚本。  
  
      执行计时器的顺序将根据调用它们的上下文而异。如果二者都从主模块内调用，则计时将受进程性能的约束（这可能会受到计算机上运行的其它应用程序的影响）。
这样的话是没有办法保证执行的先后顺序的:
```
setTimeout(function() {
    console.log('setTimeout')
}, 0);
setImmediate(function() {
    console.log('setImmediate')
});
```
但是，如果你把这两个函数放入一个 I/O 循环内调用，`setImmediate` 总是被优先调用：

```
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```
因为`setImmediate`在`check`阶段执行而`setTimeout`会在下一个`timer`阶段去执行
## `process.nextTick()`
在`even loop`中并没有显示`process.nextTick()`,即使他是异步API的一部分，因为从技术上来说，它并不是`event loop`的一部分。相反的，`process.nextTick()`会把回调塞入`nextTickQueue`，`nextTickQueue`将在当前操作完成后处理，不管目前处于event loop的哪个阶段。
也就是说如果不恰当的使用`process.nextTick()`会使其他`I/O`调用无法执行
### 为什么允许 `process.nextTick()`
1. 允许用户处理错误，清理任何不需要的资源，或者在事件循环继续之前重试请求。

2. 有时在调用堆栈已解除但在事件循环继续之前，必须允许回调运行。
> 简单的一个实例
```
const server = net.createServer();
server.on('connection', (conn) => { });

server.listen(8080);
server.on('listening', () => { });
```
假设 `listen()` 在事件循环开始时运行，但侦听回调被放置在 `setImmediate()` 中。除非通过主机名，否则将立即绑定到端口。为使事件循环继续进行，它必须命中 `轮询` 阶段，这意味着可能会收到连接，从而允许在侦听事件之前激发连接事件。
## process.nextTick() vs setImmediate()
1. `process.nextTick()` 立即在本阶段执行回调；
2. `setImmediate()`只能在 `check` 阶段执行回调。
### 一个例子
```
__filename='eventloop.js'
fs.readFile(__filename, () => {
    Promise.resolve().then(() => console.log('promise1 resolved'));
    Promise.resolve().then(() => console.log('promise2 resolved'));
    process.nextTick(() => console.log('next tick4'));
    Promise.resolve().then(() => {
        console.log('promise3 resolved');
        process.nextTick(() => console.log('next tick inside promise resolve handler'));
    });
    process.nextTick(() => console.log('next tick1'));
    Promise.resolve().then(() => console.log('promise4 resolved'));
    Promise.resolve().then(() => console.log('promise5 resolved'));
    setImmediate(() => console.log('set immediate1'));
    setImmediate(() => console.log('set immediate2'));

    process.nextTick(() => console.log('next tick2'));

    setTimeout(() => console.log('set timeout'), 0);
    setImmediate(() => console.log('set immediate3'));
    setImmediate(() => console.log('set immediate4'));
    process.nextTick(() => console.log('next tick3'));
})
```
输出的顺序为
```
next tick4
next tick1
next tick2
next tick3
promise1 resolved
promise2 resolved
promise3 resolved
promise4 resolved
promise5 resolved
next tick inside promise resolve handler
set immediate1
set immediate2
set immediate3
set immediate4
set timeout
```
## REF
[The Node.js Event Loop, Timers, and process.nextTick()](https://nodejs.org/de/docs/guides/event-loop-timers-and-nexttick/)