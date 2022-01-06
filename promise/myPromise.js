const PENDING = "pending"
const FULFILLED = 'fullfilled'
cosnt REJECTED = 'rejected'


class MyPromise {
  constructor (executor) {
    try {
      //对应传进promise类的函数会被直接调用
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }

  status = PENDING
  value = undefined
  reason = undefined

  successCallback = []
  failCallback = []

  resolve = value => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    //resolve(x) 同步代码，保存此时传入resolve的值
    this.value = value
    //适用于多个promise.then串行的场合
    while (this.successCallback.length) this.successCallback.shift()()
  }

  reject = reason => {
    //防止reject接着resolve执行
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while (this.failCallback.length) this.failCallback.shift()()
  }

  //调用successCallback或failCallback
  then (successCallback, failCallback) {
    //确保then里面没有任何逻辑依然能向下执行
    successCallback = successCallback ? successCallback : value => value
    failCallback = failCallback ? failCallback : reason => { throw reason }
    //只有返回promise，才能确保后面能够链式调用then
    //为了便于快速理解，下面代码也可以看做是没有new MyPromise(resolve, reject) => {...} 而立即执行的函数
    let promise2 = new MyPromise ((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = successCallback(this.value)
            //将值传递到下一个then的成功回调里面
            //为了获取promise2，上面使用了setTimeout
            resolvePromise(promise2, x, resolve, reject)
          } catach (e) {
            reject(e)
          }
        }, 0);
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
              let x = failCallback(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catach (e) {
              reject(e)
            }
          }, 0);
      } else {
        //要思考，这样做是为了解决什么问题
        //当前存在一个类似于setTimeout的回调，状态未明确，所以要先把then里面的成功回调和失败回调存储起来，不执行。等待resolve(x)或reject(x)被触发的时候再执行
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              let x = successCallback(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catach (e) {
              reject(e)
            }
          }, 0);
        })
        this.failCallback.push(
          //使用箭头函数是为了能让try执行
          () => {
         setTimeout(() => {
          try {
            let x = failCallback(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catach (e) {
              reject(e)
            }
         }, 0);
        })
      }
    })
    return promise2
  }

  static all (array) {
    let result = []
    let index = 0
    return new MyPromise((resolve, reject) => {
      function addData (key, value) {
        result[key] = value
        index++
        if (index === array.length) {
          resolve(result)
        }
      }
      for (let i=0; i<array.length; i++) {
        let current = array[i]
        if (current instanceof MyPromise) {
          current.then(value => addData(i,value), reason => reject(reason))
        } else {
          addData(i, array[i])
        }
      }
      resolve(result)
    })
  }

  static resolve (value) {
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }

  finally (callback) {
    //无论是成功还是失败，都会执行
    return this.then(value => {
      return MyPromise.resolve(callback()).then(() => value)
    }, reason => {
      return MyPromise.resolve(callback()).then(() => { throw reason })
    })
  }

  catch (failCallback) {
    return this.then(undefined, failCallback)
  }
}

function resolvePromise (promise2, x, resolve, reject) {
  //调用成功回调返回的不能是自身
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promsie>'))
  }
  //判断x的值是普通值还是promise对象，前者直接调用resolve，后者需要查看返回的结果，再根据返回的结果，调用resolve或reject
  if (x instanceof MyPromise) {
    x.then(resolve,reject)
  } else {
    resolve(x)
  }
}


module.exports = MyPromise