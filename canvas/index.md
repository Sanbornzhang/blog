---
title: Canvas 入门笔记
date: 2018/10/11
categories: 
- 前端
- Canvas

tags: 
- 前端
- Canvas

---
# Canvas 入门笔记
## 栅格
    在我们开始画图之前，我们需要了解一下画布栅格（canvas grid）以及坐标空间。上一页中的HTML模板中有个宽150px, 高150px的canvas元素。如右图所示，canvas元素默认被网格所覆盖。通常来说网格中的一个单元相当于canvas元素中的一像素。栅格的起点为左上角（坐标为（0,0））。所有元素的位置都相对于原点定位。所以图中蓝色方形左上角的坐标为距离左边（X轴）x像素，距离上边（Y轴）y像素（坐标为（x,y））。在课程的最后我们会平移原点到不同的坐标上，旋转网格以及缩放。现在我们还是使用原来的设置。
![Canvas_default_grid](images/Canvas_default_grid.png)
- 默认是 `150px x 150px`
- 以左上角为起始点
- 横坐标为`X`, 纵坐标为`Y`
 <!--more-->
### `fillRect` 
    绘制一个填充的矩形

```
fillRect(x, y, width, height)
```

### clearRect 
    清除指定矩形区域，让清除部分完全透明。

```
clearRect(x, y, width, height)
```

### e.g
```
  ctx.fillRect(25, 25, 100, 100);
  ctx.clearRect(45, 45, 60, 60);
  ctx.strokeRect(50, 50, 50, 50);
```

## 绘制路径
### beginPath()
    新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。

### moveTo(x, y)
    将笔触移动到指定的坐标x以及y上。

### lineTo(x, y)
    绘制一条从当前位置到指定x以及y位置的直线。

### closePath()
    闭合路径之后图形绘制命令又重新指向到上下文中。

### stroke()
    通过线条来绘制图形轮廓。
### fill()
    通过填充路径的内容区域生成实心的图形。

### arc(x, y, radius, startAngle, endAngle, anticlockwise)
    画一个以（x,y）为圆心的以radius为半径的圆弧（圆），从startAngle开始到endAngle结束，按照anticlockwise给定的方向（默认为顺时针）来生成。
>弧度=(Math.PI/180)*角度。

### arcTo(x1, y1, x2, y2, radius)
    根据给定的控制点和半径画一段圆弧，再以直线连接两个控制点。

### 二次贝塞尔曲线及三次贝塞尔曲线
- quadraticCurveTo(cp1x, cp1y, x, y)  
  绘制二次贝塞尔曲线，cp1x,cp1y为一个控制点，x,y为结束点。
- bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)  
  绘制三次贝塞尔曲线，cp1x,cp1y为控制点一，cp2x,cp2y为控制点二，x,y为结束点。

##  Colors

### fillStyle
    设置图形的填充颜色。
```
ctx.fillStyle = "orange";
ctx.fillStyle = "#FFA500";
ctx.fillStyle = "rgb(255,165,0)";
ctx.fillStyle = "rgba(255,165,0,1)";
```
### strokeStyle
    设置图形轮廓的颜色。

### Transparency

### REF
[太多了需要对应样式的时候再看: MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors)