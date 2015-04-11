#!/usr/local/bin/node

var urlRoot = 'http://10.128.36.61:8080/';
urlRoot = 'http://maxwin.me/forum/toplicai/'

var pages = {
	'menu.html': [],
	'home.html': [],
	'thread.html': ['/img/board-top.gif'],
	'read.html': []
}

var imgs = ['/img/icon-loading.png'];

var fs = require('fs');
console.log('start watch');

fs.watch('./', function (event, filename) {
	if (pages[filename]) {
		var content = fs.readFileSync(filename).toString();
		// console.log(content);
		var jses = [];
		var csses = [];
		content.replace(/<script[^>]*src="(.*?)"/g, function($0, $1) {
			jses.push($1);
		}).replace(/<link[^>]*href="(.*?)"/g, function ($0, $1) {
			csses.push($1);
		});
		addUrlRoot(jses);
		addUrlRoot(csses);
		addUrlRoot(imgs);
		var version = new Date().getTime();
		var tpl = ['CACHE MANIFEST', '']
			.concat(['CACHE:', '#js']).concat(jses)
			.concat(['', '#css']).concat(csses)
			.concat(['', '#img']).concat(imgs)
			.concat(['', '#extra']).concat(pages[filename])
			.concat(['', '#version: ' + version])
			.concat(['', 'NETWORK:', '*'])
			.concat(['', 'FALLBACK:']).join('\n');
		fs.writeFileSync('manifests/' + filename + '.manifest', tpl);
		console.log('create manifest:', filename);
	}
});

function addUrlRoot(files) {
	for (var i = 0; i < files.length; ++i) {
		var file = files[i];
		if (file.indexOf('http://') !== 0) {
			file = urlRoot + file;
			file = file.replace(/\/+/g, '/').replace('http:/', 'http://');
			files[i] = file;
		}
	}
}

