iMoney
===============

`iMoney.js`是一个移动端基础脚本框架。

```html
//开发版(41kb）
<script src="http://imoney.w3cmm.com/1.1.0/imoney.js"></script>
//压缩版(gzip压缩8.9kb)
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
    //使用3模块
    //一个基于baseUrl的hello模块，一个基于baseUrl+paths规则定义的name模块，一个内部定义的wish模块
    $.require(["hello","name"], function(Hello,Name) {
        //此处可以使用类似Zepto的相关api进行业务逻辑操作
        //API地址: http://imoney.w3cmm.com/
        var $result = $("#result");
        $result.attr({
            title:"这里显示的是结果"
        });
        $("#result").html('<p>' + Hello.say + '</p><p>这里是' + Name.say + '</p>') ;
    });
    </script>
</body>

</html>
```

##API

[http://imoney.w3cmm.com](http://imoney.w3cmm.com)

##基础方法
```javascript
//选择id为main的元素
$("#main")
//选择class为main的元素
$(".main")
//选择所有的span元素
$("span")
//返回所有span元素的第2个DOM对象
$("span").get(1)
//选择id为main的元素的所有span元素
$("#main").find("span")
$("#main").find("span").first()
$("#main").find("span").last()
$("#main").find("span").eq(0)
$("#main").find("span").map(function(i,element){})
//是否包行指定样式
$("#main").hasClass(".demo");
//增加样式
$("#main").addClass(".demo")
//移除样式
$("#main").removeClass(".demo")
//获取属性
$("#main").attr("title")
//设置属性
$("#main").attr("title","标题")
//移除属性
$("#main").removeAttr("title")
//插入文字
$("#main").html("文字")
//设置data
$("#main").data("size","10")
//获取data
$("#main").data("size")
//操作样式
$("#main").css(["width","height"]);
$("#main").css("width":"100px");
$("#main").css({width:"100px",height:"100px"})
//json转化成对象
$.parseJSON()
$.isArray()
$.inArray()
$.isDocument()
$.isWindow()
//判断是否是数字
$.isNumeric()
$.type()
//是否单纯的对象
$.isPlainObject()
//是否空对象
$.isEmptyObject()
$.each(obj,function(){i,element})
//取时间戳
$.now()
```
    
##模块化

#####配置

`$.config(object)`,object有3个可选参数如下：


<table>
    <thead>
        <tr>
            <th>参数</th>
            <th>描述</th>
            <th>默认值</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>waitSeconds</td>
            <td>设置认为模块加载失败的秒数</td>
            <td>7</td>
        </tr>
        <tr>
            <td>baseUrl</td>
            <td>基础路径</td>
            <td>'./'</td>
        </tr>
        <tr>
            <td>paths</td>
            <td>映射那些不直接放置于baseUrl下的模块名</td>
            <td>{}</td>
        </tr>
        <tr>
            <td>urlArgs</td>
            <td>url参数，例如时间戳、查询参数</td>
            <td></td>
        </tr>
    </tbody>
</table>

例如：

```javascript
$.config({
    //基础路径
    baseUrl:'module/'
})
```
#####定义模块

例如：新建`module.js`，`module.js`依赖`run.js`，则

```javascript
$.define(["run"],function(run) {
    console.log("module");
    return {
        color: "red",
        size: "unisize"
    }
});
```

#####使用模块

例如：依赖module.js，

```javascript
$.require(["module"],function(module){
    console.log(module.color+'----'+module.size)
})
```