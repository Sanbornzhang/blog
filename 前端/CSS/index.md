---
title: CSS 入门的一些知识
date: 2019/5/11
categories: 
- 前端
- CSS3
- 布局
tags: 
- 前端
- CSS3
- 布局
- 盒子模型
---

# CSS 入门的一些知识
## `em` `rem` `px` 区别
* `px`: 固定的像素，一旦设置了就无法因为适应页面大小而改变。
* `em`: 只是针对与父级元素的大小
* `rem`: 针对根元素的大小
>     em和rem相对于px具有灵活性，他们是相对长度单位，更适用于响应式布局。

## 盒子模型
![box-model](images/box-model-standard-small.png)
* `width` `和height` 设置了内容框的宽/高
* `padding` 家族属性设置内边距的宽度(别忘了普通属性比如 `padding-bottom` ，一次设置一个边).
* `border` 家族属性设置边界的宽度、样式和颜色(许多可用的普通边界属性还有很多)。
  
* `margin` 家族属性设置包围CSS盒子外部区域的宽度，这个属性推开布局中其他的CSS盒子（也有许多可用的普通属性比如 `margin-bottom `）。
<!--more-->
## 常用的属性
### border
1. `border`: [`border-width` ||`border-style` ||`border-color` |`inherit`] 
     - `border-width`: 除了可以设置指定宽度值之外还有3个参数:
       1. `thin`:   细边线
       2. `medium`: 中等边线
       3. `thick`:  宽边线
     - `border-style`:  描述边框样式
       1. `none`:  和关键字 hidden 类似，不显示边框。在这种情况下，如果没有设定背景图片，border-width 计算后的值将是 0，即使先前已经指定过它的值。在单元格边框重叠情况下，none 值优先级最低，意味着如果存在其他的重叠边框，则会显示为那个边框。
       2. `hidden`: 和关键字 none 类似，不显示边框。在这种情况下，如果没有设定背景图片，border-width 计算后的值将是 0，即使先前已经指定过它的值。在单元格边框重叠情况下，hidden 值优先级最高，意味着如果存在其他的重叠边框，边框不会显示。
       3. `dotted`: 显示为一系列圆点。标准中没有定义两点之间的间隔大小，视不同实现而定。圆点半径是 border-width 计算值的一半。
       4. `dashed`: 显示为一系列短的方形虚线。标准中没有定义线段的长度和大小，视不同实现而定。
       5. `solid`: 显示为一条实线。
       6. `double`: 显示为一条双实线，宽度是 border-width 。
       7. `groove`: 显示为有雕刻效果的边框，样式与 ridge 相反。
       8. `ridge`: 显示为有浮雕效果的边框，样式与 groove 相反。
       9. `inset`: 显示为有陷入效果的边框，样式与 outset 相反。当它指定到 border-collapse 为 collapsed 的单元格时，会显示为 groove 的样式
       10. `outset`: 显示为有突出效果的边框，样式与 inset 相反。当它指定到 border-collapse 为 collapsed 的单元格时，会显示为 ridge 的样式。
   
     - `border-color`: 可以确定border的颜色。如果这个值没有设置，它的默认值是元素的color属性值[也可以分别设置4个边框的颜色]
  
     - `border-image`: 允许在元素的边框上绘制图像 [ `border-image-source` || `border-image-slice`] [ `border-image-width` | `border-image-width` ? /`border-image-outset` ] || `border-image-repeat`
  
     - `border-image-source`: 元素的边框图片（border-image）的资源 
       * `none`:
       * `url`:
       * `linear-gradient`:
       * `inherit`:
       * `initial`:
       * `unset`:
     - `border-image-repeat`: 定义图片如何填充边框。
       * `stretch`  
        拉伸图片以填充边框。
       * `repeat`  
        平铺图片以填充边框。
       * `round`  
        平铺图像。当不能整数次平铺时，根据情况放大或缩小图像。
       * `space`  
        平铺图像 。当不能整数次平铺时，会用空白间隙填充在图像周围（不会放大或缩小图像）
       * `inherit`  
        继承父级元素的计算值。

