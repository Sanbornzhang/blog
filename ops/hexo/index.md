---
title: hexo 安装以及美化
date: 2019/5/6
categories: 
- hexo
tags: 
- hexo
---
# hexo 安装以及美化
## hexo + next
### hexo 配置文件
```
title: Sanborn
subtitle: 爱吃酸菜的鱼
description: '恍惚而过，不落昏沉'
#'个人技术博客: [Node.js Docker K8S Istio Mysql ELK kafka]'
keywords:
author: Sanborn
language: zh-Hans
timezone:
avatar: https://lh3.googleusercontent.com/-po30YqlBIEM/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reDu1zlBJlhwEJGqQ_2X6Otn9K16w/s64-c-mo/photo.jpg
# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: http://www.sanborn.me
root: /
permalink: :year/:month/:day/:title/
permalink_defaults:
```
<!--more--> 
#### skip_render
测试发现 *.js 并不能匹配到所有的以`.js`结尾的文件和预期不符。
但是加上文件夹以后与预期相符
```
skip_render:
  - '_posts/blog/README.md'
  - '_posts/blog/nodejs/*.js'
```

### next 配置文件
```
menu:
  home: / || home
  about: /about/ || user
  tags: /tags/ || tags
  categories: /categories/ || th
  archives: /archives/ || archive
  #schedule: /schedule/ || calendar
  #sitemap: /sitemap.xml || sitemap
  commonweal: /404.html || heartbeat
scheme: Pisces
highlight_theme: night bright

```

# plugins
## google analytics
https://analytics.google.com/analytics/web/

## 一些思路
1. 因为我的`blog`和 `hexo`的 文件夹是分开的
这样会出现一个问题就是图片无法显示,解决的方法是:
   - 在编辑的时候使用绝对路径，再再构建的时候拷贝到对应的文件夹中。但是这样会在编辑的时候没办法显示
   - 再第一种方法上添加一步，再使用`hexo g` 之前使用命令替换图片地址为绝对路径.
## REF:
[hexo的next主题个性化教程:打造炫酷网站](http://shenzekun.cn/hexo%E7%9A%84next%E4%B8%BB%E9%A2%98%E4%B8%AA%E6%80%A7%E5%8C%96%E9%85%8D%E7%BD%AE%E6%95%99%E7%A8%8B.html)  
[Hexo博客之主题美化](https://zhuanlan.zhihu.com/p/28360099)  
[Hexo搭建GitHub博客—打造炫酷的NexT主题--高级(三)](https://segmentfault.com/a/1190000016565908)