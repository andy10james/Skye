$(document).ready(function() {

    /* Skye buttons */
    skye.load({
        enclosure: '.enclosure',
        boundary: 0,
        maxToBoundary: true,
        speed: 300
    });
    $('.taskbar nav #create').click(function () {
        skye.create({
            title: 'You created a skye!',
            icon: 'content/ico.ico'
        });
    });
    $('.taskbar nav #createModal').click(function () {
        skye.create($.extend(skye.presets.message, {
            title: 'You created a modal skye!',
            icon: 'content/ico.ico'
        }));
    });
    $('.taskbar nav #closeAll').click(function () {
        skye.closeAll();
    });
    /* / Skye buttons */

    $('.taskbar .openmenu').click(function () {
        var nav = $('nav');
        var btn = $(this);
        var isOpen = nav.is(':visible');
        (isOpen ? nav.hide : nav.show).call(nav, "slide", {direction: 'right', speed: 300});
        (isOpen ? btn.show : btn.hide).call(btn, "slide", {direction: 'left', speed: 300});
    });

    $(window).click(function (e) {
        if (!$(e.target).is('.taskbar .openmenu') && $('nav').is(':visible')) {
            $('.taskbar .openmenu').click();
        }
    });

    $(window).contextmenu(function () {
        return false;
    });

    var showSplash = true;
    if (localStorage) {
        if (localStorage.getItem("SeenSplash") == "true") {
            showSplash = false;
        }
    }
    if (showSplash) {
        $(".splash").show();
        setTimeout(startSplash, 500);
    }
	function startSplash() {
		$(".splash").find(".information").fadeIn(1000);
		setTimeout(endSplash, 5000);
	}
	function endSplash() {
		$(".splash").find(".information").fadeOut(1000);
		setTimeout(exitSplash, 1500);
	}
	function exitSplash() {
		$(".splash").fadeOut(2000);
        if (localStorage) {
            localStorage.setItem("SeenSplash", true);
        }
	}

});
$(window).mousemove(function (e) {
	$("span#mleft").html(e.pageX);
	$("span#mtop").html(e.pageY);
	$("span#rbound").html(skye.settings.enclosure.width() + skye.settings.boundary);
	$("span#lbound").html(skye.settings.enclosure.offset().left - skye.settings.boundary);
	$("span#tbound").html(skye.settings.enclosure.offset().top - skye.settings.boundary);
	$("span#bbound").html(skye.settings.enclosure.height() + skye.settings.boundary);
	$("span#svisible").html(skye.snapPossible || "false");
});