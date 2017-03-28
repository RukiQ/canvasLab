/*
 * @Author: Ruth
 * @Date:   2017-03-27 14:42:07
 * @Last Modified by:   Ruth92
 * @Last Modified time: 2017-03-28 16:27:18
 */

'use strict';

import CvaConfig from './cvaConfig.js';

export default class Painter extends CvaConfig {
    constructor() {
        super();
        this.init();
    }

    // 初始化选择器
    initSelectors() {
        this.cva = document.getElementById('js-painter');
        this.ctx = this.cva.getContext('2d');

        return this;
    }

    // 设置画布背景及透明度
    _setBg() {
        this.ctx.globalAlpha = 0.7;
        this.setCvaBg();

        return this;
    }

    initData() {
        this.lastX = 0;
        this.lastY = 0;
        this.isPaint = false;

        return this;
    }

    // 初始化事件监听
    initEvents() {
        this._touchListen('touchstart');
        this._touchListen('touchmove');
        this._touchListen('touchend');
    }

    _touchListen(event) {
        this.cva.addEventListener(event, $.proxy(this.touchF, this), false);
    }

    // 触摸事件处理函数
    touchF(e) {
        e.preventDefault(); // 阻止浏览器默认行为
        const touches = e.changedTouches; // 获取 Touch 对象list
        const point = touches[0]; // 获取第一个 Touch 对象

        // 获取元素宽、高及距窗口上下左右距离
        const rect = this.cva.getBoundingClientRect();
        // 相当于const rect = $('.painter').offset();
        // 相当于const rect = { left: this.cva.offsetLeft, top: this.cva.offsetTop }

        switch (e.type) {
            case 'touchstart':

                // 获取触摸点的x,y坐标，传入draw函数
                this.draw(point.clientX - rect.left, point.clientY - rect.top);
                this.isPaint = true;

                break;
            case 'touchmove':
                this.draw(point.clientX - rect.left, point.clientY - rect.top);

                break;
            case 'touchend':
                this.isPaint = false;

                break;
            default:
                this.isPaint = false;

                break;
        }
    }

    /**
     * 绘画函数
     * @param  {[type]} x 触摸点x坐标
     * @param  {[type]} y 触摸点y坐标
     * @return {[type]}   将当前坐标赋给上一个点坐标
     */
    draw(x, y) {
        if (this.isPaint) {
            this.ctx.beginPath(); // 开始绘制路径，必须调用
            this.ctx.moveTo(this.lastX, this.lastY); // 将绘图游标移动到到上一点
            this.ctx.lineTo(x, y); // 从上一点开始绘制一条到(x,y)的直线
            this.ctx.stroke(); // 描边路径
        }

        // 上面必须判断 this.isPaint
        // 当 'touchstart' 时，先移动到触摸点
        this.lastX = x;
        this.lastY = y;
    }

    init() {
        this.initSelectors().initData();
        this.setCvaWH()._setBg().setPen();
        this.initEvents();
    }
}