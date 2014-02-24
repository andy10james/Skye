var windows = {};
windows.properties = {};
windows.internal = {};
windows.internal.f = {};
windows.internal.cw = {};
windows.maxedWindows = [];
windows.hiddenWindows = [];
windows.allWindows = [];
windows.load = function (enclosure, animation_ms) {
    windows.properties.enclosure = $(enclosure);
    windows.properties.anims = animation_ms;
    windows.properties.enclosure.addClass("win-js-enclosure");
    $(window).mouseup(windows.internal.f.globalMouseUp);
    $(window).mousemove(windows.internal.f.globalMouseMove);
    $(window).resize(windows.internal.f.globalResize);
};
windows.open = function(title, top, left, width, height, hide, maximise, close, icon) {
    var win, tb, tb_title, tb_hide, tb_maximise, tb_close, tb_icon;
    win = $('<div/>', { class: 'window', id: windows.internal.guid() });
    win.css({ top: top, left: left, width: width, height: height });
    tb = $('<div/>', { class: 'tb' }).appendTo(win);
    if (icon) tb_icon = $('<img/>', { class: 'icon', src: icon }).appendTo(tb);
    if (close) tb_close = $('<div/>', { class: 'close' }).appendTo(tb);
    if (maximise) tb_maximise = $('<div/>', { class: 'state' }).appendTo(tb);
    if (hide) tb_hide = $('<div/>', { class: 'hide' }).appendTo(tb);
    tb_title = $('<div/>', { class: 'title', text: title }).appendTo(tb);
    $('<div/>', { class: 'clear' }).appendTo(tb);
    $('<div/>', { class: 'content' }).appendTo(win);
    if (close) tb_close.click(windows.internal.f.wintbCloseClick);
    if (close && icon) tb_icon.dblclick(windows.internal.f.wintbCloseClick);
    if (maximise) tb_maximise.click(windows.internal.f.wintbMaxClick);
    if (maximise) tb_title.dblclick(windows.internal.f.wintbMaxClick);
    if (hide) tb_hide.click(windows.internal.f.wintbHideClick);
    tb.mousedown(windows.internal.f.wintbMouseDown);
    win.mousedown(windows.internal.f.winMouseDown);
    win.hide().appendTo(windows.properties.enclosure);
    windows.allWindows.push(win);
    windows.bringToFront(win);
    win.fadeIn(windows.properties.anims);
};
windows.max = function (win) {
    if (windows.isMaxedWindow(win)) return;
    win.addClass("maxed");
    win.data("res-t", win.offset().top);
    win.data("res-l", win.offset().left);
    win.data("res-w", win.width());
    win.data("res-h", win.height());
    windows.internal.animateToMax(win);
    if (!windows.isMaxedWindow(win))
        windows.maxedWindows.push(win);
};
windows.res = function (win) {
    if (!windows.isMaxedWindow(win)) return;
    windows.internal.removeMaxedWindow(win);
    win.removeClass("maxed");
    win.stop();
    win.animate({
        top: win.data("res-t"),
        left: win.data("res-l"),
        width: win.data("res-w"),
        height: win.data("res-h")
    }, windows.properties.anims);
    win.data("res-t", null);
    win.data("res-l", null);
    win.data("res-w", null);
    win.data("res-h", null);
};
windows.resTo = function (win, css) {
    if (!windows.isMaxedWindow(win)) return;
    windows.internal.removeMaxedWindow(win);
    win.removeClass("maxed");
    win.stop();
    win.animate(css, windows.properties.anims);
    win.data("res-t", null);
    win.data("res-l", null);
    win.data("res-w", null);
    win.data("res-h", null);
};
windows.hide = function (win) {
    if (windows.isHiddenWindow(win)) return;
    win.fadeOut(windows.properties.anims);
    windows.hiddenWindows.push(win);
};
windows.show = function (win) {
    if (!windows.isHiddenWindow(win)) return;
    win.fadeIn(windows.properties.anims);
    windows.internal.removeHiddenWindow(win);
};
windows.close = function (win) {
    win.fadeOut(
        windows.properties.anims,
        function () {
            $(this).remove();
            windows.internal.removeWindow($(this));
        });
};
windows.bringToFront = function (win) {
    var winIndex = win.css('z-index') - 1;
    $(windows.allWindows).each(function (i) {
        var curIndex = $(this).css('z-index');
        if ($(this).css('z-index') > winIndex)
            $(this).css({ 'z-index': curIndex - 1 });
    });
    win.css({ 'z-index': windows.allWindows.length });
};
windows.isMaxedWindow = function (win) {
    for (var i = 0; i < windows.maxedWindows.length; i++)
        if (windows.maxedWindows[i].is(win))
            return true;
    return false;
};
windows.isHiddenWindow = function (win) {
    for (var i = 0; i < windows.hiddenWindows.length; i++)
        if (windows.hiddenWindows[i].is(win))
            return true;
    return false;
};
windows.internal.f.wintbMouseDown = function(e) {
    var sw = $(this).parents(".window");
    var swot = sw.offset();
    windows.internal.cw.cw = sw;
    windows.internal.cw.ct = e.pageY - swot.top;
    if (!windows.isMaxedWindow(sw)) windows.internal.cw.cl = e.pageX - swot.left;
    else windows.internal.cw.cl = sw.data("res-w") / 2;
};
windows.internal.f.winMouseDown = function(e) {
    windows.bringToFront($(this));
};
windows.internal.f.wintbCloseClick = function (e) {
    var win = $(this).parents(".window");
    windows.close(win);
};
windows.internal.f.wintbMaxClick = function (e) {
    var win = $(this).parents('.window');
    if (windows.isMaxedWindow(win)) windows.res(win);
    else windows.max(win);
};

