iMoney
===============

`iMoney.js`是一个移动端基础脚本框架。压缩版(10kb)

    //开发版
    <script src="http://imoney.w3cmm.com/1.1.0/imoney.js"></script>
    //压缩版
    <script src="http://imoney.w3cmm.com/1.1.0/imoney.min.js"></script>

快速上手

    <script src="http://imoney.w3cmm.com/1.1.0/imoney.min.js"></script>
    <script>
      $.require.config({
        baseUrl: "/another/path",
        paths: {
            "some": "some/v1.0"
        },
        waitSeconds: 15
      });
      $.require(["module"],function(module){
          console.log(module.color+'----'+module.size)
          $("#button").html( "Next Step..." );
      })
    </script>

下载示例代码

API `imoney.w3cmm.com`

##基础方法

    //选择id为main的元素
    $("#main")
    //选择class为main的元素
    $(".main")
    
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

    urlArgs: "bust=" +  (new Date()).getTime()

例如：

    $.config({
        //基础路径
        baseUrl:'module/'
    })

#####定义模块

例如：新建`module.js`，`module.js`依赖`run.js`，则

    $.define(["run"],function(run) {
        console.log("module");
        return {
            color: "red",
            size: "unisize"
        }
    });

#####使用模块

例如：依赖module.js，

    $.require(["module"],function(module){
        console.log(module.color+'----'+module.size)
    })