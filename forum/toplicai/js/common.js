window.XUtils = window.$xu = {
	parseQuery: function (url) {
		var comps = url.split(/[\?#]/);
		var query = comps.length == 2 ? comps[1] : comps[0];
		var items = query.split('&');
		var params = {};
		items.forEach(function (item) {
			var kvs = item.split('=');
			var key = kvs[0];
			var val = kvs.length == 2 ? kvs[1] : '';
			key = decodeURIComponent(key);
			val = decodeURIComponent(val);
			params[key] = val;
		});
		return params;
	},
	setUrlWithQuery: function (url, query) {
		var items = [];
		for (var key in query) {
			if (query.hasOwnProperty(key)) {
				var val = query[key];
				key = encodeURIComponent(key);
				val = encodeURIComponent(val);
				items.push(key + '=' + val);
			}
		}
		return url + (url.indexOf('?') == -1 ? '?' : '&') + items.join('&');
	},
	getBody: function (html) {
		html = html.replace(/<script(.|\s)*?<\/script>/g, '');
		var body = '';
		html.replace(/^(.|\s)*?(<body(.|\s)*<\/body>)(.|\s)*$/, function ($0, $1, $2) {
			body = $2;
		});
		if (body == '') {
			body = html;
		}
		body = body.replace(/(<img[^>]+)src=([^>]*?>)/g, '$1xsrc=$2');
		// console.log(body);
		return body;
	},
	trimTag: function (html) {
    	return (html || '').replace(/<[^>]+>/g, '');
	},
	html2text: function (html) {
		return (html || '').replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>')
					.replace(/&nbsp;/g, ' ')
					.replace(/&amp;/g, '&');

	},
	replacePath: function (path) {
		return window.location.href.replace(/\/[^\/]+$/, '/' + path);
	}
};

function setupHighlight() {
	$('.hl').on('touchstart', function () {
		$(this).addClass('hl-on');
	}).on('touchmove touchend', function () {
		$(this).removeClass('hl-on');
	});
}

// 
function createFullpageHint(img, hint, rotate) {
	var tpl = [
		'<div class="fullpage-hint">',
			'<div class="hint-wrapper">',
				'<div class="hint-img"></div>',
				'<div class="hint-text"></div>',
			'</div>',
		'</div>'].join('');
	var dom = $(tpl);
	dom.find('.hint-text').text(hint);
	dom.find('.hint-img').css('background-image', 'url("' + img + '")');
	if (rotate) {
		dom.find('.hint-img').addClass('rotate-animation');
	}
	return dom;
}

function createFullpageLoading() {
	return createFullpageHint('img/icon-loading.png', '正在加载...', true);
}

function createFullpageRetry() {
	return createFullpageHint('img/icon-refresh-64.png', '点击重试');
}

function createHorizentalHint(img, hint, rotate) {
	var tpl = [
		'<div class="horizental-hint">',
			'<div class="horizental-hint-left"></div>',
				'<div class="horizental-hint-img"></div>',
				'<div class="horizental-hint-hint">正在加载...</div>',
			'<div class="horizental-hint-right"></div>',
		'</div>'
	].join('');
	var dom = $(tpl);
	dom.find('.horizental-hint-img').css('background-image', 'url("' + img + '")');
	dom.find('.horizental-hint-hint').text(hint);
	if (rotate) {
		dom.find('.horizental-hint-img').addClass('rotate-animation');
	}
	return dom;
}

function createHorizentalLoading() {
	return createHorizentalHint('img/icon-loading.png', '正在加载...', true);
}

// common actions
document.addEventListener('DOMContentLoaded', function () {
	$x.subscribe('XConfigChange', function (config) {
		console.log(config.fontSize);
		onConfigChange(config);
	});

	$x.getConfig(function (config) {
		console.log('getConfig', config);
		onConfigChange(config);
	})
})

function onConfigChange(style) {
	var sheet = document.styleSheets[0];

	for (var i = sheet.rules.length - 1; i >= 0; --i) {
		sheet.deleteRule(i);
	}
	var className = 'xstyle' + (new Date().getTime());
	sheet.addRule('body.' + className, style2string({
		'font-size': style.fontSize + 'px',
		'line-height': (style.fontSize * 1.5) + 'px'
	}), 0);

	$('body').removeClass();
	$('body').addClass(className);
}

function style2string (styles) {
	var res = [];
	$.each(styles, function (key, value) {
		res.push(key + ':' + value + ';');
	});
	return res.join('');
}

function createPagePlaceHolder(page) {
	var tpl = [
		'<div class="x-page-placeholder" id="x_page_placeholder_', page, '">',
			'<div class="x-page-placeholder-page">',
				page,
			'</div>',
			'<div class="x-page-placeholder-hint">',
			'	点击加载',
			'</div>',
			'<div class="x-page-placeholder-loading hidden">',
			'	<span class="loading-img rotate-animation"></span>',
			'	<span>正在加载</span>',
			'</div>',
			'<div class="x-page-placeholder-try hidden">',
			'	<span class="retry-img"></span>',
			'	<span>点击重试</span>',
			'</div>',
		'</div>'].join('');
	return $(tpl);
}

function opentid(tid, title) {
    $x.open({
        'url': XUtils.setUrlWithQuery('x://xweb', {
            // 'page': 'board',
            'url': $xu.replacePath('read.html'),
            'tid': tid,
            'name': title || '',
            'title': title || '' 
        }),
        // 'root': true
    })
}

