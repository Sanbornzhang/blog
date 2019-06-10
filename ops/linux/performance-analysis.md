---
title: Linux下性能分析工具
date: 2018/7/16
categories: 
- linux
- ops
- performance
tags: 
- linux
- ops
- performance
---
# `Linux` 下的性能分析
## uptime
    uptime - Tell how long the system has been running.

### DESCRIPTION
       uptime gives a one line display of the following information.  The cur‐
       rent time, how long the system has been running,  how  many  users  are
       currently  logged  on,  and the system load averages for the past 1, 5,
       and 15 minutes.

       This is the same information contained in the header line displayed  by
       w(1).

       System load averages is the average number of processes that are either
       in a runnable or uninterruptable state.  A process in a runnable  state
       is  either using the CPU or waiting to use the CPU.  A process in unin‐
       terruptable state is waiting for some I/O access, eg waiting for  disk.
       The  averages  are  taken over the three time intervals.  Load averages
       are not normalized for the number of CPUs in a system, so a load  aver‐
       age  of 1 means a single CPU system is loaded all the time while on a 4
       CPU system it means it was idle 75% of the time.

我们可以看出： 系统平均负载是过去1、5、15分钟值, 在之下又有解释说明 1 在 4C的机器中说明它**75%**都是处于空闲状态，那么也就是说 1C 的平均为1最佳[实际上80%就可以了]
<!--more-->
- 一台线上的实例

  ```
  grep 'CPU' /proc/cpuinfo |wc -l
  2

  uptime 
      09:38:06 up 153 days, 21:38,  2 users,  load average: 0.71, 1.00, 0.85
  ```
  > 这是一台2C的机器，我们看出这台机器基本上使用了1C的cpu 负载在50%左右

## sysstat
- `mpstat -P ALL 5   ` 
  监控所有的CPU 每隔*5S* 输出到屏幕
  ```
  Linux 4.4.0-117-generic (k8s-master)    05/31/2019      _x86_64_        (2 CPU)

  09:57:38 AM  CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
  09:57:43 AM  all    5.16    0.00    3.44    0.40    0.00    0.10    0.00    0.00    0.00   90.90
  09:57:43 AM    0    5.67    0.00    3.44    0.20    0.00    0.20    0.00    0.00    0.00   90.49
  09:57:43 AM    1    4.66    0.00    3.44    0.40    0.00    0.00    0.00    0.00    0.00   91.50

  09:57:43 AM  CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
  09:57:48 AM  all    4.78    0.00    3.39    0.40    0.00    0.20    0.00    0.00    0.00   91.24
  09:57:48 AM    0    5.20    0.00    3.00    0.40    0.00    0.00    0.00    0.00    0.00   91.40
  09:57:48 AM    1    4.18    0.00    3.78    0.60    0.00    0.20    0.00    0.00    0.00   91.24

  09:57:48 AM  CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
  09:57:53 AM  all    5.32    0.00    2.81    0.60    0.00    0.10    0.00    0.00    0.00   91.16
  09:57:53 AM    0    5.21    0.00    3.61    0.60    0.00    0.20    0.00    0.00    0.00   90.38
  09:57:53 AM    1    5.61    0.00    2.00    0.60    0.00    0.20    0.00    0.00    0.00   91.58

  09:57:53 AM  CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
  09:57:58 AM  all    6.07    0.00    3.38    0.50    0.00    0.20    0.00    0.00    0.00   89.85
  ```

