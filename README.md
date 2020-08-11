### webpack多页面打包模板

#### 打包前后目录结构效果

![打包前](https://raw.githubusercontent.com/Jiuto/webpack_template/master/img-folder/before.png)

>打包目标为src目录，src目录下又分三类：
第一类如api这类文件夹，属于直接复制即可，此外还有一些静态资源如images等；
第二类是components文件夹，下分为commom/personalCenter/shoppingMall等二级目录，即公共组件/个人中心组件/商城组件，每个二级目录下即是各自的组件；
第三类是pages，即业务文件夹，下分为对应的personalCenter/shoppingMall等二级目录，即个人中心模块/商城模块，每个模块目录下的index文件即该模块主页，子目录如productDetails文件即商品模块子页面的商品详情；

![打包后](https://raw.githubusercontent.com/Jiuto/webpack_template/master/img-folder/before.png)

>打包后的文件输入在dist文件夹下：
第一类文件直接复制到dist文件，第二类文件保留components目录结构，第三类文件仅保留模块目录结构，如，
dist/api/service.js
dist/components/common/demo/index.html
dist/shoppingMall/index.html
dist/shoppingMall/productDetails/index.html

#### 页面引入组件和样式

##### 组件写法

`商品组件html：src/components/shoppingMall/demo/index.html`
```
<div class="demo">
    this is shoppingMall components demo
</div>
```
`商城组件css：src/components/shoppingMall/demo/index.css`

```
.demo {
    color: green;
}
```

##### 页面引入

`商品详情页html：src/pages/shoppingMall/productDetails/index.html`
```
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
`商城详情页css：src/pages/shoppingMall/productDetails/index.css`

```
@import "~components/shoppingMall/demo/index.css";
body {
    background-color: gold;
}
```
`商城详情页js：src/pages/shoppingMall/productDetails/index.js`

```
import './index.css'
```

##### webpack配置

`在webpackUtils.js文件中配置入口文件如下`
```
// 可配置的入口文件
const pagesFile = ['shoppingMall', 'personalCenter'];
const componentsFile = ['components'];
```
