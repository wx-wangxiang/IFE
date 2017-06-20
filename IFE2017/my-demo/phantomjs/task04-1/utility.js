var iconv = require('iconv-lite'); //用于处理中文输出乱码
var exec = require('child_process').exec;
var iconv = require('iconv-lite'); //用于处理中文输出乱码

function searchData(path, keyword, device) {
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
//遍历搜索结果
function traversal({Data, keyword, device, time, resultModel, type}) {
	return new Promise(function(resolve, reject) {
		console.log(type);
		Data.dataList.map(function(item, index) {
			var tempObj = {
				no: index,
				keyword: keyword,
				device: device,
				time: time,
				title: item.title,
				info: item.info,
				link: item.link,
				pic: item.pic,
				localImg: item.localImg
			};
			
			if (type === 'update') {
				console.log(tempObj);
				resultModel.update({keyword, device, title: item.title}, {$set: tempObj}, function(err) {
					if(err) return console.error(err);
					resolve();
				});
			} else {
				console.log(tempObj);
				resultModel.create(tempObj, function(err, newDoc) {
					if(err) return console.error(err);
					resolve();
				});
			}
		});
	})
}
/**
 * 将搜索结果保存到数据库
 * @param  {obj} result 搜索结果
 * @return {[type]}        [description]
 */
function saveResult(Data, dbModel) {
	return new Promise(function(resolve, reject) {
		const resultModel = dbModel;
		const keyword = Data.word;
		const device = Data.device || 'PC';
		const time = Data.time;
		const type = '';
		const opts = {Data, keyword, device, time, resultModel, type};

		//如果数据库中已经存在该条数据则执行更新操作，否则执行保存操作
		if (resultModel.find({keyword, device}, function(err, results) {
			if (err) return console.error(err);

			//这里的判断是保存还是修改只是用了最简单省力（但不是最准确）的方法
			if(results.length > 0) {
				opts.type = 'update';
			} else {
				opts.type = 'save';
			}

			resolve(opts);
		}));
	}).then(opts => {
		return traversal(opts);
	})
}

function fetch(keyword, dbModel, device) {
	if (!device) {
		device = 'PC';
	}
	return new Promise(function(resolve, reject) {
		dbModel.find({keyword, device}, function (err, modules) {
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