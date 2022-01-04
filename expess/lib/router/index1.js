const url = require('url')
const methods = require('methods')
const Layer = require('./layer')


function Router () {
  this.stack = []
}

method.forEach(method => {
  Router.prototype.[method] = function (path,handler) {
    const layer = new Layer(path, handler)
    layer.method = method
    this.stack.push(layer)
    // this.stack.push({
    //   path,
    //   method,
    //   handler
    // })
  }
})
// Router.prototype.get = function (path,handler) {
//   this.stack.push({
//     path,
//     method: 'get',
//     handler
//   })
// }

Router.prototype.handle = function (req,res) {
  //当客户端发送的请求进来时，执行下面逻辑
  const { pathname } = url.parse(req.url)
  const method = req.method.toLowerCase()
  //举例：假设此时this.stack里面已经存在键值对为path:'/users/:userId/books/:bookId的对象，现在客户端传来了/users/12/books/34的请求
  const layer = this.stack.find(layer => {
    //接下来看layer.js -> line10
    //match为分组匹配得到的数组：['/users/12/books/34', '12', '34', index: 0, input: '/users/12/books/34', groups: undefined]
    const match = layer.exec(pathname)
    if (match) {
      req.params = req.params || {}
      Object.assign(req.params, layer.params)
    }
    return match && layer.method === method
  })
  if (route) {
    //执行routes里面存储的响应逻辑，与中间件相关，且可能存在异步逻辑
    return route.handler(req, res)
  }
  res.end('404 Not Found.')
}

module.exports = Router