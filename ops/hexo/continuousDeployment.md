---
title: 通过github + jenkins 进行持续部署 hexo
date: 2019/5/6
categories: 
- ops
- linux
- jenkins
- hexo
tags: 
- ops
- linux
- jenkins
- hexo
---

# 通过`github + jenkins` 进行持续部署 `hexo`
## install jenkins
1. 安装jdk8
   ```
   sudo apt-get install openjdk-8-jdk
   ```
2. 安装`jenkins`
   ```
   wget -q -O - https://pkg.jenkins.io/debian/jenkins-ci.org.key | sudo apt-key add -
   echo deb https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list
   sudo apt-get update
   sudo apt-get install jenkins
   ```
3. 查看`jenkins`运行情况 
   ![jenkins service](./images/hexo-jenkins-service.png)
4. 使用浏览器打开 http://yourIP:8080 
5. 配置jenkins[建议安装，也可以自己选择。但是之后会使用到`Github Plugin`]
   ![jenkins plugin](images/hexo-jenkins-github-plugin.png)
## 持续部署配置
1. 在`github.settings.developers.Personal access tokens`设置 [Personal access tokens](https://github.com/settings/developers)
   ![github token](images/hexo-jenkins-github-token.png)
    **保存好**对应的`token`等会需要在`Jenkins`中使用
2. 在`Github`**对应的项目**中添加`webhook`
   ![web hook](images/hexo-jenkins-github-webhook1.png)
   ![web hook](images/hexo-jenkins-github-webhook2.png)
   需要注意的是 `Url` 地址为： `http://yourUrl/github-webhook`,  
   需要http认证就是: `http://username:password@yourUrl/github-webhook`.
3. `jenkins`配置分为两项全局配置，和项目配置
   - 全局配置：  
     需要在凭据中添加之前的`token`
    ![jenkins configure](images/hexo-jenkins-configure.png)
   - 项目配置
    ![jenkins project configure](images/hexo-jenkins-project-configure1.png)
    ![jenkins project configure](images/hexo-jenkins-project-configure2.png)
    >注意 需要确保项目的`Source Code Management.Git.Repositories.Repository URL`和之前在`GitHub`中配置`webhook`的项目一致
### 可能会遇到的问题
1. 使用了反向代理会出现 `403 error` 这个需要把`Jenkins`安全中的`CSRF`关闭，或者参考[Jenkins -> 403 No valid crumb was included in the request](https://github.com/spinnaker/spinnaker/issues/2067)

## REF:
[How To Install Jenkins on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-jenkins-on-ubuntu-16-04)