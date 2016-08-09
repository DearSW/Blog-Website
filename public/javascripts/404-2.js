/**
 * Created by SW on 2016/6/12.
 */

$(function () {

    $("#actions").click(function (e) {
        $("#actions img:eq(0)").animate({
            opacity: "1"
        },1000, function () {
            $(this).css("opacity","0.5")
        });
        $("#actions img:eq(1)").animate({
            opacity: "1",
            left: "70%"
        },3000,function () {
            $(this).css("opacity","0.5")
        });
        $("#actions img:eq(2)").animate({
            opacity: "1",
            left: "30%"
        },5000,function () {
            $(this).css("opacity","0.5")
        });
        $("#actions img:eq(3)").animate({
            opacity: "1",
            top: "60%"
        },7000,function () {
            $(this).css("opacity","0.5")
        });
        $("#actions img:eq(4)").animate({
            opacity: "1",
            top: "15%"
        },7000,function () {
            $(this).css("opacity","0.5")
        });
    })

});