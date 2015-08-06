iMoney.js
===============

`iMoney.js`是一个移动端基础脚本框架。

```html
//开发版
<script src="http://imoney.w3cmm.com/1.1.0/imoney.js"></script>
//压缩版
<script src="http://imoney.w3cmm.com/1.1.0/imoney.min.js"></script>
```

##快速上手

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>iMoney 示例</title>
    <script src="../src/imoney.js"></script>
</head>

<body>
    <div id="result"></div>
    <script>
    //配置包
    $.config({
        baseUrl: "modules",
        paths: {
            "name": "model/getName"
        },
        waitSeconds: 3,
        urlArgs: 't='+ Date.now()
    });
    //使用2模块
    //一个基于baseUrl的hello模块，一个基于baseUrl+paths规则定义的name模块，一个内部定义的wish模块
    $.require(["hello","name"], function(Hello,Name) {
        //此处可以使用类似Zepto的相关api进行业务逻辑操作
        //API地址: http://imoney.w3cmm.com/
        var $result = $("#result");
        $result.attr({
            title:"这里显示的是结果"
        });
        $result.html('<p>' + Hello.say + '</p><p>这里是' + Name.say + '</p>') ;
    });
    </script>
</body>

</html>
```
##API

[http://imoney.w3cmm.com](http://imoney.w3cmm.com)

##Examples

[https://github.com/stormtea123/iMoney-examples](Examples)
