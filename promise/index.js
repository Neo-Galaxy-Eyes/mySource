//使用示例
const MyPromise = require('./myPromise')

let promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000)
  // reject('fail')
})

// promise.then(value => {
//   console.log(value)
// }, reason => {
//   console.log(reason)
// })

// promise.then(value => {
//   console.log(value)
// })

// promise.then(value => {
//   console.log(value)
// })

// promise.then(value => {
//   console.log(value)
// })

function other () {
  return new MyPromise((resolve, reject) => {
    throw new Error('executor error')
    resolve('other')
  })
}

let p1 = promise.then(value => {
  console.log(value)
  return p1
})

promise.then(value => {
  console.log(value)
  return other()
}).then(value => {
  console.log(value)
})

promise.then().then().then(value => console.log(value), reason => console.log(reason))

promise.then(value => {
  console.log(value)
  throw new Error('then error')
}, reason => {
  console.log(reason.message)
}).then(value => {
  console.log(value)
}, reason => {
  console.log(reason.message)
})