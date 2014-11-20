/*! skye.mercury (v1.0.0) | © 2014 Andrew James (me@andyjames.it) |
Released under the GNU General Public License, version 3 (GPL-3.0)
http://opensource.org/licenses/GPL-3.0
*/
skye = {
    settings: {
        enclosure: 'body',
        boundary: 0,
        maxToBoundary: true,
        speed: 200
    },
    presets: {
        default: {
            title: document.title,
            top: 70,
            left: 70,
            height: 500,
            width: 300,
            hide: true,
            state: true,
            close: true,
            movable: true,
            resizable: true,
            modal: false,
            icon: null
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
            resizable: false,
            modal: true,
            icon: null
        }
    },
    classes: {
        enclosure: 'skye-enclosure',
        snap: 'skye-snap',
        skye: 'skye-window',
        skyeActive: 'skye-active',
        skyeResizable: 'skye-resizable',
        skyeResizing: 'skye-resizing',
        skyeMovable: 'skye-movable',
        skyeMoving: 'skye-moving',
        skyeMaxed: 'skye-maxed',
        skyeSnappedLeft: 'skye-snapped-left',
        skyeSnappedRight: 'skye-snapped-right',
        skyeAnimating: 'skye-animating',
        titlebar: 'skye-tb',
        title: 'skye-title',
        icon: 'skye-icon',
        staters: 'skye-staters',
        hide: 'skye-hide',
        state: 'skye-state',
        close: 'skye-close',
        border: 'skye-border',
        borderTopLeft: 'skye-border-topleft',
        borderTop: 'skye-border-top',
        borderTopRight: 'skye-border-topright',
        borderLeft: 'skye-border-left',
        borderRight: 'skye-border-right',
        borderBottomLeft: 'skye-border-bottomleft',
        borderBottom: 'skye-border-bottom',
        borderBottomRight: 'skye-border-bottomright',
        main: 'skye-main',
        content: 'skye-content',
        modal: 'skye-modal',
        clear: 'skye-clear'
    },
    data: {
        restoreTop: 'skye-res-top',
        restoreLeft: 'skye-res-left',
        restoreWidth: 'skye-res-width',
        restoreHeight: 'skye-res-height'
    },
    animatingSkyes: [],
    maxedSkyes: [],
    hiddenSkyes: [],
    modalSkyes: [],
    leftSnappedSkyes: [],
    rightSnappedSkyes: [],
    allSkyes: [],
    activeSkye: {},
    snaps: {
        top: "top",
        left: "left",
        right: "right"
    },
    snapPossible: null,
    load: function (settings) {
        skye._internal.helpers.init();
        jQuery.extend(skye.settings, settings);
        skye.settings.enclosure = jQuery(skye.settings.enclosure);
        skye.settings.enclosure.addClass(skye.classes.enclosure);
        skye._internal.snapGuide = jQuery('<div/>', { class: skye.classes.snap });
        skye._internal.snapGuide.hide().appendTo(skye.settings.enclosure);
        jQuery(window).mouseup(skye._internal.fn.winMouseUp);
        jQuery(window).mousemove(skye._internal.fn.winMouseMove);
        jQuery(window).resize(skye._internal.fn.winResize);
    },
    create: function (settings, enclosure) {
        var skye_settings = {};
        jQuery.extend(skye_settings, skye.presets.default);
        jQuery.extend(skye_settings, settings);
        if (enclosure == null) enclosure = skye.settings.enclosure;
        var skye_obj, modal, tb, tb_title, tb_staters, tb_hide, tb_state, tb_close, tb_icon, bdr_tl, bdr_tr, bdr_t, bdr_l, bdr_r, bdr_bl, bdr_br, bdr_b, main, content;
        skye_obj = jQuery('<div/>', { class: skye.classes.skye, id: skye._internal.guid() }).mousedown(skye._internal.fn.skyeMouseDown);;
        skye_obj.css({ top: skye_settings.top, left: skye_settings.left, width: skye_settings.width, height: skye_settings.height });
        bdr_tl = jQuery('<div/>', { class: skye.classes.border.withClass(skye.classes.borderTopLeft) }).appendTo(skye_obj);
        bdr_tr = jQuery('<div/>', { class: skye.classes.border.withClass(skye.classes.borderTopRight) }).appendTo(skye_obj);
        bdr_t = jQuery('<div/>', { class: skye.classes.border.withClass(skye.classes.borderTop) }).appendTo(skye_obj);
        bdr_l = jQuery('<div/>', { class: skye.classes.border.withClass(skye.classes.borderLeft) }).appendTo(skye_obj);
        bdr_r = jQuery('<div/>', { class: skye.classes.border.withClass(skye.classes.borderRight) }).appendTo(skye_obj);
        bdr_bl = jQuery('<div/>', { class: skye.classes.border.withClass(skye.classes.borderBottomLeft) }).appendTo(skye_obj);
        bdr_br = jQuery('<div/>', { class: skye.classes.border.withClass(skye.classes.borderBottomRight) }).appendTo(skye_obj);
        bdr_b = jQuery('<div/>', { class: skye.classes.border.withClass(skye.classes.borderBottom) }).appendTo(skye_obj);
        main = jQuery('<div/>', { class: skye.classes.main }).appendTo(skye_obj);
        tb = jQuery('<div/>', { class: skye.classes.titlebar }).append(jQuery('<div/>', { class: skye.classes.clear })).appendTo(main);
        tb_title = jQuery('<div/>', { class: skye.classes.title, unselectable: 'on', text: skye_settings.title });
        content = jQuery('<div/>', { class: skye.classes.content }).appendTo(main);
        if (skye_settings.icon) {
            tb_icon = jQuery('<img/>', { class: skye.classes.icon, src: skye_settings.icon }).appendTo(tb);
            if (skye_settings.close) tb_icon.dblclick(skye._internal.fn.tbCloseClick);
        }
        if (skye_settings.close || skye_settings.state || skye_settings.hide) {
            tb_staters = jQuery('<div/>', { class: skye.classes.staters }).appendTo(tb);
            if (skye_settings.hide) {
                tb_hide = jQuery('<div/>', { class: skye.classes.hide }).appendTo(tb_staters);
                tb_hide.click(skye._internal.fn.tbHideClick);
            }
            if (skye_settings.state) {
                tb_state = jQuery('<div/>', { class: skye.classes.state }).appendTo(tb_staters);
                tb_state.click(skye._internal.fn.tbMaxClick);
                tb_title.dblclick(skye._internal.fn.tbMaxClick);
            }
            if (skye_settings.close) {
                tb_close = jQuery('<div/>', { class: skye.classes.close }).appendTo(tb_staters);
                tb_close.click(skye._internal.fn.tbCloseClick);
            }
        }
        tb_title.appendTo(tb);
        if (skye_settings.resizable) {
            bdr_tl.mousedown(skye._internal.fn.borderTopLeftMouseDown);
            bdr_tr.mousedown(skye._internal.fn.borderTopRightMouseDown);
            bdr_t.mousedown(skye._internal.fn.borderTopMouseDown);
            bdr_l.mousedown(skye._internal.fn.borderLeftMouseDown);
            bdr_r.mousedown(skye._internal.fn.borderRightMouseDown);
            bdr_bl.mousedown(skye._internal.fn.borderBottomLeftMouseDown);
            bdr_br.mousedown(skye._internal.fn.borderBottomRightMouseDown);
            bdr_b.mousedown(skye._internal.fn.borderBottomMouseDown);
            skye_obj.addClass(skye.classes.skyeResizable);
        }
        if (skye_settings.movable) {
            tb_title.mousedown(skye._internal.fn.tbMouseDown);
            skye_obj.addClass(skye.classes.skyeMovable);
        }
        if (skye_settings.modal) {
            modal = jQuery('<div/>', { class: skye.classes.modal });
            skye_obj.hide().appendTo(modal);
            modal.appendTo(enclosure);
            skye.modalSkyes.push(skye_obj);
        } else {
            skye_obj.hide().appendTo(enclosure);
            skye.bringToFront(skye_obj);
        }
        skye.allSkyes.push(skye_obj);
        skye.bringToFront(skye_obj);
        skye_obj.fadeIn(skye.settings.speed);
        return skye_obj;
    },
    max: function (skye_obj) {
        if (skye.isMaxedWindow(skye_obj)) return;
        if (skye.isLeftSnappedWindow(skye_obj)) {
            skye._internal.removeLeftSnappedWindow(skye_obj);
            skye_obj.removeClass(skye.classes.skyeSnappedLeft);
        } else if (skye.isRightSnappedWindow(skye_obj)) {
            skye._internal.removeRightSnappedWindow(skye_obj);
            skye_obj.removeClass(skye.classes.skyeSnappedRight);
        }
        var currentDimensions = jQuery.extend(skye_obj.offset(), {
            width: skye_obj.width(), height: skye_obj.height()
        });
        if (skye_obj.data(skye.data.restoreTop) == null) skye_obj.data(skye.data.restoreTop, currentDimensions.top);
        if (skye_obj.data(skye.data.restoreLeft) == null) skye_obj.data(skye.data.restoreLeft, currentDimensions.left);
        if (skye_obj.data(skye.data.restoreWidth) == null) skye_obj.data(skye.data.restoreWidth, currentDimensions.width);
        if (skye_obj.data(skye.data.restoreHeight) == null) skye_obj.data(skye.data.restoreHeight, currentDimensions.height);
        skye._internal.animateToMax(skye_obj, function () {
            skye_obj.addClass(skye.classes.skyeMaxed);
            skye.maxedSkyes.push(skye_obj);
        });
    },
    snap: function (skye_obj, snap) {
        if (snap == skye.snaps.top) {
            skye.max(skye_obj);
            return;
        }
        if (snap != skye.snaps.left &&
            snap != skye.snaps.right)
            return;
        if (skye_obj.data(skye.data.restoreTop) == null) skye_obj.data(skye.data.restoreTop, skye_obj.offset().top);
        if (skye_obj.data(skye.data.restoreLeft) == null) skye_obj.data(skye.data.restoreLeft, skye_obj.offset().left);
        if (skye_obj.data(skye.data.restoreWidth) == null) skye_obj.data(skye.data.restoreWidth, skye_obj.width());
        if (skye_obj.data(skye.data.restoreHeight) == null) skye_obj.data(skye.data.restoreHeight, skye_obj.height());
        var snapPosition = skye._internal.getSnapPosition(snap);
        skye.animate(skye_obj, snapPosition);
        if (snap == skye.snaps.left) {
            skye.leftSnappedSkyes.push(skye_obj);
            skye_obj.addClass(skye.classes.skyeSnappedLeft);
        } else if (snap == skye.snaps.right) {
            skye.rightSnappedSkyes.push(skye_obj);
            skye_obj.addClass(skye.classes.skyeSnappedRight);
        }
    },
    res: function (skye_obj) {
        skye.resTo(skye_obj, {
            top: skye_obj.data(skye.data.restoreTop),
            left: skye_obj.data(skye.data.restoreLeft),
            width: skye_obj.data(skye.data.restoreWidth),
            height: skye_obj.data(skye.data.restoreHeight)
        });
    },
    resTo: function (skye_obj, css) {
        if (skye.isMaxedWindow(skye_obj)) {
            skye._internal.removeMaxedWindow(skye_obj);
            skye_obj.removeClass(skye.classes.skyeMaxed);
        } else if (skye.isLeftSnappedWindow(skye_obj)) {
            skye._internal.removeLeftSnappedWindow(skye_obj);
            skye_obj.removeClass(skye.classes.skyeSnappedLeft);
        } else if (skye.isRightSnappedWindow(skye_obj)) {
            skye._internal.removeRightSnappedWindow(skye_obj);
            skye_obj.removeClass(skye.classes.skyeSnappedRight);
        } else return;
        skye.animate(skye_obj.stop(), css,
            function () {
                skye_obj.data(skye.data.restoreTop, null);
                skye_obj.data(skye.data.restoreLeft, null);
                skye_obj.data(skye.data.restoreWidth, null);
                skye_obj.data(skye.data.restoreHeight, null);
            });
    },
    hide: function (skye_obj) {
        if (skye.isHiddenWindow(skye_obj)) return;
        skye_obj.fadeOut(
            skye.settings.speed,
            function () {
                if (skye.isModalWindow(skye_obj)) {
                    skye_obj.parents(skye.classes.modal.asClass()).hide();
                }
            });
        skye.hiddenSkyes.push(skye_obj);
    },
    show: function (skye_obj) {
        if (!skye.isHiddenWindow(skye_obj)) return;
        if (skye.isModalWindow(skye_obj)) {
            skye_obj.parents(skye.classes.modal.asClass()).show();
        }
        skye_obj.fadeIn(skye.settings.speed);
        skye._internal.removeHiddenWindow(skye_obj);
    },
    close: function (skye_obj) {
        skye_obj.fadeOut(
            skye.settings.speed,
            function () {
                if (skye.isModalWindow(skye_obj)) {
                    skye_obj.parents(skye.classes.modal.asClass()).remove();
                } else {
                    skye_obj.remove();
                }
                skye._internal.removeWindow(skye_obj);
            });
    },
    closeAll: function () {
        jQuery.each(skye.allSkyes, function (k, v) {
            skye.close(v);
        });
    },
    bringToFront: function (skye_obj) {
        var focus = skye_obj;
        if (skye.isModalWindow(skye_obj)) {
            focus = skye_obj.parents(skye.classes.modal.asClass());
        }
        var winIndex = focus.css('z-index') - 1;
        jQuery(skye.allSkyes).each(function (k, v) {
            jQuery(v).removeClass(skye.classes.skyeActive);
            var curIndex = jQuery(v).css('z-index');
            if (jQuery(v).css('z-index') > winIndex)
                jQuery(v).css({ 'z-index': curIndex - 1 });
        });
        focus.css({ 'z-index': skye.allSkyes.length });
        skye_obj.addClass(skye.classes.skyeActive);
        skye_obj.focus();
        skye.activeSkye = skye_obj;
    },
    animate: function (skye_obj, css, func) {
        if (skye_obj == null || css == null) return;
        if (skye.isAnimating(skye_obj)) skye_obj.stop();
        else skye.animatingSkyes.push(skye_obj);
        skye_obj.addClass(skye.classes.skyeAnimating);
        skye_obj.animate(css, skye.settings.speed, function () {
            skye._internal.removeAnimatingWindow(skye_obj);
            skye_obj.removeClass(skye.classes.skyeAnimating);
            if (func != null) func.call(skye_obj);
        });
    },
    isAnimating: function (skye_obj) {
        var result = false;
        jQuery.each(skye.animatingSkyes, function (k, v) {
            if (v.is(skye_obj)) result = true;
        });
        return result;
    },
    isMaxedWindow: function (skye_obj) {
        var result = false;
        jQuery.each(skye.maxedSkyes, function (k, v) {
            if (v.is(skye_obj)) result = true;
        });
        return result;
    },
    isHiddenWindow: function (skye_obj) {
        var result = false;
        jQuery.each(skye.hiddenSkyes, function (k, v) {
            if (v.is(skye_obj)) result = true;
        });
        return result;
    },
    isModalWindow: function (skye_obj) {
        var result = false;
        jQuery.each(skye.modalSkyes, function (k, v) {
            if (v.is(skye_obj)) result = true;
        });
        return result;
    },
    isLeftSnappedWindow: function (skye_obj) {
        var result = false;
        jQuery.each(skye.leftSnappedSkyes, function (k, v) {
            if (v.is(skye_obj)) result = true;
        });
        return result;
    },
    isRightSnappedWindow: function (skye_obj) {
        var result = false;
        jQuery.each(skye.rightSnappedSkyes, function (k, v) {
            if (v.is(skye_obj)) result = true;
        });
        return result;
    },
    _internal: {
        snapGuide: null,
        transformingSkye: {
            curSkye: null,
            translationOffset: null,
            scalingAnchor: null
        },
        scalingAnchor: {
            top: "top",
            topLeft: "topLeft",
            topRight: "topRight",
            left: "left",
            right: "right",
            bottom: "bottom",
            bottomLeft: "bottomLeft",
            bottomRight: "bottomRight"
        },
        getTransformation: function (e) {
            var skye_obj = skye._internal.transformingSkye.curSkye;
            if (!skye_obj) return null;
            var boundary = parseInt(skye.settings.boundary);
            var currentDimensions = jQuery.extend(skye_obj.offset(), {
                width: skye_obj.width(), height: skye_obj.height()
            });
            var transformation = {
                top: currentDimensions.top,
                left: currentDimensions.left,
                width: null,
                height: null
            };
            if (skye._internal.transformingSkye.translationOffset) {
                var offsetTop = skye._internal.transformingSkye.translationOffset.top;
                var offsetLeft = skye._internal.transformingSkye.translationOffset.left;
                transformation.top = e.pageY - offsetTop;
                transformation.left = e.pageX - offsetLeft;
                if (boundary != null && !isNaN(boundary)) {
                    if (skye._internal.transformingSkye.translationOffset ||
                        skye._internal.transformingSkye.scalingAnchor == skye._internal.scalingAnchor.left ||
                        skye._internal.transformingSkye.scalingAnchor == skye._internal.scalingAnchor.top) {
                        if (transformation.top < -boundary) {
                            transformation.top = -boundary;
                            transformation.snap = skye.snaps.top;
                        }
                        if (transformation.left < -boundary) {
                            transformation.left = -boundary;
                            transformation.snap = skye.snaps.left;
                        }
                        if (transformation.left + currentDimensions.width > skye.settings.enclosure.width() + boundary) {
                            transformation.left = (skye.settings.enclosure.width() + boundary)
                                - skye._internal.transformingSkye.curSkye.width();
                            transformation.snap = skye.snaps.right;
                        }
                        if (transformation.top + currentDimensions.height > skye.settings.enclosure.height() + boundary) {
                            transformation.top = (skye.settings.enclosure.height() + boundary)
                                - skye._internal.transformingSkye.curSkye.height();
                        }
                    }
                }
            }
            if (skye._internal.transformingSkye.scalingAnchor) {
                switch (skye._internal.transformingSkye.scalingAnchor) {
                    case skye._internal.scalingAnchor.right:
                        transformation.width = e.pageX - currentDimensions.left;
                        break;
                    case skye._internal.scalingAnchor.bottom:
                        transformation.height = e.pageY - currentDimensions.top;
                        break;
                    case skye._internal.scalingAnchor.bottomRight:
                        transformation.width = e.pageX - currentDimensions.left;
                        transformation.height = e.pageY - currentDimensions.top;
                        break;
                    case skye._internal.scalingAnchor.top:
                        transformation.top = e.pageY;
                        transformation.height = currentDimensions.height + (currentDimensions.top - e.pageY);
                        break;
                    case skye._internal.scalingAnchor.left:
                        transformation.left = e.pageX;
                        transformation.width = currentDimensions.width + (currentDimensions.left - e.pageX);
                        break;
                    case skye._internal.scalingAnchor.topLeft:
                        transformation.top = e.pageY;
                        transformation.height = currentDimensions.height + (currentDimensions.top - e.pageY);
                        transformation.left = e.pageX;
                        transformation.width = currentDimensions.width + (currentDimensions.left - e.pageX);
                        break;
                    case skye._internal.scalingAnchor.topRight:
                        transformation.top = e.pageY;
                        transformation.height = currentDimensions.height + (currentDimensions.top - e.pageY);
                        transformation.width = e.pageX - currentDimensions.left;
                        break;
                    case skye._internal.scalingAnchor.bottomLeft:
                        transformation.height = e.pageY - currentDimensions.top;
                        transformation.left = e.pageX;
                        transformation.width = currentDimensions.width + (currentDimensions.left - e.pageX);
                }
                if (boundary != null && !isNaN(boundary)) {
                    var enclosureDimensions =  {
                        width: skye.settings.enclosure.width(),
                        height: skye.settings.enclosure.height()
                    }
                    if (transformation.left < -boundary) {
                        transformation.left = -boundary;
                        transformation.width = currentDimensions.width + (currentDimensions.left - -boundary);
                    }
                    if (transformation.top < -boundary) {
                        transformation.top = -boundary;
                        transformation.height = currentDimensions.height + (currentDimensions.top - -boundary);
                    }
                    if (transformation.left + transformation.width > enclosureDimensions.width + boundary) {
                        transformation.width = enclosureDimensions.width - transformation.left + boundary;
                    }
                    if (transformation.top + transformation.height > enclosureDimensions.height + boundary) {
                        transformation.height = enclosureDimensions.height - transformation.top + boundary;
                    }
                }
            }
            return transformation;
        },
        getSnapPosition: function (snap) {
            var boundary = parseInt(skye.settings.boundary);
            var activeWidth = skye.settings.enclosure.width();
            var activeHeight = skye.settings.enclosure.height();
            var leftSnap = 0;
            var topSnap = 0;
            if (skye.settings.maxToBoundary) {
                if (boundary != null && !isNaN(boundary)) {
                    activeWidth = activeWidth + (boundary * 2);
                    activeHeight = activeHeight + (boundary * 2);
                    leftSnap = leftSnap - boundary;
                    topSnap = topSnap - boundary;
                }
            }
            switch (snap) {
                case skye.snaps.top:
                    return {
                        left: leftSnap,
                        top: topSnap,
                        width: activeWidth,
                        height: activeHeight
                    };
                    break;
                case skye.snaps.left:
                    return {
                        left: leftSnap,
                        top: topSnap,
                        width: activeWidth / 2,
                        height: activeHeight
                    };
                    break;
                case skye.snaps.right:
                    return {
                        left: leftSnap + activeWidth / 2,
                        top: topSnap,
                        width: activeWidth / 2,
                        height: activeHeight
                    };
                    break;
                default:
                    return null;
            }
        },
        updateSnapGuide: function (skye_obj, snap) {
            if (snap && !skye.snapPossible && !skye.isAnimating(skye_obj)) {
                skye.snapPossible = snap;
                var winOffset = skye_obj.offset();
                var guidePosition = skye._internal.getSnapPosition(snap);
                skye._internal.snapGuide.stop().css({
                    opacity: 1,
                    left: winOffset.left,
                    top: winOffset.top,
                    width: skye_obj.width(),
                    height: skye_obj.height()
                }).show().animate(guidePosition, skye.settings.speed);
            } else if (!snap && skye.snapPossible) {
                skye.snapPossible = null;
                skye._internal.snapGuide.fadeOut();
            }
        },
        animateToMax: function (skye_obj, func) {
            skye_obj.stop();
            var top = skye.settings.enclosure.offset().top;
            var left = skye.settings.enclosure.offset().left;
            var width = skye.settings.enclosure.width() - parseInt(skye_obj.css('border-left-width'))
                - parseInt(skye_obj.css('border-right-width')) - parseInt(skye_obj.css('padding-left')) - parseInt(skye_obj.css('padding-right'));
            var height = skye.settings.enclosure.height() - parseInt(skye_obj.css('border-top-width'))
                - parseInt(skye_obj.css('border-bottom-width')) - parseInt(skye_obj.css('padding-top')) - parseInt(skye_obj.css('padding-top'));
            if (skye.settings.maxToBoundary) {
                var boundary = parseInt(skye.settings.boundary);
                if (boundary != null && !isNaN(boundary)) {
                    top = top - boundary;
                    left = left - boundary;
                    width = width + 2 * boundary;
                    height = height + 2 * boundary;
                }
            }
            skye.animate(skye_obj, {
                top: top,
                left: left,
                width: width,
                height: height
            }, func);
        },
        removeAnimatingWindow: function (skye_obj) {
            jQuery.each(skye.animatingSkyes, function (k, v) {
                if (v.is(skye_obj)) skye.animatingSkyes.splice(k, 1);
            });
        },
        removeMaxedWindow: function (skye_obj) {
            jQuery.each(skye.maxedSkyes, function (k, v) {
                if (v.is(skye_obj)) skye.maxedSkyes.splice(k, 1);
            });
        },
        removeHiddenWindow: function (skye_obj) {
            jQuery.each(skye.hiddenSkyes, function (k, v) {
                if (v.is(skye_obj)) skye.hiddenSkyes.splice(k, 1);
            });
        },
        removeModalWindow: function (skye_obj) {
            jQuery.each(skye.modalSkyes, function (k, v) {
                if (v.is(skye_obj)) skye.modalSkyes.splice(k, 1);
            });
        },
        removeLeftSnappedWindow: function (skye_obj) {
            jQuery.each(skye.leftSnappedSkyes, function (k, v) {
                if (v.is(skye_obj)) skye.leftSnappedSkyes.splice(k, 1);
            });
        },
        removeRightSnappedWindow: function (skye_obj) {
            jQuery.each(skye.rightSnappedSkyes, function (k, v) {
                if (v.is(skye_obj)) skye.rightSnappedSkyes.splice(k, 1);
            });
        },
        removeWindow: function (skye_obj) {
            skye._internal.removeModalWindow(skye_obj);
            skye._internal.removeHiddenWindow(skye_obj);
            skye._internal.removeMaxedWindow(skye_obj);
            skye._internal.removeLeftSnappedWindow(skye_obj);
            skye._internal.removeRightSnappedWindow(skye_obj);
            jQuery.each(skye.allSkyes, function (k, v) {
                if (v.is(skye_obj)) skye.allSkyes.splice(k, 1);
            });
        },
        setAsScaling: function (skye_obj, anchor) {
            skye_obj.addClass(skye.classes.skyeResizing);
            skye._internal.transformingSkye.curSkye = skye_obj;
            skye._internal.transformingSkye.scalingAnchor = anchor;
        },
        setAsTranslating: function (skye_obj, topOffset, leftOffset) {
            skye_obj.addClass(skye.classes.skyeMoving);
            skye._internal.transformingSkye.curSkye = skye_obj;
            skye._internal.transformingSkye.translationOffset = {
                top: topOffset, left: leftOffset
            }
        },
        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        helpers: {
            init: function () {
                jQuery.fn.createSkye = skye._internal.helpers.jQueryCreate;
                String.prototype.asClass = skye._internal.helpers.asClass;
                String.prototype.asId = skye._internal.helpers.asId;
                String.prototype.withClass = skye._internal.helpers.withClass;
            },
            jQueryCreate: function(settings) {
                return skye.create(settings, jQuery(this));
            },
            asClass:  function () {
                return '.' + this;
            },
            asId: function () {
                return '#' + this;
            },
            withClass: function (str) {
                return this + ' ' + str;
            }
        },
        fn: {
            skyeMouseDown: function() {
                skye.bringToFront(jQuery(this));
            },
            borderTopMouseDown: function () {
                var skye_obj = jQuery(this).parents(skye.classes.skye.asClass());
                skye._internal.setAsScaling(skye_obj, skye._internal.scalingAnchor.top);
                return false;
            },
            borderTopLeftMouseDown: function () {
                var skye_obj = jQuery(this).parents(skye.classes.skye.asClass());
                skye._internal.setAsScaling(skye_obj, skye._internal.scalingAnchor.topLeft);
                return false;
            },
            borderTopRightMouseDown: function () {
                var skye_obj = jQuery(this).parents(skye.classes.skye.asClass());
                skye._internal.setAsScaling(skye_obj, skye._internal.scalingAnchor.topRight);
                return false;
            },
            borderLeftMouseDown: function () {
                var skye_obj = jQuery(this).parents(skye.classes.skye.asClass());
                skye._internal.setAsScaling(skye_obj, skye._internal.scalingAnchor.left);
                return false;
            },
            borderRightMouseDown: function () {
                var skye_obj = jQuery(this).parents(skye.classes.skye.asClass());
                skye._internal.setAsScaling(skye_obj, skye._internal.scalingAnchor.right);
                return false;
            },
            borderBottomMouseDown: function () {
                var skye_obj = jQuery(this).parents(skye.classes.skye.asClass());
                skye._internal.setAsScaling(skye_obj, skye._internal.scalingAnchor.bottom);
                return false;
            },
            borderBottomLeftMouseDown: function () {
                var skye_obj = jQuery(this).parents(skye.classes.skye.asClass());
                skye._internal.setAsScaling(skye_obj, skye._internal.scalingAnchor.bottomLeft);
                return false;
            },
            borderBottomRightMouseDown: function () {
                var skye_obj = jQuery(this).parents(skye.classes.skye.asClass());
                skye._internal.setAsScaling(skye_obj, skye._internal.scalingAnchor.bottomRight);
                return false;
            },
            tbMouseDown: function(e) {
                var skye_obj = jQuery(this).parents(skye.classes.skye.asClass());
                var offset = skye_obj.offset();
                skye._internal.setAsTranslating(skye_obj,
                    e.pageY - offset.top < 5 ? 5 : e.pageY - offset.top,
                    skye.isMaxedWindow(skye_obj) || skye.isRightSnappedWindow(skye_obj) || skye.isLeftSnappedWindow(skye_obj) ?
                        skye_obj.data(skye.data.restoreWidth) / 2 : e.pageX - offset.left
                );
                skye.bringToFront(skye_obj);
                return false;
            },
            tbCloseClick: function () {
                var skye_obj = jQuery(this).parents(skye.classes.skye.asClass());
                skye.close(skye_obj);
            },
            tbMaxClick: function () {
                var skye_obj = jQuery(this).parents(skye.classes.skye.asClass());
                if (skye.isMaxedWindow(skye_obj)) skye.res(skye_obj);
                else skye.max(skye_obj);
            },
            tbHideClick: function () {
                var skye_obj = jQuery(this).parents(skye.classes.skye.asClass());
                skye.hide(skye_obj);
            },
            winMouseMove: function (e) {
                var transformation = skye._internal.getTransformation(e);
                if (!transformation) return;
                var skye_obj = skye._internal.transformingSkye.curSkye;
                skye.resTo(skye_obj, {
                    width: skye_obj.data(skye.data.restoreWidth),
                    height: skye_obj.data(skye.data.restoreHeight)
                });
                skye_obj.css({
                    top: transformation.top,
                    left: transformation.left,
                    width: transformation.width,
                    height: transformation.height
                });
                skye._internal.updateSnapGuide(skye_obj, transformation.snap);
            },
            winMouseUp: function () {
                if (skye._internal.transformingSkye.curSkye == null) return;
                var skye_obj = skye._internal.transformingSkye.curSkye;
                skye_obj.removeClass(skye.classes.skyeMoving);
                skye_obj.removeClass(skye.classes.skyeResizing);
                if (skye.snapPossible == skye.snaps.top) {
                    skye.max(skye_obj);
                } else {
                    skye.snap(skye_obj, skye.snapPossible);
                }
                skye.snapPossible = null;
                skye._internal.snapGuide.fadeOut();
                skye._internal.transformingSkye.curSkye = null;
                skye._internal.transformingSkye.scalingAnchor = null;
                skye._internal.transformingSkye.translationOffset = null;
            },
            winResize: function () {
                for (var i = 0; i < skye.maxedSkyes.length; i++)
                    skye._internal.animateToMax(skye.maxedSkyes[i]);
                for (var i = 0; i < skye.leftSnappedSkyes.length; i++)
                    skye.animate(skye.leftSnappedSkyes[i], skye._internal.getSnapPosition(skye.snaps.left));
                for (var i = 0; i < skye.rightSnappedSkyes.length; i++)
                    skye.animate(skye.rightSnappedSkyes[i], skye._internal.getSnapPosition(skye.snaps.right));
            }
        }
    }
};