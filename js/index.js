window.addEventListener('load', function () {
    var arrow_l = document.querySelector('.arrow-l');
    var arrow_r = document.querySelector('.arrow-r');
    var focus = document.querySelector('.focus');
    var focusWidth = focus.offsetWidth; // 获取图片的宽度（图片的宽度就是父元素的宽度）
    // 1.鼠标经过focus把左右按钮显示出来
    focus.addEventListener('mouseenter', function () {
        arrow_l.style.display = 'block';
        arrow_r.style.display = 'block';
        // 鼠标经过的时候还要让轮播图的定时器停止
        clearInterval(timer);
        timer = null;   // 把定时器变量timer释放掉
    })
    // 2.鼠标离开focus把左右按钮隐藏起来
    focus.addEventListener('mouseleave', function () {
        arrow_l.style.display = 'none';
        arrow_r.style.display = 'none';
        // 鼠标离开定时器的轮播图效果又开启
        timer = setInterval(function () {
            // 自动调用执行右侧点击事件
            arrow_r.click();
        }, 3000)
    })
    // 3.动态生成小圆点，轮播图有几张就生成几个小圆点即可
    var ul = focus.querySelector('ul');
    var ol = focus.querySelector('.circle');
    for (var i = 0; i < ul.children.length; i++) {
        var li = document.createElement('li');
        // 记录当前的小圆点的索引号以便后续使用索引号来切换图片，通过自定义属性来做
        li.setAttribute('index', i);
        ol.appendChild(li)
        // 4.小圆点的排他思想：我们可以在生成小圆点的同时直接绑定点击事件
        li.addEventListener('click', function () {
            // 干掉所有人：把所有的小li的类名都清空
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            // 留下我自己：给当前被点击的li添加一个current类名即可
            this.className = 'current';
            // 5.点击小圆点移动图片（当然移动的其实是ul）
            // ul的移动距离 = 小圆点的索引号index 乘以 图片的宽度（注意是负值）
            // 当我们单击了某一个小圆点，就获取到当前小圆点的索引号
            var index = this.getAttribute('index'); // 获取当前小圆点的索引号
            // 需要把index的值赋值给num和circle，这样按钮切换、小圆点的显示和图片的轮播才能同步上
            num = circle = index;
            // 轮播图通过动画效果来切换，所以直接用我们提前封装好的animate动画函数animate(obj, target, callback)即可
            animate(ul, -index * focusWidth)
        })
    }
    // 把ol里面的第一个小li添加一个类名为current
    ol.children[0].className = 'current';
    // 6.克隆第一张图片(即第一对li)添加到ul的最后面方便实现轮播图的无缝轮播效果
    var first = ul.children[0].cloneNode(true); // cloneNode克隆节点值为true则深克隆，为false则浅克隆
    ul.appendChild(first)
    // 7.点击右侧按钮图片切换一张
    var num = 0;    // num负责的是轮播图的图片切换
    var circle = 0; // circle负责的是小圆点的类名归属
    var flag = true;  // 设置节流阀，控制我们的按钮不能点击太快，只能一张一张的切换
    // 右侧按钮的点击事件
    arrow_r.addEventListener('click', function () {
        if (flag) {
            flag = false;  // 关闭节流阀，让按钮事件不可再触发,知道动画执行完毕
            // 图片的无缝滚动：原理就是把第一张图片复制一张放到最后面，当切换到最后一张时再切换时就快速的把ul的left=0，同时让num=0
            if (num == ul.children.length - 1) {
                ul.style.left = 0;  // 快速的让ul的left=0，相当于快速的跳回了第一张
                num = 0;    // 让num从0又开始
            }
            num++;
            animate(ul, -num * focusWidth, function () {
                flag = true;  // 回调函数中来打开节流阀，这样右按钮就又可以执行切换事件了
            })
            // 8.点击右侧按钮，小圆点跟着一起变化，circle用于控制小圆点的current类名的归属（排他思想）
            circle++;       // 点击右侧切换按钮就让circle+1
            circle = circle == ol.children.length ? 0 : circle;     // 判断如果circle==ol.children.length，说明现在走到了最后一张到克隆那张了则复原小圆点
            circleChange(); // 调用函数
        }
    })
    // 9.左侧按钮的点击事件
    arrow_l.addEventListener('click', function () {
        if (flag) {
            flag = false;  // 关闭节流阀，让按钮事件不可再触发,知道动画执行完毕
            // 当位于第一张图时点击需要跳转到最后一张（不算克隆那张）
            if (num == 0) {
                num = ul.children.length - 1;    // 让num从最后一张的索引开始
                ul.style.left = -num * focusWidth + 'px';  // 快速的让ul的left跳到第四张图片的位置
            }
            num--;
            animate(ul, -num * focusWidth, function () {
                flag = true;  // 回调函数中来打开节流阀，这样左按钮就又可以执行切换事件了
            })
            // 8.点击右侧按钮，小圆点跟着一起变化，circle用于控制小圆点的current类名的归属（排他思想）
            circle--;       // 点击右侧切换按钮就让circle+1
            circle = circle < 0 ? ol.children.length - 1 : circle;     // 判断如果circle小于0，则小圆点应该显示在最后一张的位置了
            circleChange(); // 调用函数
        }
    })
    // 因为左右按钮都用到了这一块相同的代码，所以把它们封装成一个函数直接调用减少代码量
    function circleChange() {
        // 然后用排他思想修改小圆点的类名
        // 干掉所有人，ol里面的所有li的类名都为空
        for (var i = 0; i < ol.children.length; i++) {
            ol.children[i].className = '';
        }
        // 留下我自己，给当前这个li单独添加上current的类名即可
        ol.children[circle].className = 'current';
    }
    // 10.自动播放轮播图功能
    var timer = this.setInterval(function () {
        // 其实图片的切换效果我们已经写好了，效果就和点击右侧按钮一样，所以在定时器内我们只需要手动调用右侧点击事件即可
        arrow_r.click();
    }, 3000)

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
    var main = document.querySelector('.main');
    var recom = document.querySelector('.recom');
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
            sliderBar.style.top = '300px';
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

    // 注：以下JS是学习了jQuery后增加的，所以这部分代码需要依赖jQuery文件
    // 电梯导航功能模块实现
    // 1.控制电梯导航的显示与隐藏：当滚动到“今日推荐”部分才显示出来
    var toolTop = $(".recom").offset().top;
    var flagTo = true; // 节流阀-互斥锁:控制我们点击电梯导航让页面跳转时不触发根据页面滚动来修改电梯导航模块的背景样式(toggleTool()函数里面的第二点)
    toggleTool();  // 当页面加载完自动调用一次函数判断一下此刻的电梯导航的显隐
    function toggleTool(){
        // 1.页面发生滚动就调用函数判读电梯导航的显隐
        if ($(document).scrollTop() >= toolTop) {
            $(".fixedtool").fadeIn();
        } else {
            $(".fixedtool").fadeOut();
        }
        // 2.判断页面滚动到电梯导航对应的那个内容区域从而修改对应电梯导航的样式来匹配
        if (flagTo) {   // 如果节流阀为false则不执行此代码，节流阀只在点击电梯导航跳转时关闭
            $(".floor .w").each(function (i, ele) {
                if ($(document).scrollTop() >= $(ele).offset().top) {
                    $(".fixedtool li").eq(i).addClass("current").siblings().removeClass();
                }
            })
        }
    }
    $(window).scroll(function () {
        // 1.页面发生滚动就调用函数判读电梯导航的显隐
        toggleTool();
        
    })
    // 2.点击电梯导航页面可以滚动到相应的内容区域
    $(".fixedtool li").click(function () {
        flagTo = false;  // 点击电梯导航时关闭节流阀，不然此时修改样式会有BUG
        // 我们通过$(this).index()知道我们点击的是哪个li
        // 当我们点击li时，就需要计算出页面需要去往的位置数据,选出对应索引号的内容区的盒子，计算出它的offset().top;
        var current = $(".floor .w").eq($(this).index()).offset().top;
        // 页面使用动画来滚动到对应的位置：
        $("body, html").stop().animate({
            scrollTop: current
        },function () {
            flagTo = true;  // 动画的回调函数里再打开节流阀，让我们修改样式的代码能重新被执行
        })
        
        // 点击了对应的小li之后还应该将被点击的小li的样式修改一下
        // 注意这里使用的是排他思想哦，当前的样式添加了其他的兄弟li样式要移除才行
        $(this).addClass("current").siblings().removeClass();
    })
})