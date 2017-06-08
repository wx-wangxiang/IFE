const fs = require('fs');

function addControllers(router, controllerDir) {
	//列出controllers目录下的所有文件
	const files = fs.readdirSync(__dirname + controllerDir);
	//过滤出所有的.js文件
	const js_files = files.filter((file)=>{
		return file.endsWith('.js');
	});

	//处理每个过滤出来的.js文件
	for (let file of js_files) {
		//导入js文件
		let mapping = require(__dirname + `${controllerDir}/${file}`);
		addMappings(router, mapping);
	}
}

function addMappings(router, mapping) {
	for (let url in mapping) {
		if (url.startsWith('GET ')) {
			let path = url.substring(4);
			router.get(path, mapping[url]);
		} else if (url.startsWith('POST ')) {
			let path = url.substring(5);
			router.post(path, mapping[url]);
		} else {
			console.log(`invalid url: ${url}`);
		}
	}
}

module.exports = function(dir) {
	//引入koa-router
	const router = require('koa-router')();
	const controllerDir = dir || '/controllers';

	addControllers(router, controllerDir);
	return router.routes();
}