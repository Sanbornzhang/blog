---
title: logstash 的使用
date: 2018/8/20
categories: 
- linux
- ELK
- logstash
- grok
tags: 
- linux 
- ops
- ELK
- logstash
- grok
---
`gork`的定义：
```
    grok {
      pattern_definitions => {
        "MY_DATA" => "[0-9]{4}-[01]?[1-9]?-[0-3]?[0-9]?-[0-5]?[0-9]?-[0-5]?[0-9]?"
        "LOG4J_FIELD" => "\[[^\[\]]+\]"
        "ANY_DATA" => ".*"
      }
      match => { 
        "message" => "^  %{MY_DATA:Date_time} %{LOG4J_FIELD:thread} %{LOG4J_FIELD:class} %{LOG4J_FIELD:log_level} - %{ANY_DATA:log_data}"
      }
    }
```