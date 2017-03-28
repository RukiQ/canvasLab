在我的毕设中，提出了视图引导的概念，由两部分功能组成：

（1）可以对照着图片进行绘画，即将图片以半透明的方式呈现在绘图板上，然后用户可以对照着进行绘画；

（2）可以直接将简笔画图片直接拖拽到画布上进行检索。

那么，在这里，我们先实现第一种功能——图片对照绘画。最终想要的实现效果是：当点击图片时，图片边框会呈现蓝色，表示选中状态，同时会在画布上以半透明方式呈现该图片，再点击图片，边框和底板图片都消失，即可以切换显示状态。


<img src="https://github.com/RukiQ/canvasLab/blob/master/image/%E7%82%B9%E5%87%BB%E5%89%8D.png?raw=true" alt="点击前" width=300 height=300/>

<img src="https://github.com/RukiQ/canvasLab/blob/master/image/%E7%82%B9%E5%87%BB%E5%90%8E.png?raw=true" alt="点击后" width=300 height=300/>

<img src="https://github.com/RukiQ/canvasLab/blob/master/image/%E5%8F%96%E6%B6%88%E7%82%B9%E5%87%BB.png?raw=true" alt="点击后" width=300 height=300/>


**思路**：利用分层实现图片参照效果，同时设置上层 canvas 的不透明度。

同样的，我们来理一下思路，首先看一下需要用到哪些理论知识：

**（1）Canvas 图片合成**（《JS高级程序设计》）
    




该阶段我们需要添加2个模块：一个是视图模块（viewer.js），用于放置我们的参照图片；另一个是底板模块（basePlate.js），用于显示底板。



我们来分析一下，这种半透明底板方式是如何实现的？这里需要用到两个 Canvas，上层的 Canvas 用来绘画，而下层的 Canvas 则作为底板显示图片，但是为了出现半透明的效果，则需要将上层的 Canvas 设置 `globalAlpha` 属性，指定其透明度。

另外，此处增加的两个 Canvas 其实前期的画板设置是相同的，因此我们将设置单独拎到一个 `cvaConfig.js` 文件中，以便代码重用，然后 `painter.js` 和 `basePlate.js` 只要继承 `cvaConfig.js` 就行了。

**☞ index.html**
    
    <img src="asset/img/bee.png" class="view">

    <canvas class="painter" id="js-painter"></canvas>
    <canvas class="baseplate" id="js-baseplate"></canvas>
    
**☞ cvaConfig.js**

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
    }

**☞ viewer.js**

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

**☞ basePlate.js**

basePlate 中功能性的只有一个用来设置底板的函数，通过在点击 viewer 时进行调用：

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
    


**☞ painter.js**

painter 中设置其透明度：

    // 设置画布背景及透明度
    _setBg() {
        this.ctx.globalAlpha = 0.7;
        this.setCvaBg();

        return this;
    }

✪ 两个应用到2D上下文中所有绘制操作的属性：

- `globalAlpha`：属于[0, 1]，用于指定所有绘制的透明度。
- `globalCompositionOperation`：表示后绘制的图形怎样与先绘制的图形结合，其属性值是字符串。
- 





✎ [利用分层优化 HTML5 画布渲染](https://www.ibm.com/developerworks/cn/web/wa-canvashtml5layering/)

解决问题：由于不断绘制会进行图层叠加，导致不透明，因此需要使用clearRect来清除。



