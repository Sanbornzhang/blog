---
title: 在 Node.js 中使用 OpenCV 把图片转换为字符
date: 2019/4/11
top: 1
categories: 
- Node.js
- OpenCV
- 图像处理

tags: 
- Node.js
- OpenCV
- 图像处理
---

# 在 Node.js 中使用 OpenCV 把图片转换为字符
    之前觉得有一个炫酷的操作把文字转换为图片。之前也接触过`OpenCV`但是是使用`Python`的。版本也是2.x了，刚好看到有一个`Node.js`的库就来试一下能不能实现
## 效果图
- source  
  ![source](images/example.jpg)
- 输出  
  ```
  $                         $$$$$$$$               $
  $                       $$       $$$
                         $$          $$
  $                     $$  $$$       $$
  $                    $$   $ $$$$$    $$
  $                    $$  $$  $$  $   $$
  $                    $   $$  $$  $    $
  $                    $    $  $$  $    $          $
  $                    $ $  $$$$$ $$    $
  $         $$$$$$$   $$ $$ $$  $$      $
  $       $$$$$$ $$$$ $  $  $$$$$$     $$$$$
  $      $$$        $$$$    $$  $$  $$$$$$$$$$$
  $     $$            $$     $$$$  $$        $$$
  $    $$   $$$ $$$    $          $$           $$
  $    $$  $$  $$ $    $$ $$$$    $   $$$  $    $$
  $    $   $$  $$  $   $$$$$$$$$$$   $  $$$$$    $$
       $   $$  $$  $  $$        $$   $$  $  $$   $$
      $$    $$$$  $$ $            $$ $$  $$  $   $$
      $$ $  $$$$$$$ $$   $$  $     $ $$ $$  $     $
      $ $$  $$$$$$ $$   $  $$$$$    $ $$$$$$$     $
      $     $$$$$$ $    $  $$  $    $ $$  $$      $
      $$    $$$$$$ $    $$ $$$ $    $ $$$$$$ $$   $
      $$      $$   $    $  $$  $    $ $$$$$$  $   $
     $$$           $ $$  $$$$$$$    $  $$$$      $$
    $$            $$ $$ $$$ $$      $$           $$
   $$             $$    $$$$$$  $   $$           $$
   $              $$     $$$$$  $   $$            $
   $ $$$           $$     $$$       $$            $$
   $$$            $$$               $     $$$      $
   $$$           $$                 $      $$$    $$
    $$          $$                  $$            $
    $          $$                    $$           $
    $     $    $  $                   $           $$
    $     $$   $ $$          $      $ $     $     $$
    $$$ $$$$$  $$$       $$         $$$    $$$    $$
    $$$$$$$$$   $$                   $$$  $$$$$ $$$$
                $$                   $$   $$$$$$$$$$
                $$                   $$
                $                    $$
  $          $  $                    $$$
  $      $$$ $  $ $$$$$$$ $$$$$$$ $$$$$$$
  $      $ $$$$$$ $$  $ $ $ $ $ $ $$  $ $
  $      $ $$$    $$  $ $ $ $ $ $ $$$  $$
  $      $ $ $$$$ $$ $$$$ $ $ $ $ $$$ $$$
  $      $ $ $$   $$ $ $$ $ $ $ $ $$  $$$$
  $      $$$ $$   $$      $$  $$$ $$$   $$
  $      $$$ $$$$ $$$$  $ $     $  $ $$$$$
         $   $$  $ $$$  $ $$$$$$$  $    $$    $$$$$$
  $          $$  $$$ $$$$ $$$$$$$  $  $$$    $$$$$
  $                                                $
  ```

## 命令行的简单实现
### 核心
    核心原理就是把对应的灰度值替为对应的字符就可以了

- `cv.imdecodeAsync`   
  从buffer中读取图片

- `cv.resizeAsync`   
  重新调整图片大小

- `cv.cvtColorAsync`  
  颜色转换, 灰度转换
  + e.g
    ```
    const cv =  require('opencv4nodejs')
    const image = cv.imread('./example.jpg')
    cv.imwrite('target.jpg', image.cvtColor(cv.COLOR_BGR2GRAY))
    ```
    输出:   
    ![cvtColor](images/cvtColor.jpg)

