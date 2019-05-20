---
title: 使用 kafka 作为消息队列
top: 2
date: 2019/2/25
categories: 
- Node.js
- kafka
- 消息队列
tags: 
- Node.js
- kafka
- 消息队列
---
# 使用 kafka 作为消息队列
## 为什么需要消息队列
- 解耦： ISP
- 扩展性： 水平扩展
- 灵活性： 不同的语言
- 可恢复性：系统的一部分组件失效时，不会影响到整个系统
- 顺序保证： 秒杀类场景
- 异步处理： 延时任务
<!--more-->

## 为什么选择`kafka`
1. 提供Pub/Sub方式的海量消息处理。
2. 以高容错的方式存储海量数据流。
3. 保证数据流的顺序。
## 使用`docker-compose` 运行 `kafka`
```
git clone https://github.com/wurstmeister/kafka-docker

```