function MyEvent () {
	this._events = Object.create(null)
}
MyEvent.prototype.on = function (type, callback) {
	if (this._events[type]) {
		this._events[type].push(callback)
	} else {
		this._events[type] = [callback]
	}
}

MyEvent.prototype.emit = function (type, ...args) {
	if (this._events && this._events[type].length) {
		this._events[type].forEach((callback) => {
			callback.call(this, ...args)
		})
	}
}

MyEvent.prototype.off = function (type, callback) {
	if (this._events && this._events[type]) {
		this._events[type] = this._events[type].filter((item) => {
			return item !== callback && item.link !== callback
		})
	}
}

MyEvent.prototype.once = function (type, callback) {
	let foo = function (...args) {
		callback.call(this, ...args)
		this.off(type, foo)
	}
	foo.link = callback //联动off部分
	this.on(type, foo)
}