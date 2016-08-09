/**
 * Created by SW on 2016/6/27.
 */
;(function ($) {
    $.fn.accordion = function (speed) {
        this.on("click",".accordion-control", function (e) {
            e.preventDefault();
            $(this)
                .next()
                .not(":animated")
                .slideToggle(speed);
        })
    }
})(jQuery);
//demo
//$(".accordion").accordion(200);