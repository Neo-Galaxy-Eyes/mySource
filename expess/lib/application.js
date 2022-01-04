const http = require('http')
const Router = require('./router')
const methods = require('./methods')

function App () {
  //所有与路由相关的逻辑，都交由Router模块管理和维护
  this._router = new Router()
}

//先收集路由
methods.forEach(method => {
  App.prototype[method] = function (path, ...handlers) {
    //原封不动地将相关参数交由Router模块处理
    this._router[method](path, handlers)
  }
})
// App.prototype.get = function (path,handler) {
//   this._router.get(path, handler)
// }

App.prototype.use = function (path, ...handlers) {
  this._router.use(path, handlers)
}

//参数包含端口号、回调函数
App.prototype.listen = function (...args) {
  const server = http.createServer((req, res) => {
    this._router.handle(req,res)
  })
  server.listen(...args)
}

module.exports = App