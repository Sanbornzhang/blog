---
title: Kubernetes Pod 介绍
date: 2019/2/25
categories: 
- linux
- docker
- Kubernetes
- pod
tags: 
  - linux 
  - ops
  - docker
  - Kubernetes
  - pod
---
# POD
    Pod，是 Kubernetes 项目中最小的 API 对象，一个 Pod 中包含多个 container。Pod 里面的所有容器共享的是同一个 Network Namespace，并且可以声明共享同一个 Volume
对于`Pod`里面的容器来说:
1. 他们可以直接使用 `Localhost` 来进行通信;
2. 他们看到的网络设备完全相同
3. 一个`Pod`只有一个IP地址
4. Pod的生命周期和 `Infra`一致, `Infra`是`Pod`实现的一个中间容器。

## `POD`的一些 API
### NodeSelector
将 Pod 与 Node 绑定的字段
```
nodeSelector:
    disktype: ssd
```
REF: [分配 Pod 到 Node 上](https://k8smeetup.github.io/docs/concepts/configuration/assign-pod-node/)

### NodeName
一旦 Pod 的这个字段被赋值，Kubernetes 就会认为这个`Pod`以及经过了调度。

### HostAliases：定义了 Pod 的 hosts 文件的内容
```
apiVersion: v1
kind: Pod
spec:
  hostAliases:
  - ip: "10.1.2.3"
    hostnames:
    - "foo.remote"
    - "bar.remote"
```
进入容器内:
```
cat /etc/hosts
# Kubernetes-managed hosts file.
127.0.0.1 localhost
...
10.244.135.10 hostaliases-pod
10.1.2.3 foo.remote
10.1.2.3 bar.remote
```

### ImagePullPolicy
容器镜像的拉取策略
- IfNotPresent：如果本地存在镜像就优先使用本地镜像。
- Never：直接不再去拉取镜像了，使用本地的；如果本地不存在就报异常了。
- Always： 总是拉取

### Lifecycle
当容器发生变化时候的Hook,在怎么优雅的停止容器会使用到。[线上升级]  
[优雅的停止pod](https://mp.weixin.qq.com/s/NwJbBLhomaHBhCkIDR1KWA)

### volumes
```
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: gcr.io/google_containers/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir: {}
```
更多:  [kubernetes volumes](https://kubernetes.io/docs/concepts/storage/volumes/)

## 容器探针[容器健康检查]

### 什么时候使用
- 如果容器中的进程能够在遇到问题或不健康的情况下自行崩溃，则不一定需要存活探针; kubelet 将根据 `Pod` 的`restartPolicy` 自动执行正确的操作。

- 如果您希望容器在探测失败时被杀死并重新启动，那么请指定一个存活探针，并指定`restartPolicy` 为 `Always` 或 `OnFailure`。

- 如果要仅在探测成功时才开始向 Pod 发送流量，请指定就绪探针。在这种情况下，就绪探针可能与存活探针相同，但是 spec 中的就绪探针的存在意味着 Pod 将在没有接收到任何流量的情况下启动，并且只有在探针探测成功后才开始接收流量。

- 如果您希望容器能够自行维护，您可以指定一个就绪探针，该探针检查与存活探针不同的端点。

- 如果您只想在 Pod 被删除时能够排除请求，则不一定需要使用就绪探针；在删除 Pod 时，Pod 会自动将自身置于未完成状态，无论就绪探针是否存在。当等待 Pod 中的容器停止时，Pod 仍处于未完成状态。

### 探针
    探针 是由 kubelet 对容器执行的定期诊断。要执行诊断，kubelet 调用由容器实现的 Handler。有三种类型的处理程序：

- ExecAction：在容器内执行指定命令。如果命令退出时返回码为 0 则认为诊断成功。
- TCPSocketAction：对指定端口上的容器的 IP 地址进行 TCP 检查。如果端口打开，则诊断被认为是成功的。
- HTTPGetAction：对指定的端口和路径上的容器的 IP 地址执行 HTTP Get 请求。如果响应的状态码大于等于200 且小于 400，则诊断被认为是成功的。

每次探测都将获得以下三种结果之一：

- 成功：容器通过了诊断。
- 失败：容器未通过诊断。
- 未知：诊断失败，因此不会采取任何行动。

### restartPolicy
`restartPolicy`的值为:
1. Always： 只要退出就重启 [默认]
2. OnFailure：失败退出（exit code不等于0）时重启
3. OnFailure： 只要退出就不再重启
### readinessProbe
    指示容器是否准备好服务请求。如果就绪探测失败，端点控制器将从与 Pod 匹配的所有 Service 的端点中删除该 Pod 的 IP 地址。初始延迟之前的就绪状态默认为 Failure。如果容器不提供就绪探针，则默认状态为 Succes
```
tcpSocket: # 类型
  port: 80 # 监听端口
initialDelaySeconds: 180 # 容器启动 180S 后会发送第一个 readiness probe
periodSeconds: 10 #将每隔10秒钟执行一次该检查

```

### livenessProbe
    指示容器是否正在运行。如果存活探测失败，则 kubelet 会杀死容器，并且容器将受到其 重启策略 的影响。如果容器不提供存活探针，则默认状态为 Success。
```
tcpSocket:
  port: 80
initialDelaySeconds: 60  #容器启动成功 60S 后会发送第一个 readiness probe
periodSeconds: 60 #将每隔60秒钟执行一次该检查
```
### Configure Probes
#### Probe 
通过`Probe`可以配置 `liveness` 和 `readiness` 检查：

- initialDelaySeconds：容器启动后第一次执行探测是需要等待多少秒。
- periodSeconds：执行探测的频率。默认是10秒，最小1秒。
- timeoutSeconds：探测超时时间。默认1秒，最小1秒。
- successThreshold：探测失败后，最少连续探测成功多少次才被认定为成功。默认是 1。对于 liveness 必须是 1。最小值是 1。
- failureThreshold：探测成功后，最少连续探测失败多少次才被认定为失败。默认是 3。最小值是 1。

#### HTTP probe 
`HTTP probe `中可以给 httpGet设置其他配置项：

- host：连接的主机名，默认连接到 pod 的 IP。
- scheme：连接使用的 schema，默认HTTP。
- path: 访问的HTTP server 的 path。
- httpHeaders：自定义请求的 header。HTTP运行重复的 header。
- port：访问的容器的端口名字或者端口号。端口号必须介于 1 和 65525 之间。  
  
对指定的端口和路径上的容器的 IP 地址执行 HTTP Get 请求。如果响应的状态码大于等于200 且小于 400，则诊断被认为是成功的