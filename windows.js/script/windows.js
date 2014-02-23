var windows = {};
windows.properties = {};
windows.internal = {};
windows.internal.f = {};
windows.internal.cw = {};
windows.internal.maxed = [];
windows.openWindows = [];
windows.load = function (enclosure) {
    windows.properties.enclosure = $(enclosure);
    $(window).mouseup(windows.internal.f.globalMouseUp);
    $(window).mousemove(windows.internal.f.globalMouseMove);
    $(window).resize(windows.internal.f.globalResized)
};
windows.openWindow = function(title, hide, maximise, close, icon) {
    var window, tb, tb_title, tb_hide, tb_maximise, tb_close, tb_icon;
    window = $('<div/>', { class: 'window', id: windows.internal.guid()});
    tb = $('<div/>', { class: 'tb' }).appendTo(window);
    if (icon) tb_icon = $('<img/>', { class: 'icon', src: icon }).appendTo(tb);
    if (close) tb_close = $('<div/>', { class: 'close' }).appendTo(tb);
    if (maximise) tb_maximise = $('<div/>', { class: 'maximise' }).appendTo(tb);
    if (hide) tb_hide = $('<div/>', { class: 'hide' }).appendTo(tb);
    tb_title = $('<div/>', { class: 'title', text: title }).appendTo(tb);
    $('<div/>', { class: 'clear' }).appendTo(tb);
    $('<div/>', { class: 'content' }).appendTo(window);
    tb_close.click(windows.internal.f.wintbCloseClick);
    tb_maximise.click(windows.internal.f.wintbMaxClick);
    tb.mousedown(windows.internal.f.wintbMouseDown);
    window.mousedown(windows.internal.f.winMouseDown);
    windows.openWindows.push(window);
    window.appendTo(windows.properties.enclosure);
};
windows.internal.f.wintbMouseDown = function(e) {
    var sw = $(this).parents(".window");
    var swot = sw.offset();
    windows.internal.cw.cw = sw;
    windows.internal.cw.cl = e.pageX - swot.left;
    windows.internal.cw.ct = e.pageY - swot.top;
};
windows.internal.f.winMouseDown = function(e) {
    $(windows.openWindows).each(function () {
        $(this).css({ 'z-index': 0 });
    });
    $(this).css({ 'z-index': 1 });
};
windows.internal.f.wintbCloseClick = function (e) {
    $(this).parents('.window').fadeOut(100, function () {
        $(this).remove();
        windows.internal.removeWindow($(this));
    });
};
windows.internal.f.wintbMaxClick = function (e) {
    var win = $(this).parents('.window');
    win.find("> .tb > .maximise").removeClass("maximise").addClass("restore");
    win.css({
        top: windows.properties.enclosure.offset().top,
        left: windows.properties.enclosure.offset().left,
        width: windows.properties.enclosure.width() - parseInt(win.css("border-left-width")) - parseInt(win.css("border-right-width"))
        - parseInt(win.css("padding-left")) - parseInt(win.css("padding-right")),
        height: windows.properties.enclosure.height() - parseInt(win.css("border-top-width")) - parseInt(win.css("border-bottom-width"))
        - parseInt(win.css("padding-top")) - parseInt(win.css("padding-top")),
    });
    
    windows.internal.maxed.push(win);
};
windows.internal.f.globalMouseUp = function () {
    windows.internal.cw = {};
};
windows.internal.f.globalMouseMove = function (e) {
    if (windows.internal.cw != null) {
        $(windows.internal.cw.cw).css({
            top: e.pageY - windows.internal.cw.ct,
            left: e.pageX - windows.internal.cw.cl,
            position: 'absolute'
        });
    }
};
windows.internal.f.globalResize = function (e) {
    windows.internal.f.wintbMaxClick();
};
windows.internal.removeWindow = function(win) {
    for (var i = 0; i < windows.openWindows.length; i++)
        if (windows.openWindows[i].is(win))
            windows.openWindows.splice(i, 1);
};
windows.internal.guid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};