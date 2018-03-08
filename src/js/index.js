import './../css/index.css'  // 导入css文件
// // 原js
// require(['./common.js'],function(common){
//     common.initIndex();
// })


// // 引入ES6测试
// require(['./common.js'],(common)=>{
//     common.initIndex();
// })


// // 引入jquery插件第一种测试
// require(['./common.js','jquery'],function(common,$){
//     common.initIndex();
//     $(function(){
//         console.log("this is jquery");
//     })
// })

// 引入jquery插件第二种测试
require(['./common.js'],function(common){
    common.initIndex();
    $(function(){
        console.log("this is jquery index");
    })
})