const url = require('url')
const methods = require('./methods')
const Layer = require('./layer')
const Route = require('./route')


function Router () {
  this.stack = []
}

method.forEach(method => {
  Router.prototype.[method] = function (path,handlers) {
    const route = new Route()
    const layer = new Layer(path, route.dispatch.bind(route))
    layer.route = route
    this.stack.push(layer)
    route[method](path, handlers)
  }
})

Router.prototype.handle = function (req,res) {
  const { pathname } = url.parse(req.url)
  const method = req.method.toLowerCase()

  let index = 0
  const next = () => {
    if (index >= this.stack.length) {
      return res.end(`Can not get ${pathname}`)
    }
    const layer = this.stack[index++]
    const match = layer.match(pathname)
    if (match) {
      req.params = req.params || {}
      Object.assign(req.params, layer.params)
    }
    //顶层只判定请求路径，内层判定请求方法
    if (match) {
      //顶层在这里调用的handler，其实就是dispatch函数
      //匹配到，继续再调用下一个中间件
      return layer.handler(req, res, next)
    }
    //没有匹配到，调用下一个中间件
    next()
  }
  next()
}

Router.prototype.use = function (path, handlers) {
  if (typeof path === 'function') {
    handlers.unshift(path)
    path = '/'
  }
  handlers.forEach(handler => {
    const layer = new Layer(path)
    layer.isUseMiddleware = true
    this.stack.push(layer)
  })
}

module.exports = Router