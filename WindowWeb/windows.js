var windows = {};
windows.properties = {};
windows.internal = {};
windows.internal.f = {};
windows.internal.cw = {};
windows.openWindows = [];
windows.load = function (enclosure) {
    windows.properties.enclosure = $(enclosure);
    $(window).mouseup(function() {
        windows.internal.cw = {};
    });
    $(window).mousemove(function(e) {
        if (windows.internal.cw != null) {
            $(windows.internal.cw.cw).css({
                top: e.pageY - windows.internal.cw.ct,
                left: e.pageX - windows.internal.cw.cl,
                position: 'absolute'
            });
        }
    });
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
windows.internal.guid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};