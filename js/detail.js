window.addEventListener('load', function() {
    // 获取元素
    var preview_img = document.querySelector('.preview_img');
    var mask = document.querySelector('.mask');
    var big = document.querySelector('.big');
    // 1. 当我们鼠标经过 preview_img 就显示 mask 遮挡层 和 big 大盒子
    preview_img.addEventListener('mouseover', function() {
        mask.style.display = 'block';
        big.style.display = 'block';
    })
    // 鼠标移出preview_img就隐藏mask 遮罩层和big 大盒子
    preview_img.addEventListener('mouseout', function() {
            mask.style.display = 'none';
            big.style.display = 'none';
        })
        // 2. 鼠标移动的时候，让黄色的遮罩层盒子跟着鼠标来走，注意遮罩层应该是跟着鼠标在盒子里面的坐标移动，所以我们要获取到的是鼠标在盒子里面的实时坐标
    preview_img.addEventListener('mousemove', function(e) {
        // (1). 先计算出鼠标在盒子内的坐标，鼠标在盒子里的坐标=鼠标在屏幕中的坐标-盒子的offsetLeft/offsetTop
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        // console.log(x, y);
        // (2) 鼠标在遮罩层中应该处于中心的位置，所以还要把鼠标从遮罩层的左上角往右往下移动遮罩层宽高的一半才行，即鼠标在盒子里的坐标减去盒子高度的一半和宽度的一半就是我们mask 的最终 left 和top值了
        var maskX = x - mask.offsetWidth / 2;
        var maskY = y - mask.offsetHeight / 2;
        // (3) 我们mask 遮罩层水平移动的距离即maskX= 遮罩层的父盒子的宽-遮罩层的宽，而遮罩层垂直移动的距离即maskY= 遮罩层的父盒子的高-遮罩层的高
        // (4) 如果x 坐标小于了0 就让他停在0 的位置
        // 遮挡层的最大移动距离= 遮罩层的父盒子的宽-遮罩层的宽（因为此案例的遮罩层是一个正方形，所以水平和垂直的范围是一致的）
        var maskMax = preview_img.offsetWidth - mask.offsetWidth;   // 遮罩层的最大移动距离
        // 用if判断限定遮罩层的可移动范围：水平可移动范围：
        if (maskX <= 0) {   // 遮罩层水平移动最小不能小于0
            maskX = 0;
        } else if (maskX >= maskMax) {  // 遮罩层水平最大移动不能大于maskMax
            maskX = maskMax;
        }
        // 垂直可移动范围
        if (maskY <= 0) {   // 遮罩层垂直移动最小也不能小于0
            maskY = 0;
        } else if (maskY >= maskMax) {  // 遮罩层垂直最大移动不能大于maskMax(遮罩层是正方形)
            maskY = maskMax;
        }
        mask.style.left = maskX + 'px';
        mask.style.top = maskY + 'px';
        // 3. 大图片的移动距离 = 遮挡层移动距离 * 大图片最大移动距离 / 遮挡层的最大移动距离
        // 获取大图
        var bigIMg = document.querySelector('.bigImg');
        // 大图片最大移动距离
        var bigMax = bigIMg.offsetWidth - big.offsetWidth;
        // 大图片的移动距离 X Y
        var bigX = maskX * bigMax / maskMax;
        var bigY = maskY * bigMax / maskMax;
        // 注意：1.bigImg获取到的元素需要有CSS定位属性才能移动位置的，没有定位位置是不会变的哦
        // 2.大图的移动和遮罩层移动的方向是相反的哦，因为遮罩层往左移动时实际上大图是要往右移动的，所以值是负数
        bigIMg.style.left = -bigX + 'px';
        bigIMg.style.top = -bigY + 'px';

    })

    // 下面是detail界面的商品介绍模块的tab栏切换功能模块
    var tab_list = document.querySelector('.detail_tab_list');  // 获取到tab栏的父元素级div
    var lis = tab_list.querySelectorAll('li');  // 获取到tab栏里面的所有li
    var tabs = document.querySelectorAll('.item');  // 获取到所有的.item div元素
    for (var i = 0; i < lis.length; i++) {
        lis[i].setAttribute('data-index', i);    // 给每个li添加一个data-index的属性,值是它们自己在lis中的下标，这个值主要让我们判断我们当前点击的是哪个li从而帮助我们后续修改它对应的div的display值
        lis[i].onclick = function () {
            // 1.第一步，用排他思想先做出用户点击谁就给谁class属性赋值，注意其他没有被点击的都需要操作它们的class值为空，这就是干掉其他人留下我自己的排他思想
            for (var i = 0; i <lis.length; i++) {
                lis[i].className = '';  // 用循环先将所有人（包括自己）的class类名为空
            }
            // 再单独给自己修改class类名即留下我自己
            this.className = 'current';  // current这个类名的CSS样式是已经写好了的
            
            // 然后上面的tab栏样式好了就要处理第二步就是点击谁就让其对应的下属div显示出来，其他没有被点击的就隐藏，这里主要是需要先知道用户点击的是谁，然后再给对象的div设置display为block即可。还是需用用排他思想来做哦
            // 第二步：根据点击修改div的display属性值
            var index = this.getAttribute('data-index'); // 获取当前被点击的li的index
            for (var i = 0; i < lis.length; i++) { // 用循环让每个item的display都为none即干掉所有人
                tabs[i].style.display = 'none';
            }
            // 在tabs中锁定li的index对应的item单独将它的display值改成block即留下我自己
            tabs[index].style.display = 'block';
        }
    }

    // 下面是侧边栏的功能块
    // 下面是侧边栏中的“问题反馈”模块
    var sliderbar = document.querySelector('.sliderbar');
    var con = document.querySelector('.con');
    // 当我们鼠标经过 sliderbar 就会让 con这个盒子滑动到左侧
    sliderbar.addEventListener('mousemove', function () {
        
        // animate(obj, target, callback)
        animate(con, 0, function () {    // con是往左走所以是负数
            //回调函数：动画执行完后修改箭头的指向→
            sliderbar.children[0].innerHTML = '→';
        });
    })
    // 当我们鼠标离开 sliderbar 就会让 con这个盒子滑动到右侧
    sliderbar.addEventListener('mouseout', function () {
        // animate(obj, target, callback)
        animate(con, 200, function () {
            //回调函数：动画执行完后修改箭头的指向←
            sliderbar.children[0].innerHTML = '←';
        })
    })
    // 下面是侧边栏的定位控制和“回到顶部”的显示与隐藏控制
    // 获取元素
    var sliderBar = document.querySelector('.slider-bar');
    var main = document.querySelector('.nav');  // 用于决定侧边栏到哪儿变成固定定位的元素
    var recom = document.querySelector('.product_detail');   // 用于决定返回顶部按钮的显示位置
    var goBack = document.querySelector('.go-back');
    // 1.根据页面滚动来决定动态修改侧边栏的定位方式（固定和绝对）
    // 获取banner距离顶部的距离，用于决定banner置顶时侧边栏成固定定位
    var mainTop = main.offsetTop;
    // sliderBarTop 当我们侧边栏固定定位之后应该在的位置
    var sliderBarTop = sliderBar.offsetTop - mainTop;
    // recomTop 用于确定goBack即返回顶部的显示与隐藏
    var recomTop = recom.offsetTop
    // 2.document的全局注册滚动事件
    document.addEventListener('scroll', function () {
        // window.pageYOffset页面被卷去的头部大于等于bannerTop时，将侧边栏该为固定定位
        if (window.pageYOffset >= mainTop) {
            sliderBar.style.position = 'fixed';
            sliderBar.style.top = sliderBarTop + 'px';
        } else {
            sliderBar.style.position = 'absolute';
            sliderBar.style.top = '290px';
        }
        // 判断goBack的显示与隐藏
        if (window.pageYOffset >= recomTop) {
            goBack.style.display = 'block';
        } else {
            goBack.style.display = 'none';
        }
    });
    // 给 goBack “返回顶部”添加点击事件
    goBack.addEventListener('click', function () {
        // 使用window.scroll(X, Y);即可将窗口调整到对应位置，注意XY不跟单位，直接写数值即可
        // window.scroll(0, 0);    // 这样写是可以回到顶部的，但是没有动画效果太生硬了
        myAnimate(window, 0);  // 回到顶部的操作对象是页面窗口所以是window，目标位置是Y=0
    });
    // 把封装好的缓动动画拿过来改一下即可用作“回到顶部”的动画了
    function myAnimate(obj, target, callback) {
        // 先清除以前的定时器，只保留当前的一个定时器执行
        clearInterval(obj.timer);
        obj.timer = setInterval(function() {
            // 步长值写到定时器的里面
            // 把我们步长值改为整数 不要出现小数的问题
            var step = (target - window.pageYOffset) / 10;
            step = step > 0 ? Math.ceil(step) : Math.floor(step);
            if (window.pageYOffset == target) {
                // 停止动画 本质是停止定时器
                clearInterval(obj.timer);
                // 回调函数写到定时器结束里面
                // if (callback) {
                //     // 调用函数
                //     callback();
                // }
                callback && callback(); // 这种写法等价于上面的if判断
            }
            // 把每次加1 这个步长值改为一个慢慢变小的值  步长公式：(目标值 - 现在的位置) / 10
            // 最后把这个值给到Y即可，X的值是0，注：值不需要加px单位
            window.scroll(0, window.pageYOffset + step)
    
        }, 15);
    }

})