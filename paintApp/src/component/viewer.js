/*
 * @Author: Ruth
 * @Date:   2017-03-28 14:40:02
 * @Last Modified by:   Ruth92
 * @Last Modified time: 2017-03-28 16:23:22
 */

'use strict';

export default class Viewer {
    constructor(option) {
        this.option = option;
        this.init();
    }

    initSelectors() {
        this.view = $('.view');

        return this;
    }

    initEvents() {
        this.view.on('click', $.proxy(this._eventHandler, this));

        return this;
    }

    _eventHandler(e) {
        this.setStyle($(e.target));
        this.setBasePlate(e.target);
    }

    // 切换视图显示状态，表示是否点击
    setStyle($el) {
        $el.toggleClass('blue-border');
    }

    // 通过点击图视图调用basePlate的接口切换底板显示状态
    setBasePlate(el) {
        if ($(el).hasClass('blue-border')) {
            this.option.setBasePlate(el);
        } else {
            this.option.setBasePlate();
        }
    }

    init() {
        this.initSelectors().initEvents();
    }
}