- `pidstat -u 5 1 `: 间隔`5S`后输出1组数据[CPU使用指标]
  ```
  Linux 4.4.0-117-generic (k8s-master)    05/31/2019      _x86_64_        (2 CPU)

  10:00:16 AM   UID       PID    %usr %system  %guest    %CPU   CPU  Command
  10:00:21 AM     0        13    0.00    0.20    0.00    0.20     1  ksoftirqd/1
  10:00:21 AM   999      2750   17.96    0.20    0.00   18.16     0  mysqld
  10:00:21 AM     0      4928    2.20    0.80    0.00    2.99     1  kubelet
  10:00:21 AM     0      9244    1.00    0.00    0.00    1.00     0  dockerd
  10:00:21 AM   999      9513    0.00    0.20    0.00    0.20     1  redis-server
  10:00:21 AM     0     10026    0.40    0.00    0.00    0.40     1  containerd-shim
  10:00:21 AM     0     10034    0.40    0.20    0.00    0.60     1  kube-scheduler
  10:00:21 AM     0     10066    1.80    1.00    0.00    2.79     1  kube-apiserver
  10:00:21 AM     0     10148    1.20    0.60    0.00    1.80     1  etcd
  10:00:21 AM     0     10580    0.00    0.20    0.00    0.20     1  kube-proxy
  10:00:21 AM     0     10944    0.00    0.20    0.00    0.20     1  coredns
  10:00:21 AM     0     11195    0.00    0.20    0.00    0.20     1  coredns
  10:00:21 AM     0     11248    0.20    0.60    0.00    0.80     1  calico-node
  10:00:21 AM     0     11419    0.80    1.00    0.00    1.80     1  kube-controller
  10:00:21 AM     0     20587    0.20    0.20    0.00    0.40     1  containerd
  10:00:21 AM   999     24608    0.20    0.00    0.00    0.20     1  redis-server
  10:00:21 AM     0     27397    0.40    0.00    0.00    0.40     1  AliYunDun

  Average:      UID       PID    %usr %system  %guest    %CPU   CPU  Command
  Average:        0        13    0.00    0.20    0.00    0.20     -  ksoftirqd/1
  Average:      999      2750   17.96    0.20    0.00   18.16     -  mysqld
  Average:        0      4928    2.20    0.80    0.00    2.99     -  kubelet
  Average:        0      9244    1.00    0.00    0.00    1.00     -  dockerd
  Average:      999      9513    0.00    0.20    0.00    0.20     -  redis-server
  Average:        0     10026    0.40    0.00    0.00    0.40     -  containerd-shim
  Average:        0     10034    0.40    0.20    0.00    0.60     -  kube-scheduler
  Average:        0     10066    1.80    1.00    0.00    2.79     -  kube-apiserver
  Average:        0     10148    1.20    0.60    0.00    1.80     -  etcd
  Average:        0     10580    0.00    0.20    0.00    0.20     -  kube-proxy
  Average:        0     10944    0.00    0.20    0.00    0.20     -  coredns
  Average:        0     11195    0.00    0.20    0.00    0.20     -  coredns
  Average:        0     11248    0.20    0.60    0.00    0.80     -  calico-node
  Average:        0     11419    0.80    1.00    0.00    1.80     -  kube-controller
  Average:        0     20587    0.20    0.20    0.00    0.40     -  containerd
  Average:      999     24608    0.20    0.00    0.00    0.20     -  redis-server
  Average:        0     27397    0.40    0.00    0.00    0.40     -  AliYunDun
  ```
-  pidstat -w -u 5              cswch/s 自愿切换上下文   nvcswch 非自愿切换上下文                                        
   ```
   Linux 4.4.0-117-generic (k8s-master)    05/31/2019      _x86_64_        (2 CPU)

   11:42:29 AM   UID       PID    %usr %system  %guest    %CPU   CPU  Command
   11:42:34 AM   999      2750   15.80    0.20    0.00   16.00     0  mysqld
   11:42:34 AM  1001      4329    0.40    0.00    0.00    0.40     0  prometheus
   11:42:34 AM   112      4563    0.20    0.00    0.00    0.20     1  grafana-server
   11:42:34 AM     0      4928    1.80    0.60    0.00    2.40     1  kubelet
   11:42:34 AM     0      9244    1.20    0.20    0.00    1.40     0  dockerd
   11:42:34 AM   999      9513    0.20    0.60    0.00    0.80     0  redis-server
   11:42:34 AM     0     10026    0.40    0.00    0.00    0.40     0  containerd-shim
   11:42:34 AM     0     10034    0.20    0.40    0.00    0.60     0  kube-scheduler
   11:42:34 AM     0     10066    1.00    0.80    0.00    1.80     1  kube-apiserver
   11:42:34 AM     0     10148    0.40    0.40    0.00    0.80     1  etcd
   11:42:34 AM     0     10944    0.00    0.20    0.00    0.20     1  coredns
   11:42:34 AM     0     11195    0.00    0.20    0.00    0.20     1  coredns
   11:42:34 AM     0     11248    0.40    0.20    0.00    0.60     0  calico-node
   11:42:34 AM     0     11254    0.00    0.20    0.00    0.20     0  calico-node
   11:42:34 AM     0     11419    1.00    0.80    0.00    1.80     0  kube-controller
   11:42:34 AM     0     17373    0.00    0.20    0.00    0.20     1  pidstat
   11:42:34 AM     0     20587    0.00    0.20    0.00    0.20     1  containerd
   11:42:34 AM     0     27397    0.20    0.20    0.00    0.40     0  AliYunDun

   11:42:29 AM   UID       PID   cswch/s nvcswch/s  Command
   11:42:34 AM     0         1      0.20      0.00  systemd
   11:42:34 AM     0         3      6.80      0.00  ksoftirqd/0
   11:42:34 AM     0         7    106.20      0.00  rcu_sched
   11:42:34 AM     0         9      2.20      0.00  migration/0
   11:42:34 AM     0        10      0.40      0.00  watchdog/0
   11:42:34 AM     0        11      0.40      0.00  watchdog/1
   11:42:34 AM     0        12      2.00      0.00  migration/1
   11:42:34 AM     0        13     25.20      0.00  ksoftirqd/1
   11:42:34 AM     0       155      4.20      0.00  kworker/0:1H
   11:42:34 AM     0       161     15.80      0.00  kworker/1:1H
   11:42:34 AM     0       163     15.00      3.60  jbd2/vda1-8
   11:42:34 AM     0       242      0.20      0.00  systemd-udevd
   11:42:34 AM   108       749      1.00      0.00  ntpd
   11:42:34 AM  1001      4329      0.60      0.40  prometheus
   11:42:34 AM     0      8802      0.20      0.00  rpcbind
   11:42:34 AM   999      9513    257.20      0.40  redis-server
   11:42:34 AM     0     10026      0.20      0.00  containerd-shim
   11:42:34 AM     0     10034     71.00     31.40  kube-scheduler
   11:42:34 AM     0     10110      0.20      0.00  runsvdir
   11:42:34 AM     0     11248      9.80      0.60  calico-node
   ```

