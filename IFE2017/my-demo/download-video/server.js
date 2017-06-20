const request = require('request');
const fs = require('fs');
const originUrl = 'http://mmbiz.qpic.cn/mmbiz_gif/qwxf4wHyyTE8UFfHOzibh8kia9v8vKuH7sPGWmia46mnfKvkmX5ZvTojryca7Lxyqrx94uIqaME67gtMIDjctKr0A/0?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1';

request.head(originUrl, function(err, res, body) {
	if (err) {
		console.log('err: ' + err);
	}

	request(originUrl)
		.pipe(fs.createWriteStream('img/test.gif'))
		.on('close', function() {
			console.log('下载完成');
		})
})