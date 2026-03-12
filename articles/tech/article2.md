date: 2025-2-13
abstract: 该文章提出一种yolo主系列改进小目标检测头算法的方法

# 【转载】YOLOv8/YOLOv7/YOLOv5系列算法改进

YOLOv8/YOLOv7/YOLOv5系列算法改进【NO.6】增加小目标检测层，提高对小目标的检测效果

原创
已于 2023-03-22 16:12:12 修改
5.5w 阅读
151 点赞
1.4k 收藏
CC 4.0 BY-SA版权

文章标签：
#目标检测 #深度学习 #python

## YOLO算法改进系列

专栏收录该内容
166 篇文章
订阅专栏

YOLO（You Only Look Once）是一种流行的物体检测和图像分割模型，由华盛顿大学的Joseph Redmon 和Ali Farhadi 开发。 YOLO 于2015 年推出，因其高速和高精度而广受欢迎。

## 前言

作为当前先进的深度学习目标检测算法YOLO，已经集合了大量的trick，但是在处理一些复杂检测问题的时候，还是容易出现错漏检的问题。此后的系列文章，将重点对YOLOv8、YOLOv7以及YOLOv5的如何改进进行详细的介绍，目的是为了给那些搞科研的同学需要创新点或者搞工程项目的朋友需要达到更好的效果提供自己的微薄帮助和参考。

## 一、解决问题

YOLO小目标检测效果不好的一个原因是因为小目标样本的尺寸较小，而yolov8的下采样倍数比较大，较深的特征图很难学习到小目标的特征信息，因此提出增加小目标检测层对较浅特征图与深特征图拼接后进行检测。

加入小目标检测层，可以让网络更加关注小目标的检测，提高检测效果。这个方式的实现十分简单有效，只需要修改yolov8的模型文件yaml就可以增加小目标检测层，但是在增加检测层后，带来的问题就是计算量增加，导致推理检测速度降低。不过对于小目标，确实有很好的改善，修改yaml文件，需要修改特征融合网络。

## 二、YOLOv8改进方法

近期有朋友问到YOLOv8的改进方法，特此分享，增加小目标检测层的yaml文件前后对比。

### yaml文件

#### 改进前：

# Ultralytics YOLO 🚀, GPL-3.0 license

# Parameters
nc: 80  # number of classes
depth_multiple: 0.33  # scales module repeats
width_multiple: 0.50  # scales convolution channels

# YOLOv8.0s backbone
backbone:
  # [from, repeats, module, args]
  - [-1, 1, Conv, [64, 3, 2]]  # 0-P1/2
  - [-1, 1, Conv, [128, 3, 2]]  # 1-P2/4
  - [-1, 3, C2f, [128, True]]
  - [-1, 1, Conv, [256, 3, 2]]  # 3-P3/8
  - [-1, 6, C2f, [256, True]]
  - [-1, 1, Conv, [512, 3, 2]]  # 5-P4/16
  - [-1, 6, C2f, [512, True]]
  - [-1, 1, Conv, [1024, 3, 2]]  # 7-P5/32
  - [-1, 3, C2f, [1024, True]]
  - [-1, 1, SPPF, [1024, 5]]  # 9

# YOLOv8.0s head
head:
  - [-1, 1, nn.Upsample, [None, 2, 'nearest']]
  - [[-1, 6], 1, Concat, [1]]  # cat backbone P4
  - [-1, 3, C2f, [512]]  # 13

  - [-1, 1, nn.Upsample, [None, 2, 'nearest']]
  - [[-1, 4], 1, Concat, [1]]  # cat backbone P3
  - [-1, 3, C2f, [256]]  # 17 (P3/8-small)

  - [-1, 1, Conv, [256, 3, 2]]
  - [[-1, 12], 1, Concat, [1]]  # cat head P4
  - [-1, 3, C2f, [512]]  # 20 (P4/16-medium)

  - [-1, 1, Conv, [512, 3, 2]]
  - [[-1, 9], 1, Concat, [1]]  # cat head P5
  - [-1, 3, C2f, [1024]]  # 23 (P5/32-large)

  - [[15, 18, 21], 1, Detect, [nc]]  # Detect(P3, P4, P5)

#### 改进后：

# Ultralytics YOLO 🚀, GPL-3.0 license

# Parameters
nc: 80  # number of classes
depth_multiple: 0.33  # scales module repeats
width_multiple: 0.50  # scales convolution channels

# YOLOv8.0s backbone
backbone:
  # [from, repeats, module, args]
  - [-1, 1, Conv, [64, 3, 2]]  # 0-P1/2
  - [-1, 1, Conv, [128, 3, 2]]  # 1-P2/4
  - [-1, 3, C2f, [128, True]]
  - [-1, 1, Conv, [256, 3, 2]]  # 3-P3/8
  - [-1, 6, C2f, [256, True]]
  - [-1, 1, Conv, [512, 3, 2]]  # 5-P4/16
  - [-1, 6, C2f, [512, True]]
  - [-1, 1, Conv, [1024, 3, 2]]  # 7-P5/32
  - [-1, 3, C2f, [1024, True]]
  - [-1, 1, SPPF, [1024, 5]]  # 9

