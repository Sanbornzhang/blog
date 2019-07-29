---
title:  `Linux` 下`fail2ban` 配置 
date: 2016/2/16
categories: 
- linux
- ops
- fail2ban
tags: 
- linux
- ops
- fail2ban
---
# `Linux` 下`fail2ban` 配置 
    其实我的理解是 fail2ban 就是扫描防日志，查看匹配失败的结果。到达限制阈值之后，扔进防火墙黑名单。
  具体配置可以 `Google` 
## fail2ban configure
```
[login-limit]                      -> name of jail
enabled   = true                   -> enable
port      = http,https             -> prot most of port shuld http or https
maxretry  = 3                      | 
bantime   = 3600                    -> if in 10s time try 3 will be deny 3600s
findtime  = 10                     |
banaction = API-POST-passwd-limit  -> ban action on /etc/fail2ban/action.d/  folder. there is /etc/fail2ban/action.d/API-POST-passwd-limit.conf
filter    = API-POST-passwd-limit  -> filter on /etc/fail2ban/filter.d/ folder. there is /etc/fail2ban/filter.d/API-POST-passwd-limit.conf
logpath   = /var/log/nginx/API-access.log -> fail2ban  is scanning log files to ban IP. so there is log file path 

```
<!--more-->
## banaction file configure
```
[Definition]
actionstart =
actionstop  =
actioncheck =
actionban   = ufw insert 1 deny to any port 8001 from <ip> -> ufw common
actionunban = ufw delete deny to any port 8001 from <ip>   -> ufw common
```

## filter configure
```
[Definition]
failregex   = <HOST>.*login.* -> regex
ignoreregex =
```
confirm  regex can use `fail2ban-regex`
## fail2ban-regex
```
Usage: /usr/bin/fail2ban-regex [OPTIONS] <LOG> <REGEX> [IGNOREREGEX]

Fail2Ban  reads log file that contains password failure report
and bans the corresponding IP addresses using firewall rules.

This tools can test regular expressions for "fail2ban".


LOG:
    string                  a string representing a log line
    filename                path to a log file (/var/log/auth.log)

REGEX:
    string                  a string representing a 'failregex'
    filename                path to a filter file (filter.d/sshd.conf)

IGNOREREGEX:
    string                  a string representing an 'ignoreregex'
    filename                path to a filter file (filter.d/sshd.conf)

Copyright (c) 2004-2008 Cyril Jaquier, 2008- Fail2Ban Contributors
Copyright of modifications held by their respective authors.
Licensed under the GNU General Public License v2 (GPL).

Written by Cyril Jaquier <cyril.jaquier@fail2ban.org>.
Many contributions by Yaroslav O. Halchenko and Steven Hiscocks.

Report bugs to https://github.com/fail2ban/fail2ban/issues


Options:
  --version             show program's version number and exit
  -h, --help            show this help message and exit
  -l LOG_LEVEL, --log-level=LOG_LEVEL
                        Log level for the Fail2Ban logger to use
  -v, --verbose         Be verbose in output
  -D, --debuggex        Produce debuggex.com urls for debugging there
  --print-all-missed    Either to print all missed lines
  --print-all-ignored   Either to print all ignored lines
  -t, --log-traceback   Enrich log-messages with compressed tracebacks
  --full-traceback      Either to make the tracebacks full, not compressed (as
                        by default)

```
### 测试文件是否匹配
fail2ban-regex [logFileAddress or string] [string for regx or filter file]

```
 fail2ban-regex /var/log/nginx/API-access.log "<HOST>.*login.*"

Running tests
=============

Use   failregex line : <HOST>.*login.*
Use         log file : /var/log/nginx/API-access.log


Results
=======

Failregex: 297 total
|-  #) [# of hits] regular expression
|   1) [297] <HOST>.*login.*
`-

Ignoreregex: 0 total

