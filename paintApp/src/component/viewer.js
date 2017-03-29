/*
 * @Author: Ruth
 * @Date:   2017-03-28 14:40:02
 * @Last Modified by:   Ruth
 * @Last Modified time: 2017-03-29 10:27:18
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
        this.view.on('touchstart', $.proxy(this.touchF, this));
        this.view.on('touchmove', $.proxy(this.touchF, this));
        this.view.on('touchend', $.proxy(this.touchF, this));
    }

    touchF(e) {
        e.preventDefault(); // 阻止浏览器默认行为
        const touches = e.changedTouches;
        const point = touches[0];
        let $el = $(e.target);

        switch (e.type) {
            case 'touchstart':

                break;
            case 'touchmove':
                this.dragging = true;

                if (this.dragging) {

                    // 随触摸点坐标更改目标元素的坐标
                    $el.css({
                        'left': point.clientX + 'px',
                        'top': point.clientY + 'px'
                    });

                    // js原生写法
                    /*e.target.style.left = point.clientX + 'px';
                    e.target.style.top = point.clientY + 'px';*/
                }

                break;
            case 'touchend':
                if (!this.dragging) {
                    this.setStyle($(e.target)); // 切换视图显示状态
                    this.setBasePlate(e.target); // 切换底板显示状态
                }

                this.dragging = false;

                break;
            default:
                this.dragging = false;

                break;
        }
    }

    /**
     * 切换视图显示状态，表示是否点击
     * @param {[type]} $el 点击的jQuery目标对象
     */
    setStyle($el) {
        $el.toggleClass('blue-border');
    }

    /**
     * 通过点击图视图调用basePlate的接口切换底板显示状态
     * @param {[type]} el 点击的原生js目标对象
     */
    setBasePlate(el) {

        // 视图选中时传入图片
        if ($(el).hasClass('blue-border')) {
            this.option.setBasePlate(el);
        } else { // 未选中不传图片
            this.option.setBasePlate();
        }
    }

    init() {
        this.initSelectors().initEvents();
    }
}