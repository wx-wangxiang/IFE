const koa = require('koa');
const fs = require('fs');
//引入koa-bodyparser
const bodyParser = require('koa-bodyparser');
//引入koa-router
const router = require('koa-router')();
const app = new koa();
//列出controllers目录下的所有文件
const files = fs.readdirSync(__dirname + '/controllers');
//过滤出所有的.js文件
const js_files = files.filter((file)=>{
	return file.endsWith('.js');
})

//处理每个过滤出来的.js文件
for (let file of js_files) {
	//导入js文件
	let mapping = require(__dirname + '/controllers/' + file);
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

app.use(async(ctx, next) => {
	console.log(`${ctx.request.method} ${ctx.request.url}`);
	await next();
})

app.use(bodyParser());
app.use(router.routes());

app.listen(3000);
console.log('app start at port 3000');