---
layout: post
category : blog
tag: dev
---

入门篇非常多，内容基本一样。这里贴个链接仅供参考  
[http://wufawei.com/2013/08/iOS-jailbroken-programming-1/](http://wufawei.com/2013/08/iOS-jailbroken-programming-1/)

[http://iky1e.tumblr.com/post/9561218739/jailbroken-development-starter-pack](http://iky1e.tumblr.com/post/9561218739/jailbroken-development-starter-pack)


下面是max在学习过程中碰到的一些问题或者需要注意的地方。

### 所需准备
1. Xcode，xcode command line tools   
2. 越狱设备一台，max用的是8月最新的iPad Mini2；iOS 7.1.2  

### 安装软件
mac机上安装Theos和ldid。  
iPad上越狱后，通过cydia安装openssl(用于ssh登录，记得修改密码)，mobileterminal, ios toolchain, adv_cmds(安装cycript时要用)。同时附带安装了sbsettings(不知道都后面的其他工具有没有影响)。  
安装cycript。到官网下载最新的deb，按教程安装。  
  
这时候能够通过ssh登录到设备，到上面去玩cycript。可以debug一些app看一看  

	$ ps aux | grep [appid]
	# get pid
	$ cycript -p [pid]

### App和Tweak
按照教程，App开发比较容易，需要注意的是安装过后，重启了sprintboard才看到app。  

Tweak例子首先是碰到了各种头文件问题。通过搜索找到这些资源： 
   
1. 一些lib [https://github.com/kokoabim/iOSOpenDev](https://github.com/kokoabim/iOSOpenDev)  
2. 一些头文件[https://github.com/rpetrich/iphoneheaders](https://github.com/rpetrich/iphoneheaders)  

最后的情况是，SpringBoard的例子没跑出效果，iOS7的实验有所变化？尝试hook自己写的一个app方法，成功。 