2. `border-radius`: 设置边框圆角
### `background`
1. `background-attachment`: 背景图像的位置是在当前固定，还是随着滚动。
   * `fixed`  
     此关键字表示背景相对于视口固定。即使一个元素拥有滚动机制，背景也不会随着元素的内容滚动。
   * `local`  
     此关键字表示背景相对于元素的内容固定。如果一个元素拥有滚动机制，背景将会随着元素的内容滚动， 并且背景的绘制区域和定位区域是相对于可滚动的区域而不是包含他们的边框。
   * `scroll`  
     此关键字表示背景相对于元素本身固定， 而不是随着它的内容滚动（对元素边框是有效的）。

2. `background-clip`: 设置元素的背景（背景图片或颜色）是否延伸到边框下面。
   * `border-box `  
     背景延伸至边框外沿（但是在边框下层）。
   * `padding-box`  
     背景延伸至内边距（padding）外沿。不会绘制到边框处。
   * `content-box  `  
     背景被裁剪至内容区（content box）外沿。
   * `text`  
     背景被裁剪成文字的前景色。

### `linear-gradient()` 渐变函数
ref: 
1. [linear-gradient](https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient)
2. [CSS Gradients](https://www.w3schools.com/css/css3_gradients.asp)
3. [css gradient 详解](http://www.alloyteam.com/2016/03/css-gradient/)
### `-webkit-background-clip` 设置文字的
```
background-clip: text;
-webkit-background-clip: text;
color: transparent;
```
ref:[background-clip](https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip)
### `animation` 动画
- `animation-name`:   
  设置一个或多个动画应用到的元素。每个名称都是一个规则，用于设置动画序列的属性值; 自定义动画需要使用[keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes)
- `animation-duration`:  
  定义动画周期时常
- `animation-play-state`:  
  sets whether an animation is running or paused.
- `animation-iteration-count`:  
  设置循环次数
- `animation-timing-function`:  
    设置动画的进展如何通过每个周期的持续时间。
  * ease  
    等于cubic-bezier(0.25, 0.1, 0.25, 1.0)，默认值，向动画中间的速度增加，在结束时减慢。
  * linear  
    等于cubic-bezier(0.0, 0.0, 1.0, 1.0)，以均匀的速度动画。
  * ease-in  
    等于cubic-bezier(0.42, 0, 1.0, 1.0)，慢慢开始，随着动画属性转换的速度增加直到完成。
  * ease-out  
    等于cubic-bezier(0, 0, 0.58, 1.0)，快速启动，继续减慢动画速度。•
  * ease-in-out  
    等于cubic-bezier(0.42, 0, 0.58, 1.0)，动画属性慢慢过渡，加速，然后再次放慢速度。
  * cubic-bezier(p1, p2, p3, p4)  
    作者定义了三次贝塞尔曲线，其中p1和p3值必须在0到1的范围内。
  * steps(n, <jumpterm>)  
    沿着过渡沿n个停止显示动画迭代，显示每个停止相等的时间长度。例如，如果n为5，则有5个步骤。动画是暂时保持在0％，20％，40％，60％和80％，在20％，40％，60％，80％和100％，或在0％和100％之间进行5次停止动画，或5次停止，包括0％和100％标记（0％，25％，50％，75％和100％）取决于使用以下哪个跳转术语：
  * jump-start  
    表示左连续函数，以便在动画开始时发生第一次跳转;
  * jump-end  
    表示右连续函数，以便在动画结束时发生最后一次跳转;
  * jump-none  
    两端都没有跳跃。相反，保持0％标记和100％标记，每个标记持续1 / n。
  * jump-both  
    包括0％和100％标记的暂停，在动画迭代期间有效地添加一个步骤。
  * start  
    与...一样 jump-start.
  * end  
    与...一样 jump-end.
  * step-start  
    等于 steps(1, jump-start)
  * step-end  
    等于 steps(1, jump-end)