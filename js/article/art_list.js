$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 时间过滤器
    template.defaults.imports.dateFormat = function (date) {
        let dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZaro(dt.getMonth() + 1)
        let d = padZaro(dt.getDate())

        let hh = padZaro(dt.getHours())
        let mm = padZaro(dt.getMinutes())
        let ss = padZaro(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 补零函数
    function padZaro(n) {
        return n > 9 ? n : '0' + n
    }

    // 发请求获取新闻列表
    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    }

    initTable()
    initCate()

    function initTable() {

        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章列表失败！')
                layer.msg('获取文章列表成功！')
                // 渲染表格
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 渲染分页
                renderPage(res.total)
            }
        })
    }

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章分类失败')
                // 渲染分类的可选项
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_name]').html(htmlStr)
                form.render()
            }
        })
    }

    // 筛选按钮 提交事件
    $('#form-search').submit(function (e) {
        e.preventDefault()
        // 拿到表单的值 分类和状态
        let cate_name = $('[name=cate_name]').val()
        let state = $('[name=state]').val()

        // 为参数对象q赋值
        q.cate_id = cate_name
        q.state = state

        // 重新获取表格
        initTable()
    })

    // 渲染分页区域的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 7, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除按钮
    $('tbody').on('click','#btn-delete',function() {
        let id = $(this).attr('data-id')
        let len = $(this).length

        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/' + id,
                success: function(res) {
                    if(res.status !== 0) return layer.msg('删除失败！')
                    layer.msg('删除成功！')
                    // 判断 再渲染
                    if(len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum-1
                    } 
                    
                    initTable()
                }
            })
            layer.close(index);
          });
    })
})