- `cv.adaptiveThresholdAsync`  
  自适应阈值化分离目标区域和背景区域
  + eg
    ```
    const cv =  require('opencv4nodejs')
    const image = cv.imread('./1.jpg')
    const cvtGImage = image.cvtColor(cv.COLOR_BGR2GRAY)
    const thresholdImage = cvtGImage.adaptiveThreshold(255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2)
    cv.imwrite('target.jpg', thresholdImage)
    ```
    ![threshold](images/threshold.jpg)

### 实现
- code
  ```
  const cv = require('opencv4nodejs')
  const fs = require('fs')
  const util = require('util')
  const asciiChar = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`\'. '

  function image2charSet(fileName) {
    const textList = []
    const readFile = util.promisify(fs.readFile)
    return readFile(`${__dirname}/${fileName}`)
    .then(imageBuffer=>{
      return cv.imdecodeAsync(imageBuffer)
    })
    .then(image=>{
      const r = image.rows > 300 ? parseInt(image.rows/4) : image.rows
      const c = image.cols > 300 ? parseInt(image.cols/4) : image.cols
      return image.resizeAsync(r, c, 0, 0, cv.INTER_AREA)
    })
    .then(image=>{
      return image.cvtColorAsync(cv.COLOR_BGR2GRAY)
    })
    .then(image=>{
      return image.adaptiveThresholdAsync(255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2)
    })
    .then(image=>{
      let line = ''
      for (let i = 0; i < image.rows; i++) {
        
        for (let j = 0; j < image.cols; j++) {
          const pixel =image.at(i,j)
          line += getChar(pixel)
        }
        line += '\n'
      }
      console.log(line)
    })
    .catch(_=>{
      return Promise.reject(_)
    })
  }

  function getChar(grayNumber){
    const length = asciiChar.length
    const unit = (256.0 + 1)/length
    const index = parseInt(Number(grayNumber/unit))
    return `${asciiChar[index]}`
  }

  const imageName = process.argv[2] || 'image.png'

  image2charSet(imageName)
  ```

- 运行
  ```
  node demo.js source.jpg 
  ```

- 输出
  ```
      ~/images2character » node demo.js source.jpg                                                                                                                                                                                                              
    $$                                   $$$$$$$$$$                     $$
    $                                 $$$$$       $$$                    $
    $                                $$$            $$$
                                    $$$              $$$
    $                              $$$    $$          $$$
    $                              $$   $$$$$  $$$     $$$
    $                             $$    $$  $$$$$$$     $$
    $                             $$   $$   $$$  $$     $$$
    $                             $    $$$   $$$  $$     $$
    $                            $$     $$   $$$  $$     $$
    $                            $$     $$  $$    $$     $$              $
    $                            $$      $$$$$$  $$      $$              $
    $                            $  $$$  $$$$$$$$$        $              $
    $             $$$$$$$$$$     $  $$$  $$    $$         $              $
    $           $$$$$$$ $$$$$$   $  $$$  $$$$$$$$   $    $$
    $         $$$$          $$$$ $       $$  $$$$   $$$$$$$$$$$$$
    $        $$$              $$$$       $$$  $$$  $$$$$$     $$$$$
    $       $$$                 $$$       $$$$$$  $$$            $$$
    $       $$    $$$$   $$      $$              $$$              $$$$
    $      $$    $$$$$$$$$$$      $              $$    $$           $$
    $      $$    $$   $$$  $$     $$ $$$$$$$    $$    $$$$  $$$      $$
    $      $$    $$   $$   $$     $$$$$$$$$$$$ $$    $$  $$$$$$$      $$
    $      $     $$$  $$$  $$   $$$$         $$$$    $$   $$   $$     $$
    $     $$     $$   $$   $$  $$$             $$$   $$$  $$$  $$     $$
    $     $$      $$$$$$   $$ $$$               $$$  $$$  $$$$  $      $
    $     $$ $$$  $$$$$$$$$$  $$    $$$          $$$ $$   $$   $$      $$
    $     $$ $$$  $$    $$   $$    $$$$$ $$$$     $$  $$$$$$   $$      $$
    $     $  $$$  $$$$$$$$  $$     $   $$$$$$$     $$  $$$$$$$$$       $$
    $     $   $   $$$$$$$$  $$    $$   $$   $$      $ $$    $$   $     $$
    $     $$      $$$   $$  $$    $$$  $$$$  $      $ $$$$$$$$   $$    $$
    $     $$       $$$$$$$  $     $$$  $$$$  $      $ $$   $$$   $$    $$
          $$$        $$$    $      $$  $$   $$      $  $$$ $$$   $$    $$
         $$$$               $  $$   $$$$$$  $$      $$ $$$$$$$   $     $$
        $$$                $$  $$   $$$ $$$$$       $$    $           $$
       $$                  $$  $$$ $$$    $$  $$    $$                $$
      $$                   $   $$  $$$$$$$$$  $$    $$                $$
     $$                    $$       $$   $$   $$    $$                 $$
     $$  $                 $$       $$$$$$$   $$    $$                 $$
     $  $$$$$               $$       $$$$$     $    $$                  $$
     $  $$         $       $$$                      $        $$$$$       $
     $$$$                $$$                       $$     $$$$$$$$$$     $
      $$$       $       $$$                        $$          $$$     $ $
       $$       $      $$$                          $$                 $$
       $               $$                            $$                $$
       $     $         $                             $$                $$
       $    $         $$  $$$           $$   $$$$     $$                $
       $       $$$    $$ $$$$$               $$       $$                $
      $$       $$$$   $$ $$                         $$ $      $         $
      $$    $$$$$$$    $$$$     $$ $$$              $$ $     $$$$$      $$
       $$$$$$$$$$$$$    $$      $                   $$ $   $$$$$$$   $$ $$
                        $$                           $ $   $$$$$$$  $$$ $$
                        $$                           $ $    $$$$$$$$$$  $
    $                   $$                           $$$
    $                   $$                           $$$
    $                   $                            $$$
    $              $$   $  $$     $                   $$
    $         $$$$ $$   $ $$$$$$$$$$  $$$$$$$$$$ $$$$$$$$$$
    $         $$$$ $$$$$$ $ $ $ $$ $  $  $ $$ $$ $ $$ $  $$
    $         $$ $ $$$    $ $ $  $ $  $  $ $  $$ $    $ $ $
    $         $  $$ $     $$$ $  $ $  $  $ $  $$ $$$$ $ $ $
    $         $  $$ $$    $ $ $  $ $  $  $ $  $  $$$$ $ $$$
    $         $$ $  $$$$$ $ $ $$$$$$  $ $$ $  $  $    $ $$
    $         $$ $  $     $ $ $    $  $ $  $$ $$ $    $$$$$
    $         $$ $  $     $$$ $       $$$  $$$$$ $$$$     $$
    $         $$$$  $$$$$ $ $ $     $ $$      $$ $$$$$$$$$$
    $         $$$$  $$    $ $ $    $$ $       $$   $  $$$ $      $$$$ $$ $
              $$    $     $ $ $    $$ $$$$$$$$$$  $$      $    $ $$$$$$$ $
    $               $$   $$$$ $$$$$$  $$$$$$$$$$  $$   $$$$    $$$$$$  $
    $               $    $ $$         $       $$  $$   $$$      $$$$$$$$ $
    $$                                                                   $

    ```
## REF
[python Image Thresholding ](https://docs.opencv.org/3.4.0/d7/d4d/tutorial_py_thresholding.html)  
[Miscellaneous Image Transformations](https://docs.opencv.org/2.4/modules/imgproc/doc/miscellaneous_transformations.html)  
[opencv4nodejs](https://github.com/justadudewhohacks/opencv4nodejs)
## 更多
[简单的一个example TODO:优化代码...](https://github.com/Sanbornzhang/image2charSet)