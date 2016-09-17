/**
 * Created by SW on 2016/6/9.
 */

//实现登录交互功能；
//原生实现一遍，JQ实现一遍；

//*************原生JS

(function () {
    //第一导航处

        //var registerBtn = document.querySelector("#register");
        //var loginBtn = document.querySelector("#login");
        //
        //loginBtn.onclick = function (e) {
        //    e.target.classList.toggle("active");
        //};
        //registerBtn.onclick = function (e) {
        //    e.target.classList.toggle("active");
        //}
    var parentBtn = document.querySelector(".tab-nav-center");
    var btn = parentBtn.querySelectorAll("a");
    var show_line = parentBtn.nextElementSibling;
    var loginA = document.querySelector(".signInform");
    var registerB = document.querySelector(".signUpform");
    var weiboBtn = document.querySelector(".weibo-signup-wrapper");
    var QRCodeBtn = document.querySelectorAll(".QRCode-toggleButton");

    btn[0].onclick = function (e) {
        btn[0].classList.add("active");
        btn[1].classList.remove("active");
        show_line.classList.add("nav-bottom-leftmove");
        loginA.style.display = "none";
        registerB.style.display = "block";
    };
    btn[1].onclick = function (e) {
        btn[0].classList.remove("active");
        btn[1].classList.add("active");
        show_line.classList.remove("nav-bottom-leftmove");
        loginA.style.display = "block";
        registerB.style.display = "none";
    };

    var pd = true;

    weiboBtn.firstElementChild.onclick = function (e) {
        if(pd == true) {
            weiboBtn.lastElementChild.style.visibility = "visible";
            weiboBtn.lastElementChild.classList.add("isVisible");
            pd = false;
        } else {
            weiboBtn.lastElementChild.style.visibility = "hidden";
            weiboBtn.lastElementChild.classList.remove("isVisible");
            pd = true;
        }

    };

    var QRCodeCard = document.querySelectorAll(".QRCode-card");
    for(var i = 0; i < QRCodeBtn.length; i++) {
        ( function (j) {
            QRCodeBtn[j].onclick = function (e) {
                if(pd == true) {
                    QRCodeCard[j].style.display = "block";
                    pd = false;
                } else {
                    QRCodeCard[j].style.display = "none";
                    pd = true;
                }
            };
        })(i);
    }
})();