# YOLOv8.0s head
head:
  - [-1, 1, nn.Upsample, [None, 2, 'nearest']]
  - [[-1, 6], 1, Concat, [1]]  # cat backbone P4
  - [-1, 3, C2f, [512]]  # 13

  - [-1, 1, nn.Upsample, [None, 2, 'nearest']]
  - [[-1, 4], 1, Concat, [1]]  # cat backbone P3
  - [-1, 3, C2f, [256]]  # 17 (P3/8-small)

  - [-1, 1, nn.Upsample, [None, 2, 'nearest']]
  - [[-1, 2], 1, Concat, [1]]  # cat backbone P3
  - [-1, 3, C2f, [128]]  # 20 (P4/16-medium)

  - [-1, 1, Conv, [256, 3, 2]]
  - [[-1, 15], 1, Concat, [1]]  # cat head P4
  - [-1, 3, C2f, [256]]  # 20 (P4/16-medium)

  - [-1, 1, Conv, [512, 3, 2]]
  - [[-1, 12], 1, Concat, [1]]  # cat head P5
  - [-1, 3, C2f, [512]]  # 23 (P5/32-large)

  - [-1, 1, Conv, [512, 3, 2]]
  - [[-1, 9], 1, Concat, [1]]  # cat head P5
  - [-1, 3, C2f, [1024]]  # 23 (P5/32-large)

  - [[18, 21, 24,27], 1, Detect, [nc]]  # Detect(P3, P4, P5)

### 结构图

#### 改进前：

（此处保留原文图片位置，可自行插入对应结构图）

#### 改进后：

（此处保留原文图片位置，可自行插入对应结构图）

最后，将train.py中改为本文的yaml文件即可，开始训练。

## 三、YOLOv7改进方法

对YOLOv7项目路径下cfg\deploy\yolov7-tiny-silu.yaml进行修改，将检测层改为[[74,75,76,77], 1, Detect, [nc, anchors]],   # Detect(P3, P4, P5)，同时锚框增加小目标检测头的锚框[5,6, 8,14, 15,11]。具体改进后的如下所示。

# parameters
nc: 80  # number of classes
depth_multiple: 1.0  # model depth multiple
width_multiple: 1.0  # layer channel multiple

# anchors
anchors:
#  - [10,13, 16,30, 33,23]  # P3/8
#  - [30,61, 62,45, 59,119]  # P4/16
#  - [116,90, 156,198, 373,326]  # P5/32
  - [5,6, 8,14, 15,11]
  - [10,13, 16,30, 33,23]  # P3/8
  - [30,61, 62,45, 59,119]  # P4/16
  - [116,90, 156,198, 373,326]  # P5/32

# YOLOv7-tiny backbone
backbone:
  # [from, number, module, args]
  [[-1, 1, Conv, [32, 3, 2]],  # 0-P1/2  
  
   [-1, 1, Conv, [64, 3, 2]],  # 1-P2/4    
   
   [-1, 1, Conv, [32, 1, 1]],
   [-2, 1, Conv, [32, 1, 1]],
   [-1, 1, Conv, [32, 3, 1]],
   [-1, 1, Conv, [32, 3, 1]],
   [[-1, -2, -3, -4], 1, Concat, [1]],
   [-1, 1, Conv, [64, 1, 1]],  # 7
   
   [-1, 1, MP, []],  # 8-P3/8
   [-1, 1, Conv, [64, 1, 1]],
   [-2, 1, Conv, [64, 1, 1]],
   [-1, 1, Conv, [64, 3, 1]],
   [-1, 1, Conv, [64, 3, 1]],
   [[-1, -2, -3, -4], 1, Concat, [1]],
   [-1, 1, Conv, [128, 1, 1]],  # 14
   
   [-1, 1, MP, []],  # 15-P4/16
   [-1, 1, Conv, [128, 1, 1]],
   [-2, 1, Conv, [128, 1, 1]],
   [-1, 1, Conv, [128, 3, 1]],
   [-1, 1, Conv, [128, 3, 1]],
   [[-1, -2, -3, -4], 1, Concat, [1]],
   [-1, 1, Conv, [256, 1, 1]],  # 21
   
   [-1, 1, MP, []],  # 22-P5/32
   [-1, 1, Conv, [256, 1, 1]],
   [-2, 1, Conv, [256, 1, 1]],
   [-1, 1, Conv, [256, 3, 1]],
   [-1, 1, Conv, [256, 3, 1]],
   [[-1, -2, -3, -4], 1, Concat, [1]],
   [-1, 1, Conv, [512, 1, 1]],  # 28
  ]