windows.internal.f.wintbHideClick = function (e) {
    var win = $(this).parents(".window");
    windows.hide(win);
};
windows.internal.f.globalMouseUp = function () {
    windows.internal.cw = {};
};
windows.internal.f.globalMouseMove = function (e) {
    if (windows.internal.cw.cw != null) {
        var win = windows.internal.cw.cw;
        if (windows.isMaxedWindow(win)) {
            windows.resTo(win, {
                    width: win.data("res-w"),
                    height: win.data("res-h")
                });
        }
        win.css({
            top: e.pageY - windows.internal.cw.ct,
            left: e.pageX - windows.internal.cw.cl,
            position: 'absolute'
        });
    }
};
windows.internal.f.globalResize = function (e) {
    for (var i = 0; i < windows.maxedWindows.length; i++)
        windows.internal.animateToMax(windows.maxedWindows[i]);
};
windows.internal.animateToMax = function (win) {
    win.stop();
    win.animate({
        top: windows.properties.enclosure.offset().top,
        left: windows.properties.enclosure.offset().left,
        width: windows.properties.enclosure.width() - parseInt(win.css("border-left-width")) - parseInt(win.css("border-right-width"))
        - parseInt(win.css("padding-left")) - parseInt(win.css("padding-right")),
        height: windows.properties.enclosure.height() - parseInt(win.css("border-top-width")) - parseInt(win.css("border-bottom-width"))
        - parseInt(win.css("padding-top")) - parseInt(win.css("padding-top")),
    }, windows.properties.anims);
};
windows.internal.removeMaxedWindow = function (win) {
    for (var i = 0; i < windows.maxedWindows.length; i++)
        if (windows.maxedWindows[i].is(win))
            windows.maxedWindows.splice(i, 1);
};
windows.internal.removeHiddenWindow = function (win) {
    for (var i = 0; i < windows.hiddenWindows.length; i++)
        if (windows.hiddenWindows[i].is(win))
            windows.hiddenWindows.splice(i, 1);
};
windows.internal.removeWindow = function (win) {
    windows.internal.removeMaxedWindow(win);
    for (var i = 0; i < windows.allWindows.length; i++)
        if (windows.allWindows[i].is(win))
            windows.allWindows.splice(i, 1);
};
windows.internal.guid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};