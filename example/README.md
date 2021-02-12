### webpack多页面打包模板

#### 打包前后目录结构效果

1. 打包目标为src目录，src目录下又分两类：

第一类如api这类文件夹，属于直接复制即可，此外还有一些静态资源如images等；

第二类是pages，即业务文件夹，下分为对应的personalCenter、shoppingMall等二级目录，即个人中心模块/商城模块，每个模块目录下的index文件即该模块主页，子目录如productDetails文件即商品模块子页面的商品详情；

2. 打包后的文件输入在dist文件夹下：

第一类文件直接复制到dist文件，第二类文件仅保留模块目录结构（不再有src/pages层），如，

dist/api/service.js

dist/shoppingMall/index.html

dist/shoppingMall/productDetails/index.html


#### 页面引入组件和样式

##### 组件写法

商品组件html：`src/components/shoppingMall/demo/index.html`

``` html
<div class="demo">
    this is shoppingMall components demo
</div>
```

商城组件css：`src/components/shoppingMall/demo/index.css`

``` css
.demo {
    color: green;
}
```

##### 页面引入

商品详情页html：`src/pages/shoppingMall/productDetails/index.html`

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <%= require('raw-loader!components/shoppingMall/demo/index.html') %>
</body>
</html>
```

商城详情页css：`src/pages/shoppingMall/productDetails/index.css`

``` css
@import "~components/shoppingMall/demo/index.css";
body {
    background-color: gold;
}
```

商城详情页js：`src/pages/shoppingMall/productDetails/index.js`

``` js
import './index.css'
```

##### webpack配置

引入webpack-utils，本示例中即`const utils = require('../index.js');`

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 给setEntryAndHtmlPlugin方法传入pages目录命数组，其中首页需放在名为home的文件夹下
const pagesFile = ['shoppingMall', 'personalCenter', 'home'];
const { entry, htmlWebpackPlugins } = utils.setEntryAndHtmlPlugin(pagesFile);
// webpack配置入口和插件
module.exports = {
    entry: entry,
    plugins: [].concat(htmlWebpackPlugins.map(html=>{return new HtmlWebpackPlugin(html)})),
}
```
