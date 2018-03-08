## webpack多页面构建

项目列表
```javascript
|-- readme文件夹 --// 放置README.md说明文件的图片，项目中可删除的
|-- src
    |-- css
    |-- js
        |-- index.js
        |-- common.js
        |-- cart.js
    |-- index.html
    |-- cart.html
|-- .babelrc
|-- package.json
|-- webpack.config.js --// 配置文件
```

### 一、建立webpack-demo文件夹构建静态文件

webpack/src/index.html

```html
<h1>我是首页</h1>
<a href="cart.html">到购物车页面</a>
```
webpack/src/cart.html

```html
<h1>这是购物车页面</h1>
<a href="index.html">回到首页</a>
```
webpack/src/js/common.js

```javascript
// requireJS的规范AMD来定义通用模块
define('common',function(){
    return {
        initIndex:function(){
            console.log("common init index");
        },
        initCart:function(){
            console.log("common init cart");
        }
    }
})
```
webpack/src/js/index.js

```javascript
require(['./common.js'],function(common){
    common.initIndex();
})
```

webpack/src/js/cart.js

```javascript
require(['./common.js'],function(common){
    common.initCart();
})
```
### 二、webpack.config.js配置

```javascript
var path = require('path');

module.exports = {
    entry: {      // 多页面就有多个入口
        index:'./src/js/index.js',
        cart:'./src/js/cart.js'
    },
    output: {
        // path:'./dist',   // 指定输出路径
        path:path.join(__dirname,'./dist'),   // 必须是绝对路径
        filename: 'js/[name].js',   // 打包后的文件名,多个入口打包的文件名不一样，所以文件名要是动态的
        publicPath: ''  // 全局引用的文件
    },

    module:{  // module模块；解析一些webpack不认识的文件

    },

    // js文件的合并，HTML的生成，插件等等
    plugins:[

    ]

    // devtool:'#source-map'   //开发工具，对打包的文件进一步解析，进行输出，以什么格式进行输出；方便调试的时候用到

};
```

### 三、命令

```javascript
npm init  // 生成package.json

cnpm install webpack@3.3.0 --save-dev // 下载webpack

webpack  // 打包命令

```
打包成功后生成dist文件夹：0.js/index.js/cart.js


### 四、下载插件

> #### html-webpack-plugin帮助生成HTML

