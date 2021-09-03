window.onload = function(){
    // 定义正则
    var regtel = /^1[3|4|5|7|8]\d{9}$/;  // 验证手机号的正则表达式
    var regqq = /^[1-9]{4,}$/;  // QQ的正则格式
    var regnc = /^[\u4e00-\u9fa5]{2,8}$/;   // 昵称：2-8个汉字的正则格式
    var regmsg = /^\d{6}$/; // 刚好6位数字的短信验证
    var regpwd = /^[a-zA-Z0-9_-]{6,16}$/;  // 密码的正则格式：字母数字下划线-等组成6-16位

    // 获取元素
    var tel = document.querySelector("#tel");
    var qq = document.querySelector("#qq");
    var nc = document.querySelector("#nc");
    var msg = document.querySelector("#msg");
    var pwd = document.querySelector("#pwd");
    var surepwd = document.querySelector("#surepwd");


    // 使用元素调用函数传入参数
    regexp(tel, regtel);
    regexp(qq, regqq);
    regexp(nc, regnc);
    regexp(msg, regmsg);
    regexp(pwd, regpwd);



    // 将验证的过程封装成一个函数
    function regexp(ele, reg) {
        ele.onblur = function () {
            if(reg.test(this.value)) {
                this.nextElementSibling.className = 'success';
                this.nextElementSibling.innerHTML = '<i class="success_icon"></i>格式输入正确！';
            } else {
                this.nextElementSibling.className = 'error';
                this.nextElementSibling.innerHTML = '<i class="error_icon"></i>输入格式有误，请重新输入';
            }
        }
    }

    // 确认密码功能验证
    surepwd.onblur = function() {
        if(this.value == pwd.value) {
            this.nextElementSibling.className = 'success';
            this.nextElementSibling.innerHTML = '<i class="success_icon"></i>确认密码成功！';
        } else {
            this.nextElementSibling.className = 'error';
            this.nextElementSibling.innerHTML = '<i class="error_icon"></i>两次输入密码不一致！';
        }
    }
}