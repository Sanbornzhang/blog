---
title: 使用zsh提高工作效率
date: 2019/2/25
categories: 
- 杂项
- zsh
tags: 
  - 杂项
  - zsh
---
# install 
[ZSH Github](https://github.com/robbyrussell/oh-my-zsh)
1. 安装zsh  
   `apt-get install zsh`
<!--more--> 
2. 通过安装脚本安装`Oh-my-zsh`

   - `wget`安装  
     ```
     wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh
     ```

   - `curl` 安装  
       ```
      sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
       ```
3. 使用zsh `zsh`
4. 改变默认`shell` 为 `zsh` `chsh -s /bin/zsh`

## 插件
### autojump
1. 安装 `autojump`  
   apt-get install autojump
2. 在`zsh`中使用  
      ```
      echo '. /usr/share/autojump/autojump.sh' >> ${ZDOTDIR:-$HOME}/.zshrc
      ```

### syntax-highlighting
1. 安装  
   ```
   git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
   ```
2. enable 插件  
   ```
   echo "source $ZSH_CUSTOM/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc
   ```

### autosuggestions
1. 安装  
  ```
  git clone git://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
  ```
2. enable 插件 
   ```
   echo 'source $ZSH_CUSTOM/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh' >> ${ZDOTDIR:-$HOME}/.zshrc
   ```

## 修改插件配置
   ```
   vi ${ZDOTDIR:-$HOME}/.zshrc
   plugins=(git zsh-autosuggestions ubuntu kubectl helm)

   ```
  
## 常用命令使用别名

```
alias nis="npm install --save "
alias svim ='sudo vim'
alias mkcd='foo(){ mkdir -p "$1"; cd "$1" }; foo '
alias install='sudo apt get install'
alias update='sudo apt-get update; sudo apt-get upgrade'
alias ..="cd .."
alias ...="cd ..; cd .."

```

## 使用`source`生效
```
source ${ZDOTDIR:-$HOME}/.zshrc
```

## REF:
[打造高效的工作环境 – SHELL 篇](https://coolshell.cn/articles/19219.html)
