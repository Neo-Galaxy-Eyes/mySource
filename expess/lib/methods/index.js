const http = require('http')

module.exports = getCurrentNodeMethods() || getBasicNodeMethods()

function getCurrentNodeMethods () {
  //返回当前node支持的所有请求方法
  return http.METHODS && http.METHODS.map(method => method.toLowerCase())
}

function getBasicNodeMethods () {
  return [
    'get',
    'post',
    'put',
    'head',
    'delete',
    'options'
  ]
}