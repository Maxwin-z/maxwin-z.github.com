/* SMMainPage */
var data = {
	'__type': 'SMMainPage',
	sections: [
	/*
	{
		sectionTitle: '',
		posts:[{	// SMPostGroup
			author: '',
			title: '',
			board: {
				__type: 'SMBoard',
				name: '',
				cnName: ''
			},
			gid: 0
		}, ...]
	}, ...
	*/
	]
};

function $parse(html) {
	var rsp = {code: 0, data: null, message: ''};
	try {
		parseTop10(html);
		rsp.data = data;

		parseSections(html);
	} catch (e) {
		rsp.code = -1;
		rsp.message = e.message;
	}

	console.log(rsp);
	window.location.href = 'newsmth://' + encodeURIComponent(JSON.stringify(rsp));
}

function parseTop10(html) {
	var top10regex = /<table[^>]*class="HotTable"(.|\s)*?<\/table>/;
	var matchs = html.match(top10regex);
	var top10html = matchs[0];

	var div = document.createElement('div');
	div.innerHTML = top10html;
	document.body.appendChild(div);

	// get datas
	var top10items = [];

	var trs = div.querySelectorAll('tr');
	for (var i = 0; i != trs.length; ++i) {
		top10items.push(parseTop10item(trs[i]));
	}

	data.sections.push({
		'__type': 'SMSection',
		sectionTitle: '本日热点话题讨论',
		posts: top10items
	});
}

function parseTop10item(tr) {
	var item = {
		__type: 'SMPost'
	};
	var as = tr.querySelectorAll('a');

	var a_board = as[0];
	item.board = {
		__type: 'SMBoard',
		name: a_board.search.match(/board=(.+)/)[1],
		cnName: a_board.innerHTML
	};

	var a_post = as[1];
	item.title = a_post.innerHTML;
	item.gid = a_post.search.match(/gid=(\d+)/)[1];

	item.author = as[2].innerHTML;

	return item;
}

function parseSections(html) {
	var secsRegex = /<table[^>]*class="SecTable"(.|\s)*?<\/table>/;
	var matchs = html.match(secsRegex);
	var secsHtml = matchs[0];

	var div = document.createElement('div');
	div.innerHTML = secsHtml;
	document.body.appendChild(div);

	var tds = div.querySelectorAll('td');

	var section = null;
	/*
	= {
		__type: 'SMSection',
		sectionTitle: '',
		posts: []
	};
	*/
	for (var i = 0; i != tds.length; ++i) {
		var td = tds[i];
		if (td.className == 'SecLine') {
			data.sections.push(section);
		}
		if (td.className == 'SectionTitle') {	// new sec
			section = {
				__type: 'SMSection',
				sectionTitle: '',
				posts: []
			};
			section.sectionTitle = td.querySelector('.SectionName a').innerHTML;
		}

		if (td.className == 'SectionItem') {
			var post = {
				__type: 'SMPost',
				title: '',
				gid: '',
				author: '',
				board: {
					__type: 'SMBoard',
					name: '',
					cnName: ''
				}
			};

			var as = td.querySelectorAll('a');
			var a_board = as[0];
			var a_post = as[1];

			post.title = a_post.innerHTML + '--';
			post.gid = a_post.search.match(/gid=(\d+)/)[1];

			post.board.name = a_board.search.match(/board=(.+)/)[1];
			post.board.cnName = a_board.innerHTML;

			section.posts.push(post);
		}
	}

}
