const koa = require('koa');
//引入koa-bodyparser
const bodyParser = require('koa-bodyparser');
const controller = require('./controller.js');
const app = new koa();

app.use(async(ctx, next) => {
	console.log(`${ctx.request.method} ${ctx.request.url}`);
	await next();
})

app.use(bodyParser());
app.use(controller());

app.listen(3000);
console.log('app start at port 3000');