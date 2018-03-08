var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');  // 引入html-webpack-plugin插件打包生成html
var CleanWebpackPlugin = require('clean-webpack-plugin');  // 引入clean-webpack-plugin插件打包先清除dist，而不是覆盖
var ExtractTextPlugin = require("extract-text-webpack-plugin");  // 引入extract-text-webpack-plugin抽取样式放到HTML中
var webpack=require('webpack');

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
        rules:[
            {
                test:/\.css$/,
                include:path.join(__dirname,'src'),
                exclude:/node_modules/,
                // loader:'style-loader!css-loader'  // 以<style>形式插入到html
                use:ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test:/\.js$/,
                include:path.join(__dirname,'src'),
                exclude:/node_modules/,
                loader:'babel-loader'
            }
        ]
    },

    // js文件的合并，HTML的生成，插件等等
    plugins:[

        // html-webpack-plugin插件配置
        new HtmlWebpackPlugin({   // 多个入口要配置多个
            filename:'index.html',
            template:'./src/index.html',
            chunks:['index'],   // 分块，使得打包后的页面只加载对应的js等

            minify:{    // 压缩打包后的html文件
                removeComments:true,  // 删除注释
                collapseWhitespace:true  // 清除空格
            }
        }),
        new HtmlWebpackPlugin({
            filename:'cart.html',
            template:'./src/cart.html',
            chunks:['cart']
        }),


        // clean-webpack-plugin插件配置
        new CleanWebpackPlugin(['./dist'],{
            root:path.join(__dirname,''),
            verbose:true,
            dry:false
        }),

        // extract-text-webpack-plugin插件
        new ExtractTextPlugin("index.css"),

        // jquery
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),

        // 压缩打包后的js文件
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings:true
            }
        })



    ]

    // devtool:'#source-map'   //开发工具，对打包的文件进一步解析，进行输出，以什么格式进行输出；方便调试的时候用到

};

