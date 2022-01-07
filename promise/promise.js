const MyPromise = require("./myPromise")

class promise {
  constructor (executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }

  status = 'pending'
  value = undefined
  reason = undefined

  successCallback = []
  failCallback = []

  resolve = vaule => {
    if (this.status !== 'pending') return
    this.status = 'fullfilled'
    this.value = value
  }

  reject = reason => {
    if (this.status !== 'pending') return
    this.status = 'rejected'
    this.reason = reason
  }

  then (successcallback, failcallback) {
    successcallback = successcallback? successcallback : value => value
    failcallback = failcallback? failcallback : reason = > {throw (reason) }

    if (this.status == 'fullfill') {
      setTimeout(() => {

      },0)
    } else if (this.status == 'rejected') {
      setTimeout(() => {
        
      }, 0)
    } else {
      this.successCallback.push(() => {

      })
      this.failCallback.push(() => {

      })
    }
  }
}

function mypromise (fn) {
  try {
    fn(resolve, reject)
  } catch (e) {
    reject(e)
  }
  var self = this
  this.state = 'pending'
  this.value = undefined
  this.reason = undefined
  this.resolveCallbacks = []
  this.rejectCallbacks = []

  function resolve (value) {
    if (value instanceof mypromise) {
      return value.then(resolve, reject)
    }

    setTimeout(() => {
      if (self.state === 'pending') {
        self.state = 'resolved'
        self.value = value

        self.resolveCallbacks.forEach(callback => {
          callback(value)
        })
      }
    }, 0);
  }
}

mypromise.prototype.then = function (success, fail) {
  success = typeof success === 'function' ? success : value => value
  fail = typeof fail === 'function' ? fail : err => {throw err}

  if (this.state == 'pending') {
    this.resolveCallbacks.push(success)
    this.rejectCallbacks.push(fail)
  }

  if (this.state == 'resolved') {
    success(this.value)
  }

  if (this.state == 'rejected') {
    fail(this.reason)
  }
}