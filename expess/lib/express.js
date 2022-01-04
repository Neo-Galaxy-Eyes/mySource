const App = require('./application')

//加载express，实际上就是加载这个函数
function createApplication () {
  //返回可供重复新建的实例给外部
  const app = new App()
  return app
}

module.exports = createApplication