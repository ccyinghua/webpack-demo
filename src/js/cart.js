// // 原js
// require(['./common.js'],function(common){
//     common.initCart();
// })



// 引入jquery插件第二种测试
require(['./common.js'],function(common){
    common.initCart();
    $(function(){
        console.log("this is jquery cart");
    })
})


