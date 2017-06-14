var iconv = require('iconv-lite'); //用于处理中文输出乱码
var exec = require('child_process').exec;
var iconv = require('iconv-lite'); //用于处理中文输出乱码
var getModel = require('./connect.js'); //链接数据库，并获得model
var resultModel = null;

function searchData({path, keyword = '百度', device = ''}) {
	if (path) {
		//创建子进程，执行phantomjs脚本，爬取网页数据
		return new Promise(function(resolve, reject) {
			const cmd = `phantomjs ${path} ${keyword} ${device}`;
			console.log(cmd);

			exec(cmd, {encoding: 'binary'}, function(err, stdout, stderr) {
				if (err) {
					reject(`exec error: ${err}`);
					return false;
				}
				//先用binary来存储输出的文本，再用iconv来以gbk解析。
				var resultStr = iconv.decode(stdout, 'gbk');
				var result = JSON.parse(resultStr);
				
				resolve(result);
			})
		})
	} else {
		console.log('请传入执行脚本');
		return false;
	}
}
/**
 * 将搜索结果保存到数据库
 * @param  {obj} result 搜索结果
 * @return {[type]}        [description]
 */
function saveResult(Data) {
	return new Promise(function(resolve, reject) {
		getModel(function(model) {
			const keyword = Data.word;
			const device = Data.device || 'PC';
			const time = Data.time;

			resultModel = model;
			Data.dataList.map(function(item, index) {
				var tempObj = new resultModel({
					no: index,
					keyword: keyword,
					device: device,
					time: time,
					title: item.title,
					info: item.info,
					link: item.link,
					pic: item.pic
				});

				tempObj.save(function(err) {
					if(err) return console.error(err);
				});
			});
			resolve();
		})
	})
}

function fetch(keyword) {
	return new Promise(function(resolve, reject) {
		resultModel.find({keyword}, function (err, modules) {
		  	if (err) return console.error(err);
		  	resolve(modules);
		});
	})
}

module.exports = {
	searchData: searchData,
	saveResult: saveResult,
	fetch: fetch
}