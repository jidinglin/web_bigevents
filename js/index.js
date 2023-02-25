$(function () {
    getUserInfo()

    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 1.清空token
            localStorage.removeItem('token')
            // 2.跳转到登录页面
            location.href = '/login.html'
            layer.close(index);
        });
    })
})

// 获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 渲染用户头像和文字
            renderAvatar(res.data)
        },
        complete: function(res) {
            if(res.responseJSON.status === 1
                 && res.responseJSON.message ==='身份认证失败') {
                    localStorage.removeItem('token')
                    location.href = '/login.html'
            }
        }

    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 文字
    let name = user.nickname || user.username
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 头像
    if (user.user_pic !== null) {
        // 图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 文字头像
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()
    }

}