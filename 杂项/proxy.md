---
title: 在 linux 或者 Windows 中使用代理
date: 2018/7/16
categories: Proxy
tags: 
  - Proxy 
  - ops
  - Windows
---
## Shadowsocks
### server side install
```
sudo apt-get install software-properties-common -y
sudo add-apt-repository ppa:max-c-lv/shadowsocks-libev -y
sudo apt-get update
sudo apt install -y shadowsocks-libev
echo '{
    "server":"0.0.0.0",
    "server_port":${yourPort},
    "local_port":1080,
    "password":"${yourPass}",
    "timeout":60,
    "method":"aes-256-cfb"
}

'>/etc/shadowsocks-libev/config.json
service shadowsocks-libev restart
```
<!--more--> 
### client
- linux 
```
ss-local -s 服务器地址 -p 服务器端口 -l 本地端端口 -k 密码 -m 加密方法
```
- Windows
```
使用对应的代理软件
```
### 全局代理
- windos  
 使用 Proxifier  
 更多参考: [Proxifier+Shadowshocks系统全局代理的正确姿势](http://blackwolfsec.cc/2016/09/19/Proxifier_Shadowshocks/)
## Linux 使用代理
1. 能使用`socks5`代理的的可以直接使用
   
   ```
   alias setproxy="export ALL_PROXY=socks5://127.0.0.1:1080"
   alias unsetproxy="unset ALL_PROXY"
   alias myip="curl https://ipinfo.io/ip"
   ```
2. 转换为`HTTP`代理
   - 安装  `polipo`
     ```
     sudo apt-get update
     sudo apt-get install polipo
     ```
   - 修改配置文件:  ` vi /etc/polipo/config`
     ```
     logSyslog = true
     logFile = /var/log/polipo/polipo.log
     proxyAddress = "0.0.0.0"
     proxyPort = 8123
     socksParentProxy = "127.0.0.1:1080"
     socksProxyType = socks5
     ```
   - restart polipo  
       ` /etc/init.d/polipo restart`
   - 连接测试  
     `curl -x 127.0.0.1:8123  ip.gs `
### ubuntu apt 使用代理
1. 修改` /etc/apt/apt.conf`文件 如果没有直接**新建**
   ```
   vi /etc/apt/apt.conf
   ```
2. 添加配置信息
   ```
   Acquire::http::Proxy "http://127.0.0.1:8123";
   ```
### Docker 使用代理
1. 修改 `service` 文件 `/lib/systemd/system/docker.service`
2. 在`[Service]`中添加`HTTP`代理
   ```
   Environment=HTTP_PROXY=http://127.0.0.1:8123/
   Environment=HTTPS_PROXY=http://127.0.0.1:8123/
   Environment=NO_PROXY=localhost,127.0.0.1
   ```