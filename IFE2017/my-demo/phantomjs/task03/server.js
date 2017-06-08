var http = require('http');
var url = require('url');
var iconv = require('iconv-lite'); //用于处理中文输出乱码
var exec = require('child_process').exec;
var spiderData = null;
var getMongoModel = require('./mongodb.js');

//链接数据库，得到数据库的文档对象
getMongoModel(function(mongoModel) {
	spiderData = mongoModel;
});

http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type": "text/json;charset=gbk2312"});
	if (request.url !== '/favicon.ico') {
		var query = url.parse(request.url, true).query;
		console.log(query);
		//创建子进程，执行phantomjs的脚本，爬取网页数据
		exec('phantomjs task.js ' + query.keyword, {encoding: 'binary'}, function(err, stdout, stderr) {
			if(err) throw err;
			//先用binary来存储输出的文本，再用iconv来以gbk解析。
			var resultStr = iconv.decode(stdout, 'gbk');
			var results = JSON.parse(resultStr);
			results.dataList.forEach(function(item, index) {
				//实例化
				var device = new spiderData({
					info: item.info,
					link: item.link,
					pic: item.pic,
					title: item.title
				});
				//保存到数据库
				device.save(function(err) {
					if(err) return console.error(err);
				});
			})
			response.write(resultStr);
			response.end();
		});
	}
}).listen(8000);
console.log('listen port on 8000');