# YOLOv7-tiny head
head:
  [[-1, 1, Conv, [256, 1, 1]],
   [-2, 1, Conv, [256, 1, 1]],
   [-1, 1, SP, [5]],
   [-2, 1, SP, [9]],
   [-3, 1, SP, [13]],
   [[-1, -2, -3, -4], 1, Concat, [1]],
   [-1, 1, Conv, [256, 1, 1]],
   [[-1, -7], 1, Concat, [1]],
   [-1, 1, Conv, [256, 1, 1]],  # 37
  
   [-1, 1, Conv, [128, 1, 1]],
   [-1, 1, nn.Upsample, [None, 2, 'nearest']],
   [21, 1, Conv, [128, 1, 1]], # route backbone P4
   [[-1, -2], 1, Concat, [1]],
   
   [-1, 1, Conv, [64, 1, 1]],
   [-2, 1, Conv, [64, 1, 1]],
   [-1, 1, Conv, [64, 3, 1]],
   [-1, 1, Conv, [64, 3, 1]],
   [[-1, -2, -3, -4], 1, Concat, [1]],
   [-1, 1, Conv, [128, 1, 1]],  # 47
  
   [-1, 1, Conv, [64, 1, 1]],
   [-1, 1, nn.Upsample, [None, 2, 'nearest']],
   [14, 1, Conv, [64, 1, 1]], # route backbone P3
   [[-1, -2], 1, Concat, [1]],
   
   [-1, 1, Conv, [32, 1, 1]],
   [-2, 1, Conv, [32, 1, 1]],
   [-1, 1, Conv, [32, 3, 1]],
   [-1, 1, Conv, [32, 3, 1]],
   [[-1, -2, -3, -4], 1, Concat, [1]],
   [-1, 1, Conv, [64, 1, 1]],  # 57
   
   [-1, 1, Conv, [128, 3, 2]],
   [[-1, 47], 1, Concat, [1]],
   
   [-1, 1, Conv, [64, 1, 1]],
   [-2, 1, Conv, [64, 1, 1]],
   [-1, 1, Conv, [64, 3, 1]],
   [-1, 1, Conv, [64, 3, 1]],
   [[-1, -2, -3, -4], 1, Concat, [1]],
   [-1, 1, Conv, [128, 1, 1]],  # 65
   
   [-1, 1, Conv, [256, 3, 2]],
   [[-1, 37], 1, Concat, [1]],
   
   [-1, 1, Conv, [128, 1, 1]],
   [-2, 1, Conv, [128, 1, 1]],
   [-1, 1, Conv, [128, 3, 1]],
   [-1, 1, Conv, [128, 3, 1]],
   [[-1, -2, -3, -4], 1, Concat, [1]],
   [-1, 1, Conv, [256, 1, 1]],  # 73

   [47, 1, Conv, [64, 3, 1]],
   [57, 1, Conv, [128, 3, 1]],
   [65, 1, Conv, [256, 3, 1]],
   [73, 1, Conv, [512, 3, 1]],

   [[74,75,76,77], 1, Detect, [nc, anchors]],   # Detect(P3, P4, P5)
  ]

近期有朋友问到对于改进yolov7网络结构后增加小目标检测层，如下所示，yaml文件所涉及的感兴趣的朋友可以关注私信我：

# parameters
nc: 3  # number of classes
depth_multiple: 0.33  # model depth multiple
width_multiple: 0.50  # layer channel multiple

# anchors
anchors:
  - [ 19,27,  44,40,  38,94 ]  # P3/8
  - [ 96,68,  86,152,  180,137 ]  # P4/16
  - [ 140,301,  303,264,  238,542 ]  # P5/32
  - [ 436,615,  739,380,  925,792 ]  # P6/64

backbone:
  # [from, number, module, args]
  [[-1, 1, Conv, [64, 6, 2, 2]],  # 0-P1/2

   
   [-1, 1, Conv, [128, 3, 2]],  # 1-P2/4
       # [-1,1,CoordAtt,[128]],
   [-1, 3, ELANB, [128]],
   [-1, 1, Conv, [256, 3, 2]],  # 3-P3/8
   [-1, 6, ELANB, [256]],
   [-1, 1, Conv, [512, 3, 2]],  # 5-P4/16
   [-1, 9, ELANB, [512]],
   [-1, 1, Conv, [1024, 3, 2]],  # 7-P5/32
   [-1, 3, ELANB, [1024]],
   [-1, 1, SPPCSPC, [512]],
  ]

