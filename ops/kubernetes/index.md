---
title: Kubernetes 和 kuberctl 的简单介绍
date: 2019/2/25
categories: 
- linux
- docker
- Kubernetes
tags: 
  - linux 
  - ops
  - docker
  - Kubernetes
---
# Kubernetes 的简单介绍
Kubernetes 是 Google 开源的容器集群管理系统，是 Google 多年大规模容器管理技术 Borg 的开源版本，也是 CNCF 最重要的项目之一，主要功能包括：
- 基于容器的应用部署、维护和滚动升级;
- 负载均衡和服务发现;
- 跨机器和跨地区的集群调度;
- 自动伸缩
- 无状态和有状态服务
- 广泛的volume支持
- 插件机制保证
<!--more--> 
Kubernetes 项目最主要的设计思想是，从更宏观的角度，以统一的方式来定义任务之间的各种关系，并且为将来支持更多种类的关系留有余地。

# kuberctl 的简单的一些概念
## POD
    Pod，是 Kubernetes 项目中最小的 API 对象，一个 Pod 中包含多个 container。Pod 里面的所有容器共享的是同一个 Network Namespace，并且可以声明共享同一个 Volume

## namespace
    Namespace（命名空间）： 是kubernetes系统中的另一个重要的概念，通过将系统内部的对象“分配”到不同的Namespace中，形成逻辑上分组的不同项目、小组或用户组，便于不同的分组在共享使用整个集群的资源的同时还能被分别管理。

## Deployment
    声明 `Pod` 以及 `Replica Set`的一种方式
使用场景:
- 创建`Deployment` 生成对应的`RC`并完成`Pod`的创建过程
- 检查`Deployment`的状态查看部署动作是否完成
- 更新`Deployment`创建新的`Pod`。[升级]
- 回滚到上一个`Deployment`
- 扩展`Deployment` 应对高负载
- 查看`Deployment`状态作为发布成功的指标

## Service
    逻辑上的一组 Pod，一种可以访问它们的策略 —— 通常称为微服务。 这一组 Pod 能够被 Service 访问到，通常是通过 Label Selector（查看下面了解，为什么可能需要没有 selector 的 Service）实现的。
Service的功能
1. 服务发现： 通过 `${service name}`.`${namespace 名称}`.`svc.cluster.local` 访问对应的服务
2. 负载均衡

## HPA
    追踪分析 RC 控制的所有目标 Pod 的变化 开针对性的完成对 Pod 的横向扩容
负载的度量指标
1. metrics CPU利用率这个度量指标是一个资源度量指标（resource metric）
2. Pod度量指标
3. 对象度量指标

## 暴露服务的几种方式[服务提供对外访问]
### NodePort
    通过每个 Node 上的 IP 和静态端口（NodePort）暴露服务。NodePort 服务会路由到 ClusterIP 服务，这个 ClusterIP 服务会自动创建。通过请求 <NodeIP>:<NodePort>，可以从集群的外部访问一个 NodePort 服务。

### LoadBalancer
    使用云提供商的负载局衡器，可以向外部暴露服务。外部的负载均衡器可以路由到 NodePort 服务和 ClusterIP 服务。
### Ingress
    Ingress 是一种 Kubernetes 资源，它封装了一系列规则和配置，可将外部 HTTP(S) 流量路由到内部服务。

## 资源的限制
### limitRange
针对于`Pod|container`的资源限制
```
admin/resource/cpu-defaults.yaml 

apiVersion: v1
kind: LimitRange
metadata:
  name: cpu-limit-range
spec:
  limits:
  - default:
      cpu: 1
    defaultRequest:
      cpu: 0.5
    type: Container
```
现在如果在 `default` 命名空间创建一个容器，该容器没有声明自己的 CPU 请求和限制时，将会给它指定默认的 CPU 请求0.5和默认的 CPU 限制值1.

### resourceQuota
针对于命名空间的资源限制
   使用`ResourceQuota`需要在api-server启动的时候添加对应的插件

```
vi /etc/kubernetes/manifests/kube-apiserver.yaml

--enable-admission-plugins=NamespaceLifecycle,LimitRanger,ResourceQuota
```
一个`ResourceQuota`的例子:  

  ```
  apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: ${yourName}
    namespace: ${yourNameSpace}
  spec:
    hard:
      requests.cpu: 4
      requests.memory: 13Gi
      limits.cpu: 7
      limits.memory: 14Gi
  ```

## 日志
### 查看对应容器的日志
```
kubectl -n ${namespace} logs -f ${podName} -c ${containerName}
```

## 进入容器内部
```
kubectl -n ${namespace} exec -it  ${podName} -c ${containerName} -- sh|bash
```
## REF
[awesome](https://github.com/ramitsurana/awesome-kubernetes)  
[kubernetes Documentation](https://kubernetes.io/docs/home/)  
[Kubernetes 权威指南](https://book.douban.com/subject/26902153/)  
[深入剖析 Kubernetes](https://time.geekbang.org/column/article/39724)  