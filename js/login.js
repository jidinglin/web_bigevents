$(function() {
    // 点击注册链接
    $('#link_reg').on('click',function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击登录链接
    $('#link_login').on('click',function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从layui 获取form对象
    let form = layui.form
    // 获取layer对象
    let layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/,'密码6~12位且不能有空格'],
        repwd: function(value) {
            let pwd = $('.reg-box [name=password]').val()
            if(pwd !== value) return '两次密码不一致'
        }
    })

    // 先给注册表单 添加提交事件
    let data = {
        username: $('#form_reg [name=username]').val(),
        password:$('#form_reg [name=password]').val()
    }
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        $.post('http://www.liulongbin.top:3007/api/reguser',data,function(res) {
            if(res.status !== 0) return layer.msg(res.message)
            layer.msg('注册成功,请登录')
            $('#link_login').click()
        })
    })

    // 给登录表单 添加提交事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault()
        $.post('http://www.liulongbin.top:3007/api/login',$(this).serialize(),function(res) {
            if(res.status !== 0) return layer.msg(res.message)
            layer.msg('登录成功')
            localStorage.setItem('token',res.token)
            location.href = '/index.html'
        })
    })

    
})