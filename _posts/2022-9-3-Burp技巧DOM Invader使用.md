---
layout: post
title: "Burp技巧DOM Invader使用"
date:   2022-09-03
tags: [BurpSuite]
comments: true
author: yanmu
---

## 前言

大多数现代网站都使用多个JavaScript库，并且有很多行复杂的压缩代码，这使得对DOM XSS的测试变得非常令人头痛，PortSwigger安全研究部门专门开发了DOM Invader，使对DOM XSS的测试更加容易

> Dom Invader会自动识别页面所有可控的Source（源）和Sink（汇）并将Canary（金丝雀）注入后按照危害程度进行高到低排序

DOM Invader 探测目标的 DOM，拦截它可能遇到的任何 JavaScript 源和汇，并将它们组织起来供你使用
DOM Invader会对汇（Sinks）进行排序，使最有价值的的汇（Sinks）排列在最前面

source:表示任何允许用户控制的输入的JavaScript对象，例如：location.search
sink:表示任何允许JavaScript/HTML执行的函数或设置器，例如：eval、document.write
canary:这也是BurpSuite定义的一个概念，这里你可以理解为是一个字符串，是一个独特的字符串，用于查看用户输入在汇（Sinks）中的反映，默认情况下，DOM Invader使用一个随机的金丝雀（canary），不过你也可以将这个值自定义为你喜欢的任何值

---

从Burp 2021.7版本,burp自带的浏览器就集成了该插件
不过默认情况下DOM Invader是关闭的，你需要手动开启
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651535927747-143de6ed-c90e-4646-a618-a7d7226c2eba.png)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651535965856-cf7d2baf-2b56-47d0-bea3-48ecef2a2807.png)

## 使用
开启插件后f12查看是否可以使用

当你打开后
它显示任何包含金丝雀（Canary）值的源（Sources）和汇（Sinks），以及所有可用的源（Sources）和汇（Sinks）的树状视图。
当你找到一个有趣的汇（Sinks），你可以看到其中包含的值，以及堆栈跟踪，并会突出显示你的金丝雀（Canary），通过Augmented DOM，你也可以检查你自定义的金丝雀（Canary）值是否被正确编码。
其他有用的功能包括能够搜索发送到汇（Sinks）的值，以及自动将金丝雀（Canary）注入到URL参数和表单元素中
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651536020970-3da187f9-4ddd-46c1-828f-effa7c660cfa.png)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651536117144-675282d4-ebc7-4467-ad36-e274a5fd0d4c.png)
> portswigger官方靶场
> [http://portswigger-labs.net/dom-invader/](http://portswigger-labs.net/dom-invader/)
> https://portswigger-labs.net/dom-invader/testcases/augmented-dom-eval/index.php  url注入
> 
> pikachu靶场 表单注入

### URL注入
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651537859800-0374f357-6776-4819-91f8-1f6c5015e2ab.png)
首先单击Test 发现为get请求，url多了x参数。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651537882171-5d258ad8-c989-4a4e-9656-cb7984c67d9c.png)
将Canary 注入到URL
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651537921440-82240547-cd33-499f-9285-4cf4ed615dbe.png)
发现Sinks中有个标红的eval()，单击右边蓝色的Stack Trace进行跟踪,具体位置它会显示在console窗口
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651537934925-44b564ff-9f82-4220-8550-ae640c38155a.png)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651537944045-239ca34c-2a6a-4259-bac9-8dec18ca6092.png)
跟进来发现是eval(x)出了错
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651537950497-b4003f3c-59f3-490a-9cbb-82e112b08bb2.png)


### 表单注入
pikachu靶场
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651537091325-0f337a7f-5895-4578-b2ac-80e5dff8b394.png)
这里是基于表单的DOM XSS
所以我们将金丝雀，也就是payload注入表单即可

![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651537175993-d1fc1ac7-3384-4d04-a7a9-093403ba14c7.png)
随后发现Sinks中有个标红的innerHTML参数
单机右边蓝色的Stack Trace可进行追踪。具体位置他会显示在console窗口中
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651537306112-6d157244-b5c0-47f9-b4fb-c8e8524bdfc5.png)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651537345290-a28901da-2a8a-40b3-9789-146e7edab6a0.png)
跟踪进来以后发现出现问题的地方
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651537403374-888d77be-6480-4675-a1f0-201aef2a1ef8.png)

## 事件监听器与重定向
> 靶场
> [https://portswigger-labs.net/dom-invader/testcases/augmented-dom-click-location-replace/index.php?x=burpdomxss](https://portswigger-labs.net/dom-invader/testcases/augmented-dom-click-location-replace/index.php?x=burpdomxss)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651537660191-3ae7bccb-ef3b-4088-a973-cdf77b0a261b.png)
开启自动点击事件与禁止重定向
> click事件触发时候会执行location.replace(x)当前页面会进行文档替换(刷新)，并且禁止回退。所以js中的堆栈数据刷新了自然就没有数据了

![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651538103247-2ff81e64-8194-4a6c-b1f9-ee27d85f5764.png)

比如在这个靶场中我们不开启这个功能，会什么都查询不到
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651538069860-177a3d2d-b69b-4bde-a496-fb82728808e7.png)


![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651538057130-b5d0ca26-1286-4157-b4dc-fa42b47790ac.png)

## 消息拦截器
> 靶场
> [https://portswigger-labs.net/dom-invader/testcases/postmessage-eval-iframe-multiple/](https://portswigger-labs.net/dom-invader/testcases/postmessage-eval-iframe-multiple/)


此功能需要开启Postmessage interception功能
> 三个子功能可以不开启，不过开启后，危害效果更佳明显

![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651538182773-94f0572e-0ff1-495e-8e15-145b66de64e0.png)


![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651538481861-67dc7f21-e8e1-4248-a3e2-2a5538e48c69.png)
查看堆栈eval(x)
直接修改payload选择发送
![image.png](https://cdn.nlark.com/yuque/0/2022/png/8363097/1651538633131-0bb6d764-a1ef-4884-b39d-1722c275ac8e.png)
Build POC，能将payload改成恶意代码后生产一个iframe加载，复制到剪贴板上
点击就会跳转弹窗
```cpp

        <!doctype html>
        <html>
            <head>
                <!-- DOM XSS PoC - generated by DOM Invader part of Burp Suite -->
                <meta charset="UTF-8" />
                <title>Postmessage PoC</title>
                <script>
                    function pocLink() {
                        let win = window.open('https://subdomain1.portswigger-labs.net/dom-invader/testcases/postmessage-eval-iframe-multiple/external.html');
                        let msg = "javascript:alert(1)";
                        
                        setTimeout(function(){
                            win.postMessage(msg, '*');
                        }, 5000);
                    }
                    function pocFrame(win) {           
                        let msg = "javascript:alert(1)";
                        
                        win.postMessage(msg, '*');          
                    }
                </script>
            </head>
            <body>
                <a href="#" onclick="pocLink();">PoC link</a>          
                <iframe src="https://subdomain1.portswigger-labs.net/dom-invader/testcases/postmessage-eval-iframe-multiple/external.html" onload="pocFrame(this.contentWindow)"></iframe>                    
            </body>
        </html>
        
```
