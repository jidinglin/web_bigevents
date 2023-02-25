$.ajaxPrefilter(function(options) {
    options.url += 'http://www.liulongbin.top:3007'

    if(options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
})