---
layout: post
category : tool
tags : [howto, xcode, ios]
---

Apple官方并没有如何去写Xcode插件的文章。网上搜这个关键词也没找到特别有用的内容。接触到这块是由于Xcode的console把所有log都输出在里面。项目越来越大，每个人都输出自己所需的log，但大家的log混淆在一起，通过log debug实在是个体力活。后来尝试搜索Xcode console color找到了[XcodeColors](http://deepitpro.com/en/articles/XcodeColors/info/) 这个plugin，依葫芦画瓢写出了第一个版本的日志分级显示工具。当时采用的方式是将log输出到一个webview，用html展示log，纯javascript的事情了。后来发现这个效率太低，上万条log后，html页面速度成了瓶颈，很难用。  
  
在后来，log太多依然让人头痛，我用重新看了一下XcodeColors的源码，从中受到启发，写了第二版的日志分级插件XLog。这里将从无到有的过程分享下。本文思路来源于XcodeColors，但是否仅有这一种方式来写plugin，需要进一步学习。  
  
言归正传，本文基于最新的Xcode4.3.2完成。  
#一、创建工程
打开Xcode新建一个工程：Mac OS X / Framework & Library / Bundle  
![](/images/how-to-write-xcode-plugin/Screen-Shot-2012-05-08-at-4.43.48-PM.png)
  
Next，填上你的Product Name， Framework选择Cocoa。当然要用到framework可以后面自行添加，XLog比较简单，仅需Cocoa的framework而已。  
  
![](/images/how-to-write-xcode-plugin/Screen-Shot-2012-05-08-at-4.46.04-PM.png)
  
Next完成，工程创建完成。
#二、创建plugin入口函数
创建一个OC的Class (Commad+N -&gt; Mac OS X / Cocoa / Objective-C Class）名字自定义，本文命名为XLog。生成XLog.h XLog.m两个文件。  
  
![](/images/how-to-write-xcode-plugin/Screen-Shot-2012-05-08-at-4.48.44-PM.png)

为XLog类添加两个Class method:  
XLog.h  

{% highlight objc %}  
@interface XLog : NSObject  
// entry for plugin  
+ (void)load;  
+ (void)pluginDidLoad:(NSBundle *)bundle;  
@end  
{% endhighlight %}

XLog.mm  

{% highlight objc %}  
@implementation XLog  
  
+ (void)load  
{  
	NSLog(@"%s", __PRETTY_FUNCTION__);  
}  
+ (void)pluginDidLoad:(NSBundle *)bundle  
{  
	NSLog(@"%s, %@", __PRETTY_FUNCTION__, bundle);  
}  
{% endhighlight %}
  
仅打印一些log，检测是否加载plugin即可。这时候class和method都创建好了，但是Xcode怎么知道去加载这个class？请继续  
#三、修改Info.plist
在工程Supports Files里有个XLog-Info.plist文件。打开编辑之。  
  
1. 修改Principal class的值为一个class名。本例为XLog。这样Xcode就知道该plugin的入口了。  
2. 添加Boolean型参数XC4Compatible: YES  
3. 添加Boolean型参数XCGCReady: YES  
4. 添加Boolean型参数XCPluginHasUI: NO  
  
最终效果如下图：  
  
![](/images/how-to-write-xcode-plugin/Screen-Shot-2012-05-08-at-4.52.21-PM.png)
  
#四、配置target Build Phases，安装插件
选择工程文件 -&gt; 选中TARGETS中的XLog -&gt; 选择Build Phases 点击右下角的Add Build Phase -&gt; Add Run Script 如下图：   

![](/images/how-to-write-xcode-plugin/Screen-Shot-2012-05-08-at-4.54.16-PM.png)
  
添加完成后，展开Run Script栏，输入以下脚本：
  
{% highlight sh %}  
rm -rf ~/Library/Application\\ Support/Developer/Shared/Xcode/Plug-ins/XLog.xcplugin
nmkdir -p ~/Library/Application\\ Support/Developer/Shared/Xcode/Plug-ins
cp -r build/Debug/XLog.bundle ~/Library/Application\\ Support/Developer/Shared/Xcode/Plug-ins/XLog.xcplugin 
{% endhighlight %}  
  
每次build的时候都会删除老的plugin，安装最新的进去。  
  
  
经过上面4个步骤，我们已经创建了工程、指定入口、指定安装选项。这时候build一下就已经将XLog.plugin安装到了Xcode的插件目录。可以到步骤4里指定的安装目录查看。  
  
但这时候装进去了如何调试plugin，NSLog的东西到哪去了？  

#五、配置工程Scheme
点击左上角的工程XLog，选择Edit Scheme...  
  
![](/images/how-to-write-xcode-plugin/Screen-Shot-2012-05-08-at-4.56.37-PM.png)
  
在Run tab中，点击Executable下拉选择Other...，去选择Xcode （默认路径/Applications/Xcode.app）  
  
![](/images/how-to-write-xcode-plugin/Screen-Shot-2012-05-08-at-4.56.55-PM.png)
  
最终如下图：  
  
![](/images/how-to-write-xcode-plugin/Screen-Shot-2012-05-08-at-4.57.28-PM.png)
  
现在编译运行一下，能看到系统又启动了一个Xcode，这个Xcode就是给我们debug用的。  
但是，可能会在控制台看到以下错误：  

	Error loading .../Plug-ins/XLog.xcplugin/Contents/MacOS/XLog:  dlopen(.../Plug-ins/XLog.xcplugin/Contents/MacOS/XLog, 265): no suitable image found.  Did find:.../Plug-ins/XLog.xcplugin/Contents/MacOS/XLog: GC capability mismatch
  
  
如果有以上错误信息，请按照下一步进行修改：  
#六、修改编译选项
打开工程文件 -&gt; 选择PROJECT/XLog -&gt; Build Settings  
  
选择"All"显示所有选项，到Apple LLVM compiler 3.1 - Language栏下，将Objective-C Automatic Reference Counting设置为NO （或者选中后按delete），选择Objective-C Garbage Collection为Supported \[-fobjc-gc\]  
  
![](/images/how-to-write-xcode-plugin/Screen-Shot-2012-05-08-at-5.00.49-PM.png)

重新运行一次，控制台中会看到我们的两个入口函数被执行了一遍。  
    
至此，一个Xcode plugin工程就创建并可以运行了，入口也有了，后面就是如何来实现自己想要的功能。  
  
XcodeColors里提供的思路是用&lt;objc/runtime.h&gt;库，将一些类默认的行为替换自己的，至于其他方案，还需要大家提供思路。  
