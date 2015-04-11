var fs = require('fs');
var http = require('http');

http.createServer(function (req, rsp) {
	var file = req.url.substring(1);
	rsp.writeHead(200, {
		'Content-type': 'text/html',
		'Access-Control-Allow-Origin': '*'
	});
	try {
		var html = fs.readFileSync(file).toString();
		rsp.end(JSON.stringify({
			data: html
		}));
	} catch (e) {
		console.log(e);
		rsp.end();
	}
}).listen(8081);
