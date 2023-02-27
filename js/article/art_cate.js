$(function () {
    let layer = layui.layer
    let form = layui.form
    // 获取文章列表 
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return '获取文章列表失败'
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 添加按钮 注册事件
    let indexAdd = null
    $('#btnAddCate').click(function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });

        $('body').on('submit', '#form-add', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) return layer.msg('添加文章分类失败')
                    layer.msg('添加文章分类成功')
                    initArtCateList()
                    layer.close(indexAdd)
                }
            })
        })
    })

    // 编辑按钮 注册事件
    let indexEdit = null
    $('tbody').on('click', '#btn-edit', function () {
        //  弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        // 根据id发起请求获取数据
        let id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })

        //   表单提交
        $('body').on('submit', '#form-edit', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) return layer.msg('更新分类信息失败')
                    layer.msg('更新分类信息成功')
                    layer.close(indexEdit)
                    initArtCateList()
                }
            })
        })
    })

        // 删除文章 注册事件
        $('tbody').on('click','#btn-delete',function() {
            let id = $(this).attr('data-id')
            layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
                $.ajax({
                    method:'GET',
                    url:'/my/article/deletecate/'+id,
                    success: function(res) {
                        if(res.status !== 0) return layer.msg('删除文章分类失败')
                        layer.msg('删除文章分类成功')
                        layer.close(index)
                        initArtCateList()
                    }
                })  
                
              });
        })

})