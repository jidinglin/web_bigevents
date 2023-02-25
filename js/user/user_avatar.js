$(function () {
    let layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 上传按钮 注册点击事件
    $('#btnChooseImage').click(function () {
        $('#file').click()
    })

    // 文件框 注册change事件
    $('#file').on('change', function (e) {
        let files = e.target.files
        if (files.length === 0) return layer.msg('请选择图片')
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 确定按钮 注册点击事件
    $('#btnUpload').click(function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                width: 100,
                height: 100
            })
            .toDataURL('image/png')

            $.ajax({
                method:'POST',
                url:'/my/update/avatar',
                data:{
                    avatar:dataURL
                },
                success: function(res) {
                    if(res.status !== 0) return layer.msg('更新头像失败')
                    layer.msg('更新头像成功')
                    window.parent.getUserInfo()
                }
            })
    })
})