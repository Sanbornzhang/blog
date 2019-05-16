---
title: Redis 数据结构的使用
date: 2018/10/16
categories: 
- redis
tags: 
- redis
---
# Redis 数据结构的使用
## 使用`Docker`简单的运行一个单节点的`Redis server`
  ```
  docker run \
    -d \
    -p 6379:6379\
    --restart=always \
    --name redis \
    redis
  ```
  ![docker run redis](images/nosql-redis-docker-run.png)
<!--more-->

## 使用`Redis`命令
1. 进入容器内部`docker exec -it redis bash`
2. 使用`redis-cli` 也可以加上 `-n: 选择不同的db`
![redis-cli](images/nosql-redis-docker-exec.png)
## String
   ```
   SET keyName Value
   ```
   ![redis set key](images/nosql-redis-set-key.png)
   ![redis key get set](images/nosql-redis-get-set-key.png)

## List
    Redis列表是简单的字符串列表，按照插入顺序排序[**有序**]。
> 一个列表最多可以包含 232 - 1 个元素 (4294967295, 每个列表超过40亿个元素)。

## 使用
- 设置值
  ```
  LPUSH KEY value
  ```
  ![redis list lpush](images/nosql-redis-list-lpush.png)

- 获取列表中的所有原始
  ```
  LRANGE KEY start stop
  ```
  ![redis list lrange](images/nosql-redis-list-lrange.png)

- `LINDEX key index`: 通过索引获取列表中的元素
- `LREM KEY_NAME COUNT VALUE`: 根据参数 COUNT 的值，移除列表中与参数 VALUE 相等的元素。
- `BLPOP key1 [key2 ] timeout`: 移出并获取列表的第一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。 
- `BRPOP key1 [key2 ] timeout`:  移出并获取列表的最后一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。
  
## Set
    Redis 的 Set 是 String 类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据。
### 使用
- 设置值
  ```
  SADD key value
  ```
  ![redis set](images/nosql-redis-set.png)
- 移除值
  ```
  SREM key value
  ```
  ![redis set srem](images/nosql-redis-set-srem.png)
- 获取值
  ```
  SMEMBERS key
  ```
  ![redis set](images/nosql-redis-set.png)

- 判断单个值是否在集合中
  ```
  SISMEMBER Key Value
  ```
  ![redis set sismember](images/nosql-redis-set-sismember.png)

## Hash
    Redis hash 是一个string类型的field和value的映射表，hash特别适合用于存储对象。

> Redis 中每个 hash 可以存储 232 - 1 键值对（40多亿）。

### 使用
- 创建
  ```
  HMST key Hash
  ```
  ![redis hash hmset](images/nosql-redis-hash-hmset.png)

- 获取
  ```
  HGETALL key
  ```
  ![redis hash hgetall](images/nosql-redis-hash-hgetall.png)

- 修改
  ```
  HSET KEY VALUE
  ```
  ![redis hash hset](images/nosql-redis-hash-hset.png)

- 删除
  ```
  HDEL key field
  ```
  ![redis hash hdel](images/nosql-redis-hash-hdel.png)
- `Hsetnx`: 哈希表中不存在的的字段赋值 。