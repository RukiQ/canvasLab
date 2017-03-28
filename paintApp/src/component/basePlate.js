/*
 * @Author: Ruth
 * @Date:   2017-03-28 14:40:19
 * @Last Modified by:   Ruth92
 * @Last Modified time: 2017-03-28 16:19:18
 */

'use strict';

import CvaConfig from './cvaConfig.js';

export default class basePlate extends CvaConfig {
    constructor() {
        super();
        this.init();
    }

    initSelectors() {
        this.cva = document.getElementById('js-baseplate');
        this.ctx = this.cva.getContext('2d');

        return this;
    }

    // 设置底板
    setBasePlate(image) {
        if (image) { // 如果有图片，在底板上显示图片
            this.ctx.drawImage(image, 0, 0, this.config.cvaW, this.config.cvaH);
        } else { // 设置空底板
            this.setCvaBg();
        }
    }

    init() {
        this.initSelectors();
        this.setCvaWH().setCvaBg();
    }
}