head:
  [[-1, 1, SimConv, [256, 1, 1]],
   [-1, 1, Transpose, [256]],
   [[-1, 6], 1, Concat, [1]],
   [-1, 12, RepBlock, [256]],

   [-1, 1, SimConv, [256, 1, 1]],
   [-1, 1, Transpose, [256]],
   [[-1, 4], 1, Concat, [1]],
   [-1, 12, RepBlock, [256]],

   [-1, 1, SimConv, [128, 1, 1]],
   [-1, 1, Transpose, [128]],
   [[-1, 2], 1, Concat, [1]],
   [-1, 12, RepBlock, [128]],   #out

   [-1, 1, SimConv, [128, 3, 2]],
   [[-1, 18], 1, Concat, [1]],
   [-1, 12, RepBlock, [256]],  # 20

   [-1, 1, SimConv, [128, 3, 2]],
   [[-1, 14], 1, Concat, [1]],
   [-1, 12, RepBlock, [256]],  # 20

   [-1, 1, SimConv, [256, 3, 2]],
   [[-1, 10], 1, Concat, [1]],  # cat head P5
   [-1, 12, RepBlock, [512]],  # 23

   [[21,24,27,30], 1, IDetect, [nc, anchors]],   # Detect(P3, P4, P5)
  ]

## 四、YOLOv5改进方法

YOLOv5改进YOLOv5s.yaml，改进方法参考YOLOv7算法改进。

backbone:
  # [from, number, module, args]
  [[-1, 1, Focus, [64, 3]],  # 0-P1/2
   [-1, 1, Conv, [128, 3, 2]],  # 1-P2/4
   [-1, 3, C3, [128]],
   [-1, 1, Conv, [256, 3, 2]],  # 3-P3/8
   [-1, 9, C3, [256]],
   [-1, 1, Conv, [512, 3, 2]],  # 5-P4/16
   [-1, 9, C3, [512]],
   [-1, 1, Conv, [1024, 3, 2]],  # 7-P5/32
   [-1, 1, SPP, [1024, [5, 9, 13]]],
   [-1, 3, C3, [1024, False]],  # 9
  ]

# YOLOv5 head
head:
  [[-1, 1, Conv, [512, 1, 1]],#20*20
   [-1, 1, nn.Upsample, [None, 2, 'nearest']],
   [[-1, 6], 1, Concat, [1]],  # cat backbone P4
   [-1, 3, C3, [512, False]],  # 13

   [-1, 1, Conv, [512, 1, 1]], #40*40 14
   [-1, 1, nn.Upsample, [None, 2, 'nearest']],
   [[-1, 4], 1, Concat, [1]],  # cat backbone P3   80*80
   [-1, 3, C3, [512, False]],  # 17 (P3/8-small)  80*80

   [-1, 1, Conv, [256, 1, 1]],
   [-1, 1, nn.Upsample, [None, 2, 'nearest']],
   [[-1, 2], 1, Concat, [1]],  # cat backbone P3
   [-1, 3, C3, [256, False]],  # 17 (P3/8-small)21

   [-1, 1, Conv, [256, 3, 2]],
   [[-1, 18], 1, Concat, [1]],  # cat head P4
   [-1, 3, C3, [256, False]],  # 20 (P4/16-medium)24

   [-1, 1, Conv, [256, 3, 2]],  #22   80*80
   [[-1, 14], 1, Concat, [1]], #23 80*80
   [-1, 3, C3, [512, False]], #24 80*80

   [-1, 1, Conv, [512, 3, 2]],
   [[-1, 10], 1, Concat, [1]],  # cat head P5
   [-1, 3, C3, [1024, False]],  # 23 (P5/32-large)

   [[21, 24, 27,30], 1, Detect, [nc, anchors]],  # Detect(P3, P4, P5)
  ]

添加小目标检测层后的模型图如下所示：

（此处保留原文图片位置，可自行插入对应模型图）

最后，将train.py中改为本文的yaml文件即可，开始训练。

## 结果

本人在多个数据集上做了大量实验，针对不同的数据集效果不同，同一个数据集的不同添加位置方法也是有差异，需要大家进行实验。有效果有提升的情况占大多数。

## 预告

下一篇内容分享损失函数的改进。有兴趣的朋友可以关注一下我，有问题可以留言或者私聊我哦。

## PS

增加检测层的方法不仅仅是适用改进YOLOv5，也可以改进其他的YOLO网络，比如YOLOv4、v3等。

最后，有改进相关问题欢迎关注私信我。

---

### 您可能感兴趣的与本文相关的镜像

#### Yolo-v8.3

YOLO（You Only Look Once）是一种流行的物体检测和图像分割模型，由华盛顿大学的Joseph Redmon 和Ali Farhadi 开发。 YOLO 于2015 年推出，因其高速和高精度而广受欢迎

一键部署运行

---

人工智能算法研究院
已关注

---

版权声明：本文为CSDN博主「人工智能算法研究院」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https:/blog.csdn.net/m0_70388905/article/details/125392908
