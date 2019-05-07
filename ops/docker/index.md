---
title: docker 的简单介绍
date: 2018/7/16
categories: 
- linux
- docker
tags: 
  - linux 
  - ops
  - docker
---
## Docker 介绍
### Docker 的本质
Docker 实际上是对 Linux `namespace`,`Cgroups`,以及 `rootfs`的一种使用  
容器其实也是一种`进程`运行在宿主机中! 只是不一样的是在容器内部只能看到在当前容器内运行的进程(`namespace` 隔离),以及可以使用`Cgroups`去限制容器运行的资源,最后使用`rootfs` 做文件系统。
<!--more--> 
### 什么是容器
  容器镜像是 **轻量的**、可执行的独立软件包，包含软件运行所需的所有内容：`代码、运行时环境、系统工具、系统库和设置`。容器化软件适用于基于 Linux 和 Windows 的应用，在**任何环境中**都能够始终如一地运行。容器赋予了软件`独立性`，使其免受外在环境差异（例如，开发和预演环境的差异）的影响，从而有助于减少团队间在相同基础设施上运行不同软件时的冲突。

### 为什么需要容器化
+ 轻量
  - 在一台机器上运行的多个 Docker 容器可以共享这台机器的操作系统内核;  
  - 它们能够迅速启动，只需占用很少的计算和内存资源;  
  - 镜像是通过文件系统层进行构造的，并共享一些公共文件。这样就能尽量降低磁盘用量，并能更快地下载镜像;
  - ![docker](images/docker.jpg)
- 标准  
  Docker 容器基于开放式标准，能够在所有主流 Linux 版本、Microsoft Windows 以及包括 VM、裸机服务器和云在内的任何基础设施上运行.    
  一处构建，到处运行。
- 安全
  Docker 赋予应用的隔离性不仅限于彼此隔离，还独立于底层的基础设施。Docker 默认提供最强的隔离，因此应用出现问题，也只是单个容器的问题，而不会波及到整台机器。  
  TODO: 这三个可以单独拆开细化。
  - `Cgroups` 限制一个进程组能够使用的资源上线，包含 CPU、内存、磁盘、网络。。。
  + `NameSpace` 
    - PID
    - NetWork
    - User
    - Mount
  - `rootfs` 细化

### Why Docker?
Docker 是世界领先的软件容器平台。
- 开发人员利用 Docker 可以消除协作编码时 `"在我的机器上可正常工作"` 的问题。
- 运维人员利用 Docker 可以在隔离容器中并行运行和管理应用，获得更好的计算密度。
- 企业利用 Docker 可以构建敏捷的软件交付管道，以更快的速度、更高的安全性和可靠的信誉为 Linux 和 Windows Server 应用发布新功能。

### 对于开发人员
- 不受应用、语言或技术栈限制
- 快速构建、测试和运行复杂的多容器应用，无需再浪费时间在服务器和开发人员机器上安装和维护软件。所有依赖资源都在容器中运行，消除` "在我的机器上可正常工作" `的问题。
- Docker 内置易于配置的 `Swarm` 集群功能。在使用最小设置的模拟生产环境中测试和调试应用。

### 对于运维人员
Docker 简化了软件交付。既能顺利地开发和部署漏洞补丁与新功能，还能够实时扩展应用。
- Docker 交付速度更快
- 快速扩展: 内置编排能够扩展到数千个节点和容器。Docker 容器能够在短短数秒之内启动和停止，便于扩展应用服务，以满足客户的高峰需求，并在峰值下降时缩减规模。
- 提高 IT 效率: Docker 让客户轻松部署、识别和解决问题，降低总体 IT 运维成本。缩短部署更新的停机时间，或者迅速回滚，尽量减少中断运行情况。
- 分发和共享内容: 通过本地或云端的安全 Docker 镜像库构建、管理和分发 Docker 镜像，并在组织中自动同步镜像更新、配置更改和构建历史。
- 轻松共享应用: Docker 确保应用在任何环境中都能始终如一地工作。在 Docker 镜像中，整个技术栈和配置都是镜像的一部分，用户只需安装 Docker，无需配置主机环境。
- 保证应用安全

### 对于企业
Docker 是现代应用平台的核心，是开发人员与 IT 运维、Linux 和 Windows 之间的纽带。Docker 既适用于云，也可以在本地部署；既支持传统架构，也支持微服务架构。使用 Docker 可以构建、连接、保护和调度容器，从开发到生产全程进行管理。
- 无论是单体应用还是微服务应用，无论是 Linux 还是 Windows 应用，无论是本地部署还是云端应用，Docker 为所有应用提供了统一的框架，一个标准的容器和工作流程，确保应用安全、敏捷、可移植。
- Docker 容器通过自动化部署流程，加速微服务架构的新应用交付。可以频繁地发布新功能（必要时也可回滚），迅速地满足客户需要。
- 通过开放式接口、API 和插件，可以轻松地将 Docker 集成到现有环境，并扩展到不同的系统。开发和运维团队利用公共接口可以顺利协作，互不干扰。

### Docker的使用规则
    一个容器只运行一个进程，一旦进程退出则容器退出

### REF
[A Docker Tutorial for Beginners](https://docker-curriculum.com/) 
[Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
[酷壳 Linux namespace](https://coolshell.cn/articles/17010.html)  
[极客时间 左耳听风 容器化和自动化运维](https://time.geekbang.org/column/article/11665)    
[极客时间 深入剖析 kubernetes 白话容器基础](https://time.geekbang.org/column/116)  
[docker 打包优化](https://mp.weixin.qq.com/s/G4pX6OwI8muzRtXBxNak8Q)
[Docker 镜像生成的原理](https://mp.weixin.qq.com/s/Evcgah0Bwcr1O2yOr-G-tg)  
[dockerfile](https://docs.docker.com/engine/reference/builder/)