const koa = require('koa');
//引入koa-bodyparser
const bodyParser = require('koa-bodyparser');
const controller = require('./controller.js');
const app = new koa();
//引入连接数据库的模块
const getModel = require('./modules/connect-mongodb.js');
//引入处理静态文件的中间件
const staticFile = require('./middleware/static-files.js');
//引入模板引擎中间件
const templating = require('./middleware/templating.js');
const templatingPath = 'views';
const templatingOpts = {
	watch: true,
	filters: {
		hex: function(n) {
			return 'Ox' + n.toString(16);
		}
	}
}

getModel(function(model) {
	app.use(async(ctx, next) => {
		ctx.dbModel = model;
		console.log(`${ctx.request.method} ${ctx.request.url}`);
		await next();
	})
	app.use(staticFile('/static/', __dirname + '/static'));
	app.use(bodyParser());
	app.use(templating('views', {}))
	//app.use(connectMongodb('mongodb://localhost:27017/spider'))
	app.use(controller());

	app.listen(8080);
})

console.log('app start at port 8080');