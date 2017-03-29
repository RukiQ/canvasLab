/*
 * @Author: Ruth
 * @Date:   2017-03-28 14:40:02
 * @Last Modified by:   Ruth
 * @Last Modified time: 2017-03-29 16:03:44
 */

'use strict';

export default class Viewer {
    constructor(options) {
        this.options = options;
        this.init();
    }

    initSelectors() {
        this.painter = document.getElementById('js-painter');
        this.ctx = this.painter.getContext('2d');
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
        let el = e.target,
            $el = $(e.target);

        switch (e.type) {
            case 'touchstart':

                // 触摸点起始坐标，不带单位
                this.p_start = {
                    x: point.clientX,
                    y: point.clientY
                };

                // 克隆一个对象
                this.$clone = $el.clone();
                this.$clone.insertBefore($el.siblings()[0]).css({
                    'z-index': 4
                });

                // 图片起始坐标，带单位
                this.clone_start = {
                    x: parseFloat(this.$clone.css('left')),
                    y: parseFloat(this.$clone.css('top'))
                };

                break;
            case 'touchmove':
                this.dragging = true;

                this.diffX = point.clientX - this.p_start.x;
                this.diffY = point.clientY - this.p_start.y;

                if (this.dragging) {

                    // 随触摸点坐标更改目标元素的坐标
                    this.$clone.css({
                        'left': this.clone_start.x + this.diffX,
                        'top': this.clone_start.y + this.diffY
                    });
                }

                break;
            case 'touchend':

                // 获取克隆元素的宽高及坐标
                let clone_rect = (this.$clone)[0].getBoundingClientRect();

                if (!this.dragging) {
                    this.setStyle($el); // 切换视图显示状态
                    this.setBasePlate(el); // 切换底板显示状态

                    // 如果进入画布
                } else if (this.intoPainter(clone_rect)) {
                    this.setBasePlate(); // 清空底板
                    // this.drawResult(el); // 在painter上进行绘画

                    // 否则回到初始状态
                } else {

                }

                this.dragging = false;
                // this.$clone.remove(); // 移除clone对象

                break;
            default:
                this.dragging = false;

                break;
        }
    }

    /**
     * 判断是否进入了 canvas 画布
     * @param  {[object]} srcRect 进入画布对象的大小及在视口中的坐标信息
     * @return {[boolean]}   
     */
    intoPainter(srcRect) {
        const rect = this.painter.getBoundingClientRect();

        // 上下左右边界判断
        let cL = srcRect.left > rect.left,
            cT = srcRect.top > rect.top,
            cR = srcRect.right < rect.right,
            cB = srcRect.bottom < rect.bottom;

        return cL && cT && cR && cB;
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
            this.options.setBasePlate(el);
        } else { // 未选中不传图片
            this.options.setBasePlate();
        }
    }

    /**
     * 调用painter接口在Painter上进行绘画
     * @param  {[type]} el 点击的原生js目标对象
     * @return {[type]}    [description]
     */
    drawResult(el) {
        this.options.drawResult(el);
    }

    init() {
        this.initSelectors().initEvents();
    }
}