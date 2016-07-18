iMoney.js

![image](https://cloud.githubusercontent.com/assets/1193966/16918417/d4d533ce-4d37-11e6-92ec-1e13ad5e15d6.png)
===============

iMoney.js是一个移动端基础脚本框架。

![image](https://cloud.githubusercontent.com/assets/1193966/16918417/d4d533ce-4d37-11e6-92ec-1e13ad5e15d6.png)


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
        //API地址: https://github.com/stormtea123/iMoney/wiki
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

[https://github.com/stormtea123/iMoney/wiki](https://github.com/stormtea123/iMoney/wiki)

