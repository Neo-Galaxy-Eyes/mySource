//该模块用于拓展router的功能

//用于处理路由路径的匹配，解析动态路由参数
const pathRegexp = require('path-to-regexp')

function Layer (path, handler) {
  this.path = path
  this.handler = handler
  this.keys = []
  //生成正则对象，同时keys为[{ name:'userId', optional: false, offset: 8 }, { name:'bookId', optional: false, offset: 30 }]
  this.regexp = pathRegexp(path.path, this.keys, {})
  this.params = {}
}

Layer.prototype.match = function (pathname) {
   //match为分组匹配得到的数组：['/users/12/books/34', '12', '34', index: 0, input: '/users/12/books/34', groups: undefined]
   const match = this.regexp.exec(pathname)
   if (match) {
     this.keys.forEach((key, index) => {
       //this.params = { userId: '12', bookId: '34'}
       this.params[key.name] = match[index+1]
     })
     return true
   }

   //匹配use中间件的路径处理
   if (this.isUseMiddleware) {
     if (this.path === '/') {
       return true
     }
     if (pathname.startsWith(`${this.path}/`)) {
       return true
     }
   }

   return false
   //接下来看index1.js -> line37
}

module.exports = Layer