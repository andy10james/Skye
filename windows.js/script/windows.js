/*! windows.js.mercury (v1.0.0) | © 2014 Andrew James (me@andyjames.it) | 
Released under the GNU General Public License, version 3 (GPL-3.0)
http://opensource.org/licenses/GPL-3.0 
*/
var windows = {
    settings: {
        enclosure: 'body',
        speed: 200,
    },
    presets: {
        default: {
            title: document.title,
            top: 30, 
            left: 30,
            height: 500,
            width: 300,
            hide: true,
            state: true,
            close: true,
            movable: true,
            modal: false,
            icon: '../content/windows.js/ico.ico'
        },
        message: {
            title: document.title,
            top: 70,
            left: 70,
            height: 200,
            width: 400,
            hide: false,
            state: false,
            close: false,
            movable: false,
            modal: true,
            icon: null
        },
    },
    maxedWindows: [],
    hiddenWindows: [],
    modalWindows: [],
    allWindows: [],
    load: function (settings) {
        $.extend(windows.settings, settings);
        windows.settings.enclosure = $(windows.settings.enclosure);
        windows.settings.enclosure.addClass('win-js-enclosure');
        $(window).mouseup(windows.internal.fn.globalMouseUp);
        $(window).mousemove(windows.internal.fn.globalMouseMove);
        $(window).resize(windows.internal.fn.globalResize);
    },
    open: function (settings, enclosure) {
        var ws = {};
        $.extend(ws, windows.presets.default);
        $.extend(ws, settings);
        if (enclosure == null) enclosure = windows.settings.enclosure;
        var win, modal, tb, tb_title, tb_staters, tb_hide, tb_state, tb_close, tb_icon;
        win = $('<div/>', { class: 'win-js-window', id: windows.internal.guid() });
        win.css({ top: ws.top, left: ws.left, width: ws.width, height: ws.height });
        if (ws.movable) win.addClass('win-js-movable');
        tb = $('<div/>', { class: 'win-js-tb' }).appendTo(win);
        if (ws.icon) tb_icon = $('<img/>', { class: 'win-js-icon', src: ws.icon }).appendTo(tb);
        if (ws.close || ws.state || ws.hide) tb_staters = $('<div/>', { class: 'win-js-staters' }).appendTo(tb);
        if (ws.hide) tb_hide = $('<div/>', { class: 'win-js-hide' }).appendTo(tb_staters);
        if (ws.state) tb_state = $('<div/>', { class: 'win-js-state' }).appendTo(tb_staters);
        if (ws.close) tb_close = $('<div/>', { class: 'win-js-close' }).appendTo(tb_staters);
        tb_title = $('<div/>', { class: 'win-js-title', text: ws.title }).appendTo(tb);
        $('<div/>', { class: 'win-js-clear' }).appendTo(tb);
        $('<div/>', { class: 'win-js-content' }).appendTo(win);
        if (ws.close) tb_close.click(windows.internal.fn.wintbCloseClick);
        if (ws.close && ws.icon) tb_icon.dblclick(windows.internal.fn.wintbCloseClick);
        if (ws.state) tb_state.click(windows.internal.fn.wintbMaxClick);
        if (ws.state) tb_title.dblclick(windows.internal.fn.wintbMaxClick);
        if (ws.hide) tb_hide.click(windows.internal.fn.wintbHideClick);
        if (ws.movable) tb_title.mousedown(windows.internal.fn.wintbMouseDown);
        win.mousedown(windows.internal.fn.winMouseDown);
        if (ws.modal) {
            modal = $('<div/>', { class: 'win-js-modal' });
            win.hide().appendTo(modal);
            modal.appendTo(enclosure);
            windows.bringToFront(modal);
            windows.modalWindows.push(win);
        } else {
            win.hide().appendTo(enclosure);
            windows.bringToFront(win);
        }
        windows.allWindows.push(win);
        win.fadeIn(windows.settings.speed);
        return win;
    },
    max: function (win) {
        if (windows.isMaxedWindow(win)) return;
        win.addClass('win-js-maxed');
        win.data('res-t', win.offset().top);
        win.data('res-l', win.offset().left);
        win.data('res-w', win.width());
        win.data('res-h', win.height());
        windows.internal.animateToMax(win);
        if (!windows.isMaxedWindow(win))
            windows.maxedWindows.push(win);
    },
    res: function (win) {
        if (!windows.isMaxedWindow(win)) return;
        windows.internal.removeMaxedWindow(win);
        win.removeClass('win-js-maxed');
        win.stop();
        win.animate({
            top: win.data('res-t'),
            left: win.data('res-l'),
            width: win.data('res-w'),
            height: win.data('res-h')
        }, windows.settings.speed);
        win.data('res-t', null);
        win.data('res-l', null);
        win.data('res-w', null);
        win.data('res-h', null);
    },
    resTo: function (win, css) {
        if (!windows.isMaxedWindow(win)) return;
        windows.internal.removeMaxedWindow(win);
        win.removeClass('win-js-maxed');
        win.stop();
        win.animate(css, windows.settings.speed);
        win.data('res-t', null);
        win.data('res-l', null);
        win.data('res-w', null);
        win.data('res-h', null);
    },
    hide: function (win) {
        if (windows.isHiddenWindow(win)) return;
        win.fadeOut(
            windows.settings.speed,
            function () {
                if (windows.isModalWindow(win)) {
                    win.parents('.win-js-modal').hide();
                }
            });
        
        windows.hiddenWindows.push(win);
    },
    show: function (win) {
        if (!windows.isHiddenWindow(win)) return;
        if (windows.isModalWindow(win)) {
            win.parents('.win-js-modal').show();
        }
        win.fadeIn(windows.settings.speed);
        windows.internal.removeHiddenWindow(win);
    },
    close: function (win) {
        win.fadeOut(
            windows.settings.speed,
            function () {
                if (windows.isHiddenWindow(win)) {
                    windows.internal.removeHiddenWindow(win);
                }
                if (windows.isMaxedWindow(win)) {
                    windows.internal.removeMaxedWindow(win);
                }
                if (windows.isModalWindow(win)) {
                    win.parents('.win-js-modal').remove();
                    windows.internal.removeModalWindow(win);
                } else {
                    win.remove();
                }
                windows.internal.removeWindow(win);
            });
    },
    bringToFront: function (win) {
        if (windows.isModalWindow(win)) {
            win = win.parents('.win-js-modal');
        }
        var winIndex = win.css('z-index') - 1;
        $(windows.allWindows).each(function (i) {
            var curIndex = $(this).css('z-index');
            if ($(this).css('z-index') > winIndex)
                $(this).css({ 'z-index': curIndex - 1 });
        });
        win.css({ 'z-index': windows.allWindows.length });
    },
    isMaxedWindow: function (win) {
        for (var i = 0; i < windows.maxedWindows.length; i++)
            if (windows.maxedWindows[i].is(win))
                return true;
        return false;
    },
    isHiddenWindow: function (win) {
        for (var i = 0; i < windows.hiddenWindows.length; i++)
            if (windows.hiddenWindows[i].is(win))
                return true;
        return false;
    },
    isModalWindow: function (win) {
        for (var i = 0; i < windows.modalWindows.length; i++)
            if (windows.modalWindows[i].is(win))
                return true;
        return false;
    },
    internal: {
        animateToMax: function (win) {
            win.stop();
            win.animate({
                top: windows.settings.enclosure.offset().top,
                left: windows.settings.enclosure.offset().left,
                width: windows.settings.enclosure.width() - parseInt(win.css('border-left-width')) - parseInt(win.css('border-right-width'))
                - parseInt(win.css('padding-left')) - parseInt(win.css('padding-right')),
                height: windows.settings.enclosure.height() - parseInt(win.css('border-top-width')) - parseInt(win.css('border-bottom-width'))
                - parseInt(win.css('padding-top')) - parseInt(win.css('padding-top')),
            }, windows.settings.speed);
        },
        removeMaxedWindow: function (win) {
            for (var i = 0; i < windows.maxedWindows.length; i++)
                if (windows.maxedWindows[i].is(win))
                    windows.maxedWindows.splice(i, 1);
        },
        removeHiddenWindow: function (win) {
            for (var i = 0; i < windows.hiddenWindows.length; i++)
                if (windows.hiddenWindows[i].is(win))
                    windows.hiddenWindows.splice(i, 1);
        },
        removeModalWindow: function (win) {
            for (var i = 0; i < windows.modalWindows.length; i++)
                if (windows.modalWindows[i].is(win))
                    windows.modalWindows.splice(i, 1);
        },
        removeWindow: function (win) {
            windows.internal.removeMaxedWindow(win);
            for (var i = 0; i < windows.allWindows.length; i++)
                if (windows.allWindows[i].is(win))
                    windows.allWindows.splice(i, 1);
        },
        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        fn: {
            wintbMouseDown: function(e) {
                var win = $(this).parents('.win-js-window');
                win.removeClass('win-js-movable');
                win.addClass('win-js-moving');
                var swot = win.offset();
                windows.internal.cw.cw = win;
                windows.internal.cw.ct = e.pageY - swot.top;
                if (!windows.isMaxedWindow(win)) windows.internal.cw.cl = e.pageX - swot.left;
                else windows.internal.cw.cl = win.data('res-w') / 2;
            },
            winMouseDown: function(e) {
                windows.bringToFront($(this));
            },
            wintbCloseClick: function (e) {
                var win = $(this).parents('.win-js-window');
                windows.close(win);
            },
            wintbMaxClick: function (e) {
                var win = $(this).parents('.win-js-window');
                if (windows.isMaxedWindow(win)) windows.res(win);
                else windows.max(win);
            },
            wintbHideClick: function (e) {
                var win = $(this).parents('.win-js-window');
                windows.hide(win);
            },
            globalMouseUp: function () {
                if (windows.internal.cw.cw == null) return;
                var win = windows.internal.cw.cw;
                win.removeClass('win-js-moving');
                win.addClass('win-js-movable');
                windows.internal.cw = {};
            },
            globalMouseMove: function (e) {
                if (windows.internal.cw.cw == null) return;
                var win = windows.internal.cw.cw;
                if (windows.isMaxedWindow(win))
                    windows.resTo(win, { width: win.data('res-w'),
                        height: win.data('res-h') });
                win.css({
                    top: e.pageY - windows.internal.cw.ct,
                    left: e.pageX - windows.internal.cw.cl,
                    position: 'absolute'
                });
            },
            globalResize: function (e) {
                for (var i = 0; i < windows.maxedWindows.length; i++)
                    windows.internal.animateToMax(windows.maxedWindows[i]);
            }
        },
        cw: {},

    },
};
$.fn.openWindow = function(settings) {
    return windows.open(settings, $(this));
};