- vmstat
   ```
   procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
    r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
    0  0      0 135488 167788 1630900    0    0     4   119    1    1  6  3 90  1  0
    0  0      0 134924 167796 1630916    0    0     0   442 5056 11673 14  4 82  1  0
    0  0      0 135068 167804 1630940    0    0     0   218 4560 11000  5  3 91  0  0
    1  0      0 136240 167812 1630960    0    0     0   203 4394 10925  6  3 91  0  0
    0  0      0 134628 167816 1630984    0    0     0    85 4320 10626  8  3 89  0  0

  ```
- 查看系统软切换信息 `cat /proc/softirqs` 
   ```
                       CPU0       CPU1
             HI:          0          0
          TIMER: 1436812899 1411920240
         NET_TX:        448        528
         NET_RX: 1343882698 1964105257
          BLOCK:          0          0
   BLOCK_IOPOLL:          0          0
        TASKLET:       2319       2601
          SCHED: 1315915373 1298055124
        HRTIMER:          0          0
            RCU: 1522799034 1508787415
   ```
   NET_TX: 网络接收中断
   NET_RX: 网络发送中断
- 查看系统中断信息  ` cat /proc/interrupts   `
  ```
             CPU0       CPU1
    0:         19          0   IO-APIC   2-edge      timer
    1:         11        191   IO-APIC   1-edge      i8042
    4:       1009          0   IO-APIC   4-edge      serial
    6:          3          0   IO-APIC   6-edge      floppy
    8:          0          0   IO-APIC   8-edge      rtc0
    9:          0          0   IO-APIC   9-fasteoi   acpi
   11:         35          0   IO-APIC  11-fasteoi   virtio3, uhci_hcd:usb1
   12:         16        404   IO-APIC  12-edge      i8042
   14:          0          0   IO-APIC  14-edge      ata_piix
   15:          0          0   IO-APIC  15-edge      ata_piix
   24:          0          0   PCI-MSI 65536-edge      virtio1-config
   25:         32         18   PCI-MSI 65537-edge      virtio1-virtqueues
   26:          0          0   PCI-MSI 81920-edge      virtio2-config
   27:       4834  262320824   PCI-MSI 81921-edge      virtio2-req.0
   28:          1         22   PCI-MSI 49152-edge      virtio0-config
   29:        160  237500253   PCI-MSI 49153-edge      virtio0-input.0
   30:        164  201980849   PCI-MSI 49154-edge      virtio0-output.0
   31:          1  191833242   PCI-MSI 49155-edge      virtio0-input.1
   32:          1  202416880   PCI-MSI 49156-edge      virtio0-output.1
  NMI:          0          0   Non-maskable interrupts
  LOC: 1853064730 1867757275   Local timer interrupts
  SPU:          0          0   Spurious interrupts
  PMI:          0          0   Performance monitoring interrupts
  IWI:    4923006    4921126   IRQ work interrupts
  RTR:          0          0   APIC ICR read retries
  RES: 1704347415 1653338725   Rescheduling interrupts
  CAL:  468302632  252609617   Function call interrupts
  TLB:  252283278  251329281   TLB shootdowns
  ```

- `cat /proc/stat` 中的 `intr` 也包含系统中断的信息

## 小结
* 自愿上下文切换变多了，说明进程都在等待资源，有可能发生了 I/O问题
* 非自愿上下文切换变多了，说明进程都在被强制调度，也就是都在争抢 CPU，说明 CPU 的确成了瓶颈；
* 中断次数变多了，说明 CPU 被中断处理程序占用，

## CPU 优化
### 应用程序优化
1. 编译器优化
2. 算法优化
3. 异步处理 [Node.js call back]
4. 多线程替代多进程[进程上下文切换，线程上下文切换(不涉及进程地址空间)]
5. 善用缓存

### 系统优化
1. CPU绑定: 将进程绑定到一个或者多个CPU上，提高CPU缓存命中率。减少跨CPU调度带来的上下文切换问题。[taskset,sched_setaffinity]
2. CPU独占
3. 优先级调整[PRI: 优先级(越小越先), NI: nice值(为负值优先级 **值** 变小), nice指定]
4. 对进程设置资源限制
5. NUMA优化，让CPU尽可能之访问本地内存
6. 中断负载均衡
## REF
[Linux 内核中断内幕](https://www.ibm.com/developerworks/cn/linux/l-cn-linuxkernelint/index.html)  
[Nginx服务器上软中断过高问题如何解决？](https://blog.csdn.net/rainharder/article/details/73198010)