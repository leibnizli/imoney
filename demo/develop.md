定义模块之全局队列推入

* 添加配置包支持
* 配置包路径baseUrl矫正
* 分析入口文件依赖模块，异步注入script标签，为script添加数据标记
* 检测script的load与error事件
* 被依赖单模块加载完成后补充模块配置，检测该模块依赖的模块，执行回调传入依赖模块。
* 主文件模块队列完成后执行回调，分别传入模块返回状态。
* 模块定义与依赖回调整体流程跑通
* 待处理对可选配置包做路径教程等其它处理

参数处 path、url

模块结尾可加参数例如时间戳

    urlArgs: 't='+ Date.now()

* 如加载出错，不同场景下err对象的抛出
* 定义内部模块功能支持
* baseUrl+paths相结合都模块路径支持

增加API

    hasClass()
    addClass()
    removeClass()
    attr()
    removeAttr()
    html()
    data()
    css();
    $.parseJSON()

