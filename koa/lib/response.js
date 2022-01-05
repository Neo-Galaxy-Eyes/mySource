
const response = {
  set status (value) {
    this.res.statusCode = value
  },

  _body: '', //用来存储数据

  get body () {
    return this._body
  }

  set body (value) {
    this._body = value
  }
}

module.exports = response