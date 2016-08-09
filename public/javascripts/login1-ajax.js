/**
 * Created by SW on 2016/6/10.
 */

(function () {

    /**
     * 获取XMLHttpRequest对象；
     * IE是有不同的对象的，是ActiveXObject对象；
     * Ajax是异步请求；
     * onreadystatechange事件来调用回调函数；
     * 并且检测请求对象的两个属性
     * readystate和status这两个属性；
     * @returns {*}
     */
    function getXHR() {
        var request;
        if(window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return request;
    }

    //var request = getXHR();
    //表单登录Ajax
    $(function () {
        $(".signInform button").click(function (e) {
            e.preventDefault();
            var datas = $(".signInform").serialize();
            //这里url要注意，直接写路由，不要写
            $.post("/login",datas, function (data) {
                    //NodeJS 怎么返回数据给Ajax呢？
                $("#content").html(data);
            })
        });



        $("#loading").ajaxStart(function () {
            $(this).show();
        });
        $("#loading").ajaxStop(function () {
            $(this).hide();
        });

    });







})();