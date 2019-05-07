---
title: Docker Trouble Shooting
date: 2018/7/16
categories: 
- linux
- docker
tags: 
  - linux 
  - ops
  - docker
---
# Docker Trouble Shooting [container]
## 查看构建时候的输出
有些时候`container`无法运行可能与此相关
## docker logs
通过使用 `docker logs -f ${containerName} ` 查看容器输出的日志
## docker exec
通过`docker exec -it ${containerName} sh|bash|/bin/bash|/bin/sh` 进入容器,然后查看相应的类容.
<!--more-->