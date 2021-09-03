window.addEventListener('load', function () {
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
    var recom = document.querySelector('.sk_bd');   // 用于决定返回顶部按钮的显示位置
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
            sliderBar.style.top = '306px';
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