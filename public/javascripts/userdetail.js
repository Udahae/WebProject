$(function($){
    $('.indicator > ul> li > a').click(function(e) {
        var $item = $(e.currentTarget).parent();
        var $point = $item.closest(".indicator");
        $point.find('>ul>li').removeClass('active');
        $item.addClass('active');
    });
});