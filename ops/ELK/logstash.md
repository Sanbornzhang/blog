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
# logstash 的使用

## Input 输入插件
### Stdin 标准输入
    Stdin 一般是用来debug，也可以在源数据中添加字段。
```
input {
    stdin {
        add_field => {"key" => "value"}
        codec => "plain"
        tags => ["add"]
        type => "std"
    }
}
```
### File 读取文件
```
input
    file {
        path => ["/var/log/*.log", "/var/log/message"]
        type => "system"
        start_position => "beginning"
    }
}
```
### TCP 读取网络数据[常用]

```
input {
    tcp {
        port => 8888
        mode => "server"
        ssl_enable => false
    }
}
```

## Output 输出插件
### Stdout 标准输出
    重要和常见的用途就是调试。所以在不太有效的时候，加上命令行参数 -vv 运行，查看更多详细调试信息。
```
output {
    stdout {
        codec => rubydebug
        workers => 2
    }
}
```
### 保存进 Elasticsearch

```
output {
    elasticsearch {
        host => "192.168.0.2"
        protocol => "http"
        index => "logstash-%{type}-%{+YYYY.MM.dd}"
        index_type => "%{type}"
        workers => 5
        template_overwrite => true
    }
}
```

### TCP 发送网络数据
```
output {
    tcp {
        host  => "192.168.0.2"
        port  => 8888
        codec => json_lines
    }
}
```
### Exec 调用命令执行
```
output {
    exec {
        command => "sendsms.pl \"%{message}\" -t %{user}"
    }
}
```
## filter
### `Grok`
    Grok 是 Logstash 最重要的插件。你可以在 grok 里预定义好命名正则表达式，在稍后(grok参数或者其他正则表达式里)引用它。
#### 使用：
1. 在`pattern_definitions` 中定义你所想拆分的正则表达式
2. 在`match`中使用：   
   grok 表达式的打印复制格式的完整语法是下面这样的：
   ```
   %{PATTERN_NAME:capture_name:data_type}
   ```

一个例子:
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

#### 缺点
`grok` 在性能和资源损耗方面被广为诟病  
但是如果使用良好的`正则表达式`对性能的影响实际上也没有那么大.  
关于`grok 性能`可以看一下: 
[do-you-grok-grok](https://www.elastic.co/blog/do-you-grok-grok)  
   
在`某些`场景下可以用 `dissect` 替代: [Logstash Dude, where's my chainsaw? I need to dissect my logs](https://www.elastic.co/blog/logstash-dude-wheres-my-chainsaw-i-need-to-dissect-my-logs)  

### dissect
    Dissect过滤器是一种拆分操作。与常规拆分不同，此操​​作将一组分隔符应用于字符串值。Dissect不使用正则表达式，速度非常快。

#### 例子：
```
  filter {
    dissect {
      mapping => {
        "message" => "%{ts} %{+ts} %{+ts} %{src} %{} %{prog}[%{pid}]: %{msg}"
      }
    }
  }
```

### Date 
    `date` 插件可以用来转换你的日志记录中的时间字符串，变成 LogStash::Timestamp 对象，然后转存到 @timestamp 字段里。

#### date五种时间格式：
1. ISO8601
2. UNIX
3. UNIX_MS
4. TAI64N
5. Joda-Time 库

#### 例子
```
filter {
    grok {
        match => ["message", "%{HTTPDATE:logdate}"]
    }
    date {
        match => ["logdate", "dd/MMM/yyyy:HH:mm:ss Z"]
    }
}
```

### JSON
    我们可以通过在input的时候直接使用 `codec => "json"`作为 JSON 编码。我们也可以单独启用 JSON 解码插件

#### 例子
```
filter {
    json {
        source => "message"
        target => "jsoncontent"
    }
}
```

>如果不打算使用多层结构的话，可以直接删掉 `target`

### Mutate 数据修改
    mutate 插件是 Logstash 另一个重要插件。它提供了丰富的基础类型数据处理能力。包括类型转换，字符串处理和字段处理等。
#### 类型转换

```
filter {
    mutate {
        convert => ["request_time", "float"]
    }
}
```
#### 字符串处理
1. gsub 仅对字符串类型字段有效
     ```
     gsub => ["urlparams", "[\\?#]", "_"]
     ```

2. split
   ```
   filter {
       mutate {
           split => ["message", "|"]
       }
   }
   ```

3. join 对数组类型字段有效
   ```
   filter {
    mutate {
        split => ["message", "|"]
    }
    mutate {
        join => ["message", ","]
    }
   }
   ```

4. merge 合并两个数组或者哈希字段。依然在之前 split 的基础上继续：
   ```
   filter {
       mutate {
           split => ["message", "|"]
       }
       mutate {
           merge => ["message", "message"]
       }
   ```

#### 字段处理
- rename: 重命名某个字段，如果目的字段已经存在，会被覆盖掉：
  ```
  filter {
      mutate {
          rename => ["syslog_host", "host"]
      }
  }
  ```
- update: 更新某个字段的内容。如果字段不存在，不会新建。

- replace: 作用和 update 类似，但是当字段不存在的时候，它会起到 add_field 参数一样的效果，自动添加新的字段。

### GeoIP 地址查询归类
    GeoIP 是最常见的免费 IP 地址归类查询库，同时也有收费版可以采购。GeoIP 库可以根据 IP 地址提供对应的地域信息，包括国别，省市，经纬度等，对于可视化地图和区域统计非常有用。

#### 例子：
  ```
  filter {
      geoip {
          source => "message"
      }
  }
  ```

## 总结
只是简单的介绍了 `Logstash` 配置文件的使用，具体的可以参考 REF 的内容。

## REF
[Logstash Reference](https://www.elastic.co/guide/en/logstash/current/index.html)
[Logstash 最佳实践](https://doc.yonyoucloud.com/doc/logstash-best-practice-cn/index.html)


