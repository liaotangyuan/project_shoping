// 专属于购物车详情页面的外部js文件
$(function () {
    // 全选/全不选功能模块：复选框的checked属性值为true则为选中状态
    // 1.给“全选”按钮添加上change事件，让它的状态决定商品子选项的选择状态
    $(".checkall").change(function () {
        // $(this).prop("checked") 返回的是“全选”按钮的状态，true或false
        $(".j-checkbox, .checkall").prop("checked", $(this).prop("checked"))
        // 判断选择的状态决定是否添加背景样式
        if ($(this).prop("checked")) {
            // 给被选中的商品添加一个背景颜色,其实就是添加check-cart-item类名
            $(".cart-item").addClass("check-cart-item");
        } else {
            // 否则就移除check-cart-item类名
            $(".cart-item").removeClass("check-cart-item");
        }
    })
    // 2.当子选项被触发change事件就判断子选项被当前选中的个数若等于了子选项的个数那么就勾上“全选”,不等于就不勾
    $(".j-checkbox").change(function () {
        // $(".cart-item:checked").length  这个得到的是子选项为选中状态的个数
        // $(".cart-item").length  这个得到的是子选项总共的个数（此案例有三个商品所以长度是3）
        if ($(".j-checkbox:checked").length === $(".j-checkbox").length) {
            $(".checkall").prop("checked", true);
        } else {
            $(".checkall").prop("checked", false);
        }
        // 判断选择的状态决定是否添加背景样式
        if ($(this).prop("checked")) {
            // 给被选中的商品添加一个背景颜色,其实就是添加check-cart-item类名
            $(this).parents(".cart-item").addClass("check-cart-item");
        } else {
            // 否则就移除check-cart-item类名
            $(this).parents(".cart-item").removeClass("check-cart-item");
        }
    })

    // 3.商品数量的增减以及增减后商品小计价格的更正功能模块
    // 数量的增 increment
    $(".increment").click(function () {
        // 先获取到当前的商品的数量 n
        var n = $(this).siblings('.itxt').val()
        n++
        // 在商品原先的数量上+1后再重新赋值在商品的数量上显示即可
        $(this).siblings('.itxt').val(n)

        // 商品的数量发生的变化，商品的价格小计也要随之更正才行：注意被修改的元素一定要从当前被操作的元素(即this)的角度出发逐层去锁定这个元素
        // 商品的小计 = 商品的单价 * 商品的数量
        // 商品的单价：p
        // var p = $(this).parent().parent().siblings(".p-price").html();
        // parents() 返回所有祖先元素，也可以指定返回某一个祖先元素
        var p = $(this).parents(".p-num").siblings(".p-price").html();
        p = p.substr(1) // 将拿到的单价中的￥符号截取掉才能进行后续的运算
        // toFixed(2)结果保留2位小数
        $(this).parents(".p-num").siblings(".p-sum").html("￥" + (p * n).toFixed(2))
        getSum()
    })
    // 数量的减 decrement
    $(".decrement").click(function () {
        var n = $(this).siblings('.itxt').val()
        if (n == 1) {
            return false;
        }
        n--
        $(this).siblings('.itxt').val(n)

        // 商品的数量发生的变化，商品的价格小计也要随之更正才行：注意被修改的元素一定要从当前被操作的元素(即this)的角度出发逐层去锁定这个元素
        // 商品的小计 = 商品的单价 * 商品的数量
        // 商品的单价：p
        var p = $(this).parents(".p-num").siblings(".p-price").html();
        p = p.substr(1) // 将拿到的单价中的￥符号截取掉才能进行后续的运算
        // toFixed(2)结果保留2位小数
        $(this).parents(".p-num").siblings(".p-sum").html("￥" + (p * n).toFixed(2))
        getSum()
    })

    // 4.数量文本框的值被手动修改也要重新计算小计价格
    $(".itxt").change(function () {
        // 获取当前修改后的商品数量
        var n = $(this).val()
        // 然后商品小计还是 = 商品数量 * 商品单价
        // 商品的单价：p
        var p = $(this).parents(".p-num").siblings(".p-price").html();
        p = p.substr(1) // 将拿到的单价中的￥符号截取掉才能进行后续的运算
        // toFixed(2)结果保留2位小数
        $(this).parents(".p-num").siblings(".p-sum").html("￥" + (p * n).toFixed(2))
        getSum()
    })

    // 5.计算数量总和以及价格总和并修改页面更正
    getSum();  // 页面加载就先调用一次函数修正当前显示的商品的件数和价格
    function getSum() {
        var count = 0;  // 计算总件数
        var money = 0;  // 计算总价格
        // 商品件数是遍历每一个itxt中的数量进行累加和即可
        $(".itxt").each(function(i, ele) {
            count += parseInt($(ele).val())
        })
        $(".amount-sum em").text(count);
        // 商品的总价格是遍历每一个商品的小计p-sum进行累加和即可
        $(".p-sum").each(function (i, ele) {
            money += parseFloat($(ele).text().substr(1))
        })
        $(".price-sum em").text("￥"+money.toFixed(2));
    }

    // 6.删除商品功能模块（有三个地方都可以删除商品：删除、删除选中的商品、清空购物车）
    // (1)删除商品（删除的是当前点击的模块的那个商品，所以一定要从this的角度出发）
    $(".p-action").click(function () {
        $(this).parents(".cart-item").remove();
        getSum();
    })
    // (2)删除选中的商品，判断哪个或哪几个被选中再执行删除即可
    $(".remove-batch").click(function () {
        $(".j-checkbox:checked").parents(".cart-item").remove();
        getSum();
    })
    // (3)清空购物车（就是删除所有商品）
    $(".clear-all").click(function () {
        $(".cart-item").remove();
        getSum();
    })

})