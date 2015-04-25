// (function () {

var callbacks = {};
var callbackID = 0;
var empty = function () {};

window.$x = {
	send_message: function(method, args, callback) {
		method = method || 'foo';
		args = args || {};
		callback = callback || empty;
		callbacks[++callbackID] = callback;
		args['__cid'] = callbackID + '';
		var url = 'http://js/?method=' + method 
				+ '&args=' + encodeURIComponent(JSON.stringify(args));

		var ifr = document.createElement('iframe');
		ifr.style.display = 'none';
		document.body.appendChild(ifr);
		ifr.src = url;
		setTimeout(function () {
			document.body.removeChild(ifr);
		}, 0);
		return callbackID;
	},

	callback: function(cid, val) {
		var fn = callbacks[cid];
		fn && fn(val);
	},

	foo: function (val, cb) {
		$x.send_message('foo', {
			val: val
		}, cb);
	},

	/**
	 * refresh
	 */
	onRefresh: function () {
		// override this function plz;
		setTimeout($x.endRefresh, 1000);
	},

	endRefresh: function () {
		$x.send_message('endRefresh');
	},

	onKeyboardHeightChange: function (height) {
		// override 
	},

	setTitle: function (title) {
		$x.send_message('setTitle', {
			title: title
		});
	},

	enableScroll: function (enable) {
		$x.send_message('setScrollEnable', {
			enable: enable
		});
	},

	enableDragRefresh: function (enable) {
		$x.send_message('setDragRefreshEnable', {
			enable: enable
		});
	},

	showRightMenu: function (paging) {
		$x.send_message('showRightMenu', {
			paging: paging
		});
	},

	getConfig: function (callback) {
		$x.send_message('getConfig', {}, callback);
	},

	getCookie: function (url, callback) {
		$x.send_message('getCookie', {url: url}, callback);
	},

	/**
	buttons = [
		{title: '...', action: function () {...}}
	] 
	 */
	setRightBarItems: function (buttons) {
		$x.send_message('rightBarButtonItems', {
			buttons: buttons
		}, function (rsp) {
			var index = rsp.index;
			buttons[index].action && buttons[index].action();
		});
	},

	/**
	 * opts. = url, type, headers, success, error
	 *
	 */
	ajax: function (opts) {
		$x.send_message('ajax', opts, function (rsp) {
			console.log(rsp);
			if (rsp.code == 0) { // success
				opts.success && opts.success(rsp);
			} else {
				opts.fail && opts.fail(rsp.code, rsp.message);
			}
		});
	},

	getJSON: function (url, callback) {
		$x.ajax({
			url: url,
			success: callback
		});
	},

	/**
	 * opts. = url, animated, model, title, root
	 *
	 */	
	open: function (opts) {
		if (opts.animated === undefined) {
			opts.animated = true;
		}
		$x.send_message('openPageInCenter', opts);
	},

	dismiss: function () {
		$x.send_message('dismiss');
	},

	/**
	 *	publish/subscribe
	 */
	publish: function (name, value) {
		if (name == null) return ;
		$x.send_message('publish', {
			name: name,
			value: value || ''
		});
	},

	subscribe: function (name, callback) {
		if (name == null) return ;
		var cid = $x.send_message('subscribe', {
			name: name
		}, function(data) {
			callback && callback(data.value);
		});

		return {cid: cid + '', name: name};
	},

	unsubscribe: function (handler) {
		$x.send_message('unsubscribe', handler);
	},

	download: function (opts, callback) {
		if (typeof opts == 'string') {
			opts = {
				url: opts
			};
		}
		$x.send_message('download', opts, callback);
	},
	setBgColor: function (r, g, b, a) {
		$x.send_message('setBackgroundColor', {
			r: r + '',
			g: g + '',
			b: b + '',
			a: (a || 1) + ''
		});
	}
};

// })();