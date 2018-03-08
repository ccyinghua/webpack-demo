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