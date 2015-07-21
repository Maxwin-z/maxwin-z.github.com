var fs = require('fs');

fs.readdirSync('./laoyuegou/').forEach(function (file, index) {
	console.log(file, index);
	fs.createReadStream('./laoyuegou/' + file).pipe(fs.createWriteStream('./laoyuegou2/' + index + '.jpg'))
});

