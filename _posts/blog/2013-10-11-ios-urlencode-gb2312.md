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
[keyValuePairs addObject:[NSString stringWithFormat:@"%@=%@", key, escapedStr]];
CFRelease(escapedStr);
{% endhighlight %}

