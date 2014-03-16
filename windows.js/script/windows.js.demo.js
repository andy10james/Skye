$(document).ready(function() {
	windows.load({
		enclosure: '.enclosure',
		boundary: -50,
		maxToBoundary: true,
		speed: 300
	});
	$("#context #createWindow").click(function (e) {
		windows.open({
			title: 'You created a window!',
			top: (windows.settings.enclosure.height() / 2) - 150,
			left: (windows.settings.enclosure.width() / 2) - 450,
			width: 900,
			height: 300,
			hide: true,
			state: true,
			close: true,
			movable: true,
			modal: false,
			icon: 'content/ico.ico'
		});
	});
	$("#context #createModalWindow").click(function (e) {
		windows.open({
			title: 'You created a modal window!',
			top: (windows.settings.enclosure.height() / 2) - 120,
			left: (windows.settings.enclosure.width() / 2) - 300,
			width: 600,
			height: 240,
			hide: false,
			state: false,
			close: true,
			movable: false,
			modal: true,
			icon: null
		});
	});
	$("#context #createFlexibleModalWindow").click(function (e) {
		windows.open({
			title: 'You created a flexible modal window!',
			top: (windows.settings.enclosure.height() / 2) - 270,
			left: (windows.settings.enclosure.width() / 2) - 200,
			width: 400,
			height: 540,
			hide: true,
			state: true,
			close: true,
			movable: true,
			modal: true
		});
	});
	$(window).contextmenu(function (e) {
		return false;
	});

	//$("#splash").show();
	//setTimeout(startSplash, 1000);
	function startSplash() {
		$("#splash img").fadeIn(2000);
		$("#splash audio")[0].play();
		setTimeout(endSplash, 4000);
	}
	function endSplash() {
		$("#splash img").fadeOut(2000);
		setTimeout(exitSplash, 2000);
	}
	function exitSplash() {
		$("#splash").fadeOut(2000);
	}
});
$(window).mousemove(function (e) {
	$("span#mleft").html(e.pageX);
	$("span#mtop").html(e.pageY);
	$("span#rbound").html(windows.settings.enclosure.width() + windows.settings.boundary);
	$("span#lbound").html(windows.settings.enclosure.offset().left - windows.settings.boundary);
	$("span#tbound").html(windows.settings.enclosure.offset().top - windows.settings.boundary);
	$("span#bbound").html(windows.settings.enclosure.height() + windows.settings.boundary);
	$("span#svisible").html(windows.snapPossible || "false");
});