//看代码的时候不要跳进去，从外部来理解黑箱内实现的是什么功能
//使用示例
const Koa = require('./koa')

const app = new Koa()

const one = (ctx, next) => {
  console.log('>>> one')
  next()
  console.log('<<< one')
}

const two = (ctx, next) => {
  console.log('>>> two')
  next()
  console.log('<<< two')
}

const three = (ctx, next) => {
  console.log('>>> three')
  next()
  console.log('<<< three')
}

app.use(one)
app.use(two)
app.use(three)

//本质上是http模块的server来监听这个端口
app.listen(3000)