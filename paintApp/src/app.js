require('../asset/css/normalize.css');
require("../asset/css/style.scss");

import Painter from './component/painter.js';
import BasePlate from './component/basePlate.js';
import Viewer from './component/viewer.js';

class App {
    constructor() {
        this.init();
    }

    init() {
        const painter = new Painter();
        const basePlate = new BasePlate();
        const viewer = new Viewer({
            drawResult: $.proxy(painter.drawResult, painter), // 在painter上画图
            setBasePlate: $.proxy(basePlate.setBasePlate, basePlate), // 在baseplate上设置
        });
    }
}

const app = new App();