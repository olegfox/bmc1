function checkTime() {
    var hour = (new Date()).getHours(); 

    if(hour > 0 && hour < 8) {
        $('body').removeClass('dark');
    } else {
        $('body').addClass('dark');
    }

    setTimeout(function() {
        checkTime();
    }, 5000);
}

function scrolling() {
    if ($(document).scrollTop() > 100) {
        $(".navbar-action").css({
            "position": "fixed",
            "top": 0
        });
    } else {
        $(".navbar-action").css({
            "position": "absolute",
            "top": "125px"
        });
    }

    $(".container").each(function () {
        var window_top = $(window).scrollTop();
        var div_top = $(this).offset().top;
        var div_1 = $(this).attr('id');
        if (window_top > div_top - 100) {
            $('.navbar-default').find('a').removeClass('select');
            $('.navbar-default').find('a[href="#' + div_1 + '"]').addClass('select');
        } else {
            $('.navbar-default').find('a[href="#' + div_1 + '"]').removeClass('select');
        }
    });
    if (!$("body").hasClass("ps-active")) {
        $(".container").each(function (index, element) {
            if ($(element).find(".text").length > 0 && index > 1) {
                if ($(element).find(".text").height() < window.innerHeight && $(element).find(".flexslider").length <= 0) {
                    $(element).find(".text").css({
                        "height": window.innerHeight - 50
                    });
                }
            }
        });
    }
}
$(function () {
    var countImg = $(".container img").length;
    var ct = 0;
    $(".container img").one('load',function () {
        ct++;
        if (ct >= countImg) {
            $(".container").each(function (index, element) {
                if ($(element).find(".text").length > 0 && index > 1) {
                    if ($(element).find(".text").height() < window.innerHeight && $(element).find(".flexslider").length <= 0) {
                        $(element).find(".text").css({
                            "height": window.innerHeight - 50
                        });
                    } else {
                        if ($(element).find(".flexslider").length > 0) {
                            setTimeout(function () {
                                if ($(element).height() < window.innerHeight) {
                                    $(element).find(".text").css({
                                        "height": window.innerHeight - 50
                                    });
                                }
                            }, 2000);
                        }
                    }
                }
            });
        }
    }).each(function () {
            if (this.complete) $(this).load();
        });
    if ($('.glavnaya-bg').width() < 940) {
        $('.glavnaya-bg img').css({
            "margin-left": "-120px"
        });
    } else {
        $('.glavnaya-bg img').css({
            "margin-left": "0px"
        });
    }
    if (!document.addEventListener) {
        window.onscroll = scrolling;
    }
    else {
        document.addEventListener("touchstart", scrolling, false);
        document.addEventListener("touchmove", scrolling, false);
        document.addEventListener("touchend", scrolling, false);
        document.addEventListener("scroll", scrolling, false);
    }
    $(window).scrollTop(1);
    $("#glavnaya").attr("id", "");

    $(".container#glavnaya, .container#glavnaya .glavnaya-bg").css({
        "height": window.innerHeight / 2 - 175
    });
    $(".container#glavnaya .glavnaya-bg img").css({
        "height": "90%"
    });
    setTimeout(function () {
        $(".container#glavnaya .glavnaya-bg img").css({
            "height": "100%"
        });
    }, 200);
    $(".container#katalog_produktsii").css({
        "height": window.innerHeight - $(".container#glavnaya").height() - 175
    });
    $($(".container").get(0)).attr("id", "glavnaya");
    $(".navbar-header a, .navbar-nav a").click(function (e) {
        e.preventDefault();
        id = $(this).attr("href");
        $(this).addClass("select");
        //$(".navbar-nav a").removeClass("select");
        top_ = 50;
        $(".navbar").removeClass("navbar-action");
        if (id == "#glavnaya") {
            top_ = 125;
            $(".navbar").css({
                "position": "fixed"
            });
            $(".navbar").animate({"top": 125}, 1000, function () {
                $(".navbar").addClass("navbar-action");
                $(".navbar").css({
                    "position": "absolute"
                });
            });
        } else {
            $(".navbar").css({
                "position": "fixed"
            });
            $(".navbar").animate({"top": 0}, 1000, function () {
                $(".navbar").addClass("navbar-action");
            });

        }
        $("html,body").animate({"scrollTop": $(id).offset().top - top_}, 1000);
    });
    $(window).resize(function () {
        if ($('.glavnaya-bg').width() < 940) {
            $('.glavnaya-bg img').css({
                "margin-left": "-120px"
            });
        } else {
            $('.glavnaya-bg img').css({
                "margin-left": "0px"
            });
        }
        $(".container").each(function (index, element) {
            if ($(element).find(".text").length > 0 && index > 1) {
                if ($(element).find(".text").height() < window.innerHeight) {
                    $(element).find(".text").css({
                        "height": window.innerHeight - 50
                    });
                }
            }
        });
        $(".container#glavnaya, .container#glavnaya .glavnaya-bg").css({
            "height": window.innerHeight / 2 - 175
        });
        $(".container#katalog_produktsii").css({
            "height": window.innerHeight - $(".container#glavnaya").height() - 175
        });
    });
})
;

checkTime();