[https://www.npmjs.com/package/html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)

```javascript
cnpm i --save-dev html-webpack-plugin  // 帮助生成HTML的插件
```
webpack.config.js配置

```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    ......
    // js文件的合并，HTML的生成，插件等等
    plugins:[
        new HtmlWebpackPlugin({   // 多个入口要配置多个
            filename:'index.html',
            template:'./src/index.html'
        }),
        new HtmlWebpackPlugin({
            filename:'cart.html',
            template:'./src/cart.html'
        })
    ]
   ......

};
```
执行`webpack`打包命令成功后dist文件夹生成index.html和cart.html,但是两个页面都引用了`<script type="text/javascript" src="js/index.js"></script><script type="text/javascript" src="js/cart.js">`,这不符合，我们需要index.html只加载index.js;cart.html只加载cart.js。<br>
所以还需要配置分块，在打包时也可以看到对应的块<br>
![image](https://github.com/ccyinghua/webpack-demo/blob/master/readme/1.jpg?raw=true)

```javascript
webpack.config.js

plugins:[
    new HtmlWebpackPlugin({   // 多个入口要配置多个
        filename:'index.html',
        template:'./src/index.html',
        chunks:['index']
    }),
    new HtmlWebpackPlugin({
        filename:'cart.html',
        template:'./src/cart.html',
        chunks:['cart']
    })
]

```
再打包就可以了。运行打包后的dist/index.html和dist/cart.html

![image](https://github.com/ccyinghua/webpack-demo/blob/master/readme/2.jpg?raw=true)

![image](https://github.com/ccyinghua/webpack-demo/blob/master/readme/3.jpg?raw=true)

![image](https://github.com/ccyinghua/webpack-demo/blob/master/readme/4.jpg?raw=true)

![image](https://github.com/ccyinghua/webpack-demo/blob/master/readme/5.jpg?raw=true)

> #### clean-webpack-plugin打包时先清除dist而不是覆盖

[https://www.npmjs.com/package/clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)

```javascript
npm i clean-webpack-plugin --save-dev

```
webpack.config.js配置

```javascript
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    ......
    plugins:[
        // clean-webpack-plugin插件配置
        new CleanWebpackPlugin(['./dist'],{
            root:path.join(__dirname,''),
            verbose:true,
            dry:false
        })
    ]
   ......

};
```
> #### loader加载器

在src目录下建立css文件夹，css/index.css这是index.html的页面样式

```javascript
// src/js/index.js

import './../css/index.css'  // 导入css文件

```
下载loader

```javascript

// css-loader解析css文件
// style-loader把css文件转换成<style>行内的那种样式
cnpm install css-loader style-loader --save-dev 

```
webpack.config.js配置

```javascript
module.exports = {
    ......
    module:{  // module模块；解析一些webpack不认识的文件
        rules:[
            {
                test:/\.css$/,
                include:path.join(__dirname,'src'),
                exclude:/node_modules/,
                loader:'style-loader!css-loader'
            }
        ]
    },
   ......
};
```
![image](https://github.com/ccyinghua/webpack-demo/blob/master/readme/6.jpg?raw=true)

> #### extract-text-webpack-plugin 抽取css

[https://www.npmjs.com/package/extract-text-webpack-plugin](https://www.npmjs.com/package/extract-text-webpack-plugin)

前提是下载了style-loader和css-loader

```javascript
// extract-text-webpack-plugin插件是把style-loader处理的样式抽取放到HTML文件中去
cnpm install extract-text-webpack-plugin --save-dev

```
webpack.config.js配置

```javascript
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    ......
    module:{  // module模块；解析一些webpack不认识的文件
        rules:[
            {
                test:/\.css$/,
                include:path.join(__dirname,'src'),
                exclude:/node_modules/,
                use:ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    
    // js文件的合并，HTML的生成，插件等等
    plugins:[
        // extract-text-webpack-plugin插件
        new ExtractTextPlugin("index.css")
    ]
   ......

};
```
![image](https://github.com/ccyinghua/webpack-demo/blob/master/readme/7.jpg?raw=true)

> #### ES6

[http://babeljs.io/](http://babeljs.io/)

```
cnpm install babel-core babel-loader babel-preset-env --save-dev // babel-core是es6核心的文件，一定要有

```
建立.babelrc文件写配置

```javascript
{
  "presets": ["env"]
}
```

webpack.config.js配置

```javascript
module.exports = {
    ......
    module:{  // module模块；解析一些webpack不认识的文件
        rules:[
            {
                test:/\.js$/,
                include:path.join(__dirname,'src'),
                exclude:/node_modules/,
                loader:'babel-loader'
            }
        ]
    },
   ......
};
```
若项目js使用了ES6的语法，再打包就不会报错了

> #### jQuery插件

```
cnpm install jquery --save

```
直接用并不成功<br>
- 第一种：可以将src/index.js文件修改一下写法测试

```javascript
// 引入jquery插件测试
require(['./common.js','jquery'],function(common,$){
    common.initIndex();
    $(function(){
        console.log("this is jquery");
    })
})
```
打包之后，运行成功。jQuery被合并到0.js中了。<br>
![image](https://github.com/ccyinghua/webpack-demo/blob/master/readme/8.jpg?raw=true)

- 第二种：不用第一种写法，用webpack自带的插件实现全局

webpack.config.js配置

```javascript
var webpack=require('webpack');
module.exports = {
    ......
    plugins:[

        // jquery
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })

    ]
   ......
};
```
就直接使用jquery语法了

> #### 打包后的文件压缩插件

webpack.config.js配置

```javascript
var webpack=require('webpack');
module.exports = {
    ......
    plugins:[

        // html-webpack-plugin插件配置
        new HtmlWebpackPlugin({   
            .....
            minify:{    // 压缩打包后的html文件
                removeComments:true,  // 删除注释
                collapseWhitespace:true  // 清除空格
            }
        }),

        // 压缩打包后的js文件
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings:true
            }
        })

    ]
   ......
};
```
配置压缩之前打包<br>
![image](https://github.com/ccyinghua/webpack-demo/blob/master/readme/9.jpg?raw=true)<br>
配置之后打包<br>
![image](https://github.com/ccyinghua/webpack-demo/blob/master/readme/10.jpg?raw=true)

