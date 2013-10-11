---
layout: post
category : blog
---

{% highlight objc %}
CFStringRef escapedStr = CFURLCreateStringByAddingPercentEscapes(NULL,
                                                                 (CFStringRef)value,
                                                                 NULL,
                                                                 (CFStringRef)@"!*'();:@&=+$,/?%#[]",
                                                                 kCFStringEncodingGB_18030_2000"'");
NSString *result = [NSString stringWithFormat:@"%@", escapedStr];
CFRelease(escapedStr);
return result;

{% endhighlight %}

