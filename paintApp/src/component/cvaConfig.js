/*
 * @Author: Ruth
 * @Date:   2017-03-28 14:49:37
 * @Last Modified by:   Ruth92
 * @Last Modified time: 2017-03-29 15:51:17
 */

'use strict';

export default class CvaConfig {
    constructor() {
        this.config = {
            cvaW: 600,
            cvaH: 500,
            cvaBg: '#fff',
            lineWidth: 2,
            lineJoin: 'round',
            strokeStyle: 'red'
        };
    }

    // 画板宽高设置
    // 注意此处不能在 css 中设置，像素会失真，会导致不能获取正确的坐标
    setCvaWH() {
        this.cva.setAttribute('width', this.config.cvaW);
        this.cva.setAttribute('height', this.config.cvaH);

        return this;
    }

    // 画板背景设置
    setCvaBg() {
        this.ctx.fillStyle = this.config.cvaBg;
        this.ctx.fillRect(0, 0, this.config.cvaW, this.config.cvaH);

        return this;
    }

    // 画笔设置
    setPen() {
        this.ctx.lineWidth = this.config.lineWidth;
        this.ctx.lineJoin = this.config.lineJoin;
        this.ctx.strokeStyle = this.config.strokeStyle;

        return this;
    }

    // 清除图层，如果不清除，会叠加显示，导致不透明
    clearBg() {
        this.ctx.clearRect(0, 0, this.config.cvaW, this.config.cvaH);
    }
}