Date template hits:
|- [# of hits] date format
|  [5606] Day/MONTH/Year:Hour:Minute:Second
`-

Lines: 5606 lines, 0 ignored, 297 matched, 5309 missed


fail2ban-regex /var/log/nginx/API-access.log /etc/fail2ban/filter.d/API-POST-passwd-limit.conf

Running tests
=============

Use   failregex file : /etc/fail2ban/filter.d/API-POST-passwd-limit.conf
Use         log file : /var/log/nginx/API-access.log


Results
=======

Failregex: 297 total
|-  #) [# of hits] regular expression
|   1) [297] <HOST>.*login.*
`-

Ignoreregex: 0 total

Date template hits:
|- [# of hits] date format
|  [5606] Day/MONTH/Year:Hour:Minute:Second
`-

Lines: 5606 lines, 0 ignored, 297 matched, 5309 missed
Missed line(s):: too many to print.  Use --print-all-missed to print all 5309 lines

```

## fail2ban-client
```
Usage: /usr/bin/fail2ban-client [OPTIONS] <COMMAND>

Fail2Ban v0.8.11 reads log file that contains password failure report
and bans the corresponding IP addresses using firewall rules.

Options:
    -c <DIR>                configuration directory
    -s <FILE>               socket path
    -p <FILE>               pidfile path
    -d                      dump configuration. For debugging
    -i                      interactive mode
    -v                      increase verbosity
    -q                      decrease verbosity
    -x                      force execution of the server (remove socket file)
    -h, --help              display this help message
    -V, --version           print the version

Command:
                                             BASIC
    start                                    starts the server and the jails
    reload                                   reloads the configuration
    reload <JAIL>                            reloads the jail <JAIL>
    stop                                     stops all jails and terminate the
                                             server
    status                                   gets the current status of the
                                             server
    ping                                     tests if the server is alive
    help                                     return this output

                                             LOGGING
    set loglevel <LEVEL>                     sets logging level to <LEVEL>. 0
                                             is minimal, 4 is debug
    get loglevel                             gets the logging level
    set logtarget <TARGET>                   sets logging target to <TARGET>.
                                             Can be STDOUT, STDERR, SYSLOG or a
                                             file
    get logtarget                            gets logging target

                                             JAIL CONTROL
    add <JAIL> <BACKEND>                     creates <JAIL> using <BACKEND>
    start <JAIL>                             starts the jail <JAIL>
    stop <JAIL>                              stops the jail <JAIL>. The jail is
                                             removed
    status <JAIL>                            gets the current status of <JAIL>

                                             JAIL CONFIGURATION
    set <JAIL> idle on|off                   sets the idle state of <JAIL>
    set <JAIL> addignoreip <IP>              adds <IP> to the ignore list of
                                             <JAIL>
    set <JAIL> delignoreip <IP>              removes <IP> from the ignore list
                                             of <JAIL>
    set <JAIL> addlogpath <FILE>             adds <FILE> to the monitoring list
                                             of <JAIL>
    set <JAIL> dellogpath <FILE>             removes <FILE> from the monitoring
                                             list of <JAIL>
    set <JAIL> addfailregex <REGEX>          adds the regular expression
                                             <REGEX> which must match failures
                                             for <JAIL>
    set <JAIL> delfailregex <INDEX>          removes the regular expression at
                                             <INDEX> for failregex
    set <JAIL> addignoreregex <REGEX>        adds the regular expression
                                             <REGEX> which should match pattern
                                             to exclude for <JAIL>
    set <JAIL> delignoreregex <INDEX>        removes the regular expression at
                                             <INDEX> for ignoreregex
    set <JAIL> findtime <TIME>               sets the number of seconds <TIME>
                                             for which the filter will look
                                             back for <JAIL>
    set <JAIL> bantime <TIME>                sets the number of seconds <TIME>
                                             a host will be banned for <JAIL>
    set <JAIL> usedns <VALUE>                sets the usedns mode for <JAIL>
    set <JAIL> banip <IP>                    manually Ban <IP> for <JAIL>
    set <JAIL> unbanip <IP>                  manually Unban <IP> in <JAIL>
    set <JAIL> maxretry <RETRY>              sets the number of failures
                                             <RETRY> before banning the host
                                             for <JAIL>
    set <JAIL> addaction <ACT>               adds a new action named <NAME> for
                                             <JAIL>
    set <JAIL> delaction <ACT>               removes the action <NAME> from
                                             <JAIL>
    set <JAIL> setcinfo <ACT> <KEY> <VALUE>  sets <VALUE> for <KEY> of the
                                             action <NAME> for <JAIL>
    set <JAIL> delcinfo <ACT> <KEY>          removes <KEY> for the action
                                             <NAME> for <JAIL>
    set <JAIL> actionstart <ACT> <CMD>       sets the start command <CMD> of
                                             the action <ACT> for <JAIL>
    set <JAIL> actionstop <ACT> <CMD>        sets the stop command <CMD> of the
                                             action <ACT> for <JAIL>
    set <JAIL> actioncheck <ACT> <CMD>       sets the check command <CMD> of
                                             the action <ACT> for <JAIL>
    set <JAIL> actionban <ACT> <CMD>         sets the ban command <CMD> of the
                                             action <ACT> for <JAIL>
    set <JAIL> actionunban <ACT> <CMD>       sets the unban command <CMD> of
                                             the action <ACT> for <JAIL>

                                             JAIL INFORMATION
    get <JAIL> logpath                       gets the list of the monitored
                                             files for <JAIL>
    get <JAIL> ignoreip                      gets the list of ignored IP
                                             addresses for <JAIL>
    get <JAIL> failregex                     gets the list of regular
                                             expressions which matches the
                                             failures for <JAIL>
    get <JAIL> ignoreregex                   gets the list of regular
                                             expressions which matches patterns
                                             to ignore for <JAIL>
    get <JAIL> findtime                      gets the time for which the filter
                                             will look back for failures for
                                             <JAIL>
    get <JAIL> bantime                       gets the time a host is banned for
                                             <JAIL>
    get <JAIL> usedns                        gets the usedns setting for <JAIL>
    get <JAIL> maxretry                      gets the number of failures
                                             allowed for <JAIL>
    get <JAIL> addaction                     gets the last action which has
                                             been added for <JAIL>
    get <JAIL> actionstart <ACT>             gets the start command for the
                                             action <ACT> for <JAIL>
    get <JAIL> actionstop <ACT>              gets the stop command for the
                                             action <ACT> for <JAIL>
    get <JAIL> actioncheck <ACT>             gets the check command for the
                                             action <ACT> for <JAIL>
    get <JAIL> actionban <ACT>               gets the ban command for the
                                             action <ACT> for <JAIL>
    get <JAIL> actionunban <ACT>             gets the unban command for the
                                             action <ACT> for <JAIL>
    get <JAIL> cinfo <ACT> <KEY>             gets the value for <KEY> for the
                                             action <ACT> for <JAIL>
```

### fail2ban-client status
```
Status
|- Number of jail:      1
`- Jail list:           login-limit
show status of enable jail
```
#### fail2ban-client status login-limit
```
Status for the jail: login-limit
|- filter
|  |- File list:        /var/log/nginx/API-access.log
|  |- Currently failed: 0
|  `- Total failed:     3
`- action
   |- Currently banned: 1
   |  `- IP list:       $IP_ADDR
   `- Total banned:     1
show jail details
```
