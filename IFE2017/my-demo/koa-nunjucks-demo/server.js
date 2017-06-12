const koa = require('koa');
//引入koa-bodyparser
const bodyParser = require('koa-bodyparser');
const controller = require('./controller.js');
const app = new koa();
//引入处理静态文件的中间件
const staticFile = require('./static-files.js');
//引入模板引擎中间件
const templating = require('./templating.js');
const templatingPath = 'views';
const templatingOpts = {
	watch: true,
	filters: {
		hex: function(n) {
			return 'Ox' + n.toString(16);
		}
	}
}
/*const nunjucks = require('nunjucks');
const env = createEnv('views', {
	watch: true,
	filters: {
		hex: function(n) {
			return 'Ox' + n.toString(16);
		}
	}
});*/

app.use(async(ctx, next) => {
	console.log(`${ctx.request.method} ${ctx.request.url}`);
	await next();
})

app.use(staticFile('/static/', __dirname + '/static'));

app.use(bodyParser());
app.use(templating('views', {}))
app.use(controller());

app.listen(3000);
console.log('app start at port 3000');