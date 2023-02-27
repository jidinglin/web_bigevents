$(function () {
    let layer = layui.layer
    let form = layui.form

    // 加载分类
    initCate()
    // 初始化富文本编辑器
    initEditor()

    // 定义加载分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章分类列表失败！')
                // 渲染分类
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_name]').html(htmlStr)
                // 表单 重新渲染
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面按钮绑定事件
    $('#btnChooseImage').click(function () {
        $('#coverFile').click()
    })

    // 给文件选择框 注册change事件
    $('#coverFile').on('change', function (e) {
        let files = e.target.files
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    let art_state = '已发布'
    // 存为草稿按钮 注册事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 表单 提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        let fd = new FormData($(this)[0])
        fd.append('state', art_state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,
            success: function(res) {
                if(res.status !== 0) return layer.msg('发布文章失败')
                layer.msg('发布文章成功')

                location.href = '/大事件项目/article/art_list.html'
            }
        })
    }
})

