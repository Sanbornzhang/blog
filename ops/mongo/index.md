---
title: mongoDB双副本集安装
date: 2017/12/19
categories: 
- ops
- linux
- mongoDB
- 集群
tags: 
- ops
- linux
- mongoDB
- 集群
---

# mongodb install(ubuntu 14.04)
在ubuntu中安装mongodb
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.com/apt/ubuntu trusty/mongodb-enterprise/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-enterprise.list
sudo apt-get update
sudo apt-get install -y mongodb-enterprise
```
<!--more-->
# mongodb Auth
## 查看MongoDB配置文件
  `vi /etc/mongod.conf `

## systemLog
### systemLog.verbosity
* 0 is the MongoDB’s default log verbosity level, to include Informational messages.
* 1 to 5 increases the verbosity level to include Debug messages.

### systemLog.component.accessControl.verbosity
    The log message verbosity level for components related to access control.
* 0 is the MongoDB’s default log verbosity level, to include Informational messages.
* 1 to 5 increases the verbosity level to include Debug messages.

### systemLog.component.command.verbosity
    The log message verbosity level for components related to commands.
* 0 is the MongoDB’s default log verbosity level, to include Informational messages.
* 1 to 5 increases the verbosity level to include Debug messages.

### systemLog.component.control.verbosity
    The log message verbosity level for components related to control operations.
* 0 is the MongoDB’s default log verbosity level, to include Informational messages.
* 1 to 5 increases the verbosity level to include Debug messages.

### systemLog.component.ftdc.verbosity
    The log message verbosity level for components related to diagnostic data collection operations.
* 0 is the MongoDB’s default log verbosity level, to include Informational messages.
* 1 to 5 increases the verbosity level to include Debug messages.

### systemLog.component.geo.verbosity
    The log message verbosity level for components related to geospatial parsing operations.
* 0 is the MongoDB’s default log verbosity level, to include Informational messages.
* 1 to 5 increases the verbosity level to include Debug messages.

### systemLog.component.index.verbosity
    The log message verbosity level for components related to indexing operations.
* 0 is the MongoDB’s default log verbosity level, to include Informational messages.
* 1 to 5 increases the verbosity level to include Debug messages.

### systemLog.component.network.verbosity
    The log message verbosity level for components related to networking operations
* 0 is the MongoDB’s default log verbosity level, to include Informational messages.
* 1 to 5 increases the verbosity level to include Debug messages

### systemLog.component.query.verbosity
    The log message verbosity level for components related to query operations.
* 0 is the MongoDB’s default log verbosity level, to include Informational messages.
* 1 to 5 increases the verbosity level to include Debug messages
### systemLog.component.replication.verbosity
    The log message verbosity level for components related to replication.
* 0 is the MongoDB’s default log verbosity level, to include Informational messages.
* 1 to 5 increases the verbosity level to include Debug messages

### systemLog.component.sharding.verbosity
    The log message verbosity level for components related to sharding.
* 0 is the MongoDB’s default log verbosity level, to include Informational messages.
* 1 to 5 increases the verbosity level to include Debug messages

### systemLog.component.storage.verbosity
    The log message verbosity level for components related to storage.
* 0 is the MongoDB’s default log verbosity level, to include Informational messages.
* 1 to 5 increases the verbosity level to include Debug messages

### systemLog.component.storage.journal.verbosity
    The log message verbosity level for components related to journaling.
* 0 is the MongoDB’s default log verbosity level, to include Informational messages.
* 1 to 5 increases the verbosity level to include Debug messages

### systemLog.component.write.verbosity
    The log message verbosity level for components related to write operations.
* 0 is the MongoDB’s default log verbosity level, to include Informational messages.
* 1 to 5 increases the verbosity level to include Debug messages

## net Options
### net.port
`Default: 27017`

#### net.bindIp
`bindIp: 127.0.0.1 to bindIp: 127.0.0.1,10.116.79.104`

To bind to multiple IP addresses, enter a list of comma separated values.

### net.maxIncomingConnections
`Default: 65536`  
The maximum number of simultaneous connections that mongos or mongod will accept.

### net.wireObjectCheck
`Default: True`  
When true, the mongod or mongos instance validates all requests from clients upon receipt to prevent clients from inserting malformed or invalid BSON into a MongoDB database.

### net.ipv6
`Default: False`  
Removed in version 3.0.

### net.unixDomainSocket
`Default: True`  
Enable or disable listening on the UNIX domain socket. `net.unixDomainSocket.enabled` applies only to Unix-based systems.  
The mongos or mongod process always listens on the UNIX socket unless one of the following is true:
  * net.unixDomainSocket.enabled is false
  * --nounixsocket is set. The command line option takes precedence over the configuration file setting.
  * net.bindIp is not set
  * net.bindIp does not specify 127.0.0.1

### net.unixDomainSocket.pathPrefix
`Default: /tmp`  
The path for the UNIX socket. net.unixDomainSocket.pathPrefix applies only to Unix-based systems.

### net.unixDomainSocket.filePermissions
`Default: 0700`  
Sets the permission for the UNIX domain socket file.

## net.http
    Deprecated since version 3.2: HTTP interface for MongoDB

## net.ssl Options
    Changed in version 3.0: Most MongoDB distributions now include support for TLS/SSL. 
See:  
  1.  [Configure mongod and mongos for TLS/SSL](https://docs.mongodb.com/manual/tutorial/configure-ssl/)
  2.  [TLS/SSL Configuration for Clients](https://docs.mongodb.com/manual/tutorial/configure-ssl-clients/)   
   
For more information about TLS/SSL and MongoDB.

### net.ssl.mode
      Enable or disable TLS/SSL or mixed TLS/SSL used for all network connections. The argument to the net.ssl.mode setting can be one of the following:

| Value    | Description                                                                                                                   |
| -------- |:-----------------------------------------------------------------------------------------------------------------------------:|
|disabled	 | The server does not use TLS/SSL.                                                                                              |
|allowSSL	 | Connections between servers do not use TLS/SSL. For incoming connections, the server accepts both TLS/SSL and non-TLS/non-SSL.|
|preferSSL | Connections between servers use TLS/SSL. For incoming connections, the server accepts both TLS/SSL and non-TLS/non-SSL.       |
|requireSSL| The server uses and accepts only TLS/SSL encrypted connections.                                                               |

  Changed in version 3.0: Most MongoDB distributions now include support for TLS/SSL.   
See:
  1. [Configure mongod and mongos for TLS/SSL](https://docs.mongodb.com/manual/tutorial/configure-ssl/) 
  2. [TLS/SSL Configuration for Clients](https://docs.mongodb.com/manual/tutorial/configure-ssl-clients/) 

for more information about TLS/SSL and MongoDB.

### net.ssl.PEMKeyFile
     The .pem file that contains both the TLS/SSL certificate and key. Specify the file name of the .pem file using relative or absolute paths.
     You must specify net.ssl.PEMKeyFile when TLS/SSL is enabled.
     Changed in version 3.0: Most MongoDB distributions now include support for TLS/SSL.
    
1. [Configure mongod and mongos for TLS/SSL](https://docs.mongodb.com/manual/tutorial/configure-ssl/)
2. [TLS/SSL Configuration for Clients](https://docs.mongodb.com/manual/tutorial/configure-ssl-clients/)

### net.ssl.PEMKeyPassword
      The password to de-crypt the certificate-key file (i.e. PEMKeyFile).
      Use the net.ssl.PEMKeyPassword option only if the certificate-key file is encrypted.
      In all cases, the mongos or mongod will redact the password from all logging and reporting output.
### net.ssl.clusterFile
      The .pem file that contains the x.509 certificate-key file for membership authentication for the cluster or replica set.
### net.ssl.clusterPassword
      The password to de-crypt the x.509 certificate-key file specified with --sslClusterFile. Use the net.ssl.clusterPassword option only if the certificate-key file is encrypted. In all cases, the mongos or mongod will redact the password from all logging and reporting output.
### net.ssl.CAFile
      The .pem file that contains the root certificate chain from the Certificate Authority. Specify the file name of the .pem file using relative or absolute paths.

```
WARNING
If the --sslCAFile option and its target file are not specified,
x.509 client and member authentication will not function. mongod,
and mongos in sharded systems, will not be able to verify the certificates of processes connecting to it against the trusted certificate authority (CA) that issued them,
breaking the certificate chain.
As of version 2.6.4, mongod will not start with x.509 authentication enabled if the CA file is not specified.
```

### net.ssl.CRLFile
      The the .pem file that contains the Certificate Revocation List. Specify the file name of the .pem file using relative or absolute paths.

### net.ssl.allowConnectionsWithoutCertificates
      Changed in version 3.0.0: net.ssl.weakCertificateValidation became net.ssl.allowConnectionsWithoutCertificates. For compatibility, MongoDB processes continue to accept net.ssl.weakCertificateValidation, but all users should update their configuration files.

### net.ssl.allowInvalidCertificates
      Enable or disable the validation checks for TLS/SSL certificates on other servers in the cluster and allows the use of invalid certificates.

### net.ssl.allowInvalidHostnames
`Default: False`  

      When net.ssl.allowInvalidHostnames is true, MongoDB disables the validation of the hostnames in TLS/SSL certificates, allowing mongod to connect to MongoDB instances if the hostname their certificates do not match the specified hostname.

### net.ssl.disabledProtocols
      Prevents a MongoDB server running with SSL from accepting incoming connections that use a specific protocol or protocols. net.ssl.disabledProtocols recognizes the following protocols: TLS1_0, TLS1_1, and TLS1_2. Specifying an unrecognized protocol will prevent the server from starting.

### net.ssl.FIPSMode
      Enable or disable the use of the FIPS mode of the installed OpenSSL library for the mongos or mongod. Your system must have a FIPS compliant OpenSSL library to use the net.ssl.FIPSMode option.

## security Options
### security.keyFile
      The path to a key file that stores the shared secret that MongoDB instances use to authenticate to each other in a sharded cluster or replica set. keyFile implies security.authorization. See Internal Authentication for more information.

### security.clusterAuthMode
`Default: keyFile`  

      The authentication mode used for cluster authentication. If you use internal x.509 authentication, specify so here. This option can have one of the following values:

| Value       | Description                                                                                                                     |
| ----------- |:-------------------------------------------------------------------------------------------------------------------------------:|
| keyFile     | Use a keyfile for authentication. Accept only keyfiles.                                                                         |
| sendKeyFile |	For rolling upgrade purposes. Send a keyfile for authentication but can accept both keyfiles and x.509 certificates.            |
| sendX509    |	For rolling upgrade purposes. Send the x.509 certificate for authentication but can accept both keyfiles and x.509 certificates.|
| x509        |	Recommended. Send the x.509 certificate for authentication and accept only x.509 certificates.                                  |

### security.authorization
`Default: disabled`  

      Enable or disable Role-Based Access Control (RBAC) to govern each user’s access to database resources and operations.
  
Set this option to one of the following:
| Value  	 | Description                                                                                            |
| -------- |:------------------------------------------------------------------------------------------------------:|
| enabled  | A user can access only the database resources and actions for which they have been granted privileges. |
| disabled | A user can access any database and perform any action.                                                 |

### security.javascriptEnabled
`Default: True`  

      Enables or disables the server-side JavaScript execution. When disabled, you cannot use operations that perform server-side execution of JavaScript code, such as the $where query operator, mapReduce command and the db.collection.mapReduce() method, group command and the db.collection.group() method.

## Key Management Configuration Options
### security.enableEncryption
       3.2: Enables encryption for the WiredTiger storage engine. You must set to true to pass in encryption keys and configurations.

### security.encryptionCipherMode¶
`Default: AES256-CBC`  

| Mode       |	Description                                                        |
| ---------- |:-------------------------------------------------------------------:|
| AES256-CBC |	256-bit Advanced Encryption Standard in Cipher Block Chaining Mode |
| AES256-GCM |	256-bit Advanced Encryption Standard in Galois/Counter Mode        |

### security.encryptionKeyFile

      The path to the local keyfile when managing keys via process other than KMIP. Only set when managing keys via process other than KMIP. If data is already encrypted using KMIP, MongoDB will throw an error.

### security.kmip.keyIdentifier

      Unique KMIP identifier for an existing key within the KMIP server. Include to use the key associated with the identifier as the system key. You can only use the setting the first time you enable encryption for the mongod instance. Requires security.enableEncryption to be true.

### security.kmip.rotateMasterKey
      If true, rotate the master key and re-encrypt the internal keystore.

### security.kmip.serverName

      Hostname or IP address of key management solution running a KMIP server. Requires security.enableEncryption to be true.

### security.kmip.port
      Port number the KMIP server is listening on. Requires that a security.kmip.serverName be provided. Requires security.enableEncryption to be true.

### security.kmip.clientCertificateFile
      String containing the path to the client certificate used for authenticating MongoDB to the KMIP server. Requires that a security.kmip.serverName be provided.

### security.kmip.clientCertificatePassword
      The password to decrypt the client certificate (i.e. security.kmip.clientCertificateFile), used to authenticate MongoDB to the KMIP server. Use the option only if the certificate is encrypted.

### security.kmip.serverCAFile
      Path to CA File. Used for validating secure client connection to KMIP server.

## security.sasl Options
### security.sasl.hostName
      A fully qualified server domain name for the purpose of configuring SASL and Kerberos authentication. The SASL hostname overrides the hostname only for the configuration of SASL and Kerberos.
      For mongo shell and other MongoDB tools to connect to the new hostName, see the gssapiHostName option in the mongo shell and other tools.

### security.sasl.serviceName
      Registered name of the service using SASL. This option allows you to override the default Kerberos service name component of the Kerberos principal name, on a per-instance basis. If unspecified, the default value is mongodb.

### security.sasl.saslauthdSocketPath
      The path to the UNIX domain socket file for saslauthd.

## create database
```shell
use admin
```

### create user
```shell
db.createUser(
  {
    user: "yourUsername",
    pwd: "yourPassword",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
```

## restart service and testing

```shell
service mongod restart
mongo
use admin
db.auth("yourUsername","yourPassword")
```

### create DB
` use dbName`
### create db access

```shell
db.createUser(
{
    user: "dbconnecter",
    pwd: "yourPassword",
    roles: [ { role: "dbOwner", db: "estate3" } ]
  }
)

```
## mongodb Auditing
`db.grantRolesToUser("yourUsername",["root"])`

```shell
db.adminCommand( { getParameter: 1, auditAuthorizationSuccess: true } )
{ "auditAuthorizationSuccess" : true, "ok" : 1 }
```

## mongodb Replica-set 集群

Replica-set 集群至少由三个节点组成的，它为网络故障或是其他的系统故障提供冗余。有足够的分布式读操作的能力。
集群应该保持奇数个节点，这保证选举可以正常的进行。必须确保各个节点之间可以正常通讯。

在配置集群配置完成前，security字段必须注释掉，否则会提示你输入密码认证，由于之前并没有设置密码，
所以无法登录数据库执行相关命令.

### 定义副本集群名称

为集群定义一个唯一的名称，如: saasRS

在配置文件中指定：

```yaml
replication:
  oplogSizeMB: 2000          #oplog的大小M
  replSetName: saasRS        #副本集的名称
```

### 复制配置到其它两台.

**注意**: 
1. 如果有单独的投票节点，那么可以设置`storage.journal.enabled: false`，减少空间
占用，因为投票节点不参与数据存储.
2. 千万**不要**在拥有数据集的节点上设置 `journal.enabled 为 false` 。

在三台mongodb全部启动后：`mongod -f etc/mongod.conf`， 然后进入
一台的`mongo shell`,配置副本集，必须使用admin数据库：

### 配置集群信息

```js
config = { _id:"saasRS", members:[
  {_id:0,host:"yourIp:27017",priority:2},
  {_id:1,host:"yourIp:27017",priority:1},
  {_id:2,host:"yourIp:27017",priority:1},
  //{_id:2,host:"10.30.0.90:27017",arbiterOnly:true} //投票节点
  ]
}
rs.initiate(config) //初始化副本集

rs.conf() //校验副本集配置
rs.status() //检测状态

rs.add({_id:6,host:"10.81.250.83",priority:1}) //加入副本集
//在创建超级管理员
use admin
db.createUser(
  {
    user: "admin",
    pwd: "admin",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
```

### 生成keyfile

```bash
openssl rand -base64 1024 > /usr/local/mongodb/keyfile
chmod 600 /usr/local/mongodb/keyfile
```

### 启用内部安全机制
```yaml
security:
  authorization: enabled                #开启认证
  keyFile: /data/mongo/mongodb-keyfile  #副本集使用keyFile进行相互认证
```
