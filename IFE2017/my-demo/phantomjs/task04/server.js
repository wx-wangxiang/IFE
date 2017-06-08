const koa = require('koa');
//引入koa-bodyparser
const bodyParser = require('koa-bodyparser');
//引入koa-router
const router = require('koa-router')();
const app = new koa();

app.use(async(ctx, next) => {
	console.log(`${ctx.request.method} ${ctx.request.url}`);
	await next();
})

router.get('/hello/:name', async(ctx, next)=>{
	var name = ctx.params.name;

	ctx.response.body = `<h1>Hello, ${name}</h1>`;
})

router.get('/', async(ctx, next)=>{
	ctx.response.body = `<h1>Index</h1>
		<form action="/signin" method="post">
			<p>Name: <input name="name" type="text" value="koa"></p>
			<p>Password: <input name="password" type="password"></p>
			<button type="submit">submit</button>
		</form>`;
})

router.post('/signin', async(ctx, next)=>{
	var name = ctx.request.body.name || '',
		password = ctx.request.body.password || '';
	if (name === 'koa' && password === '12345') {
		ctx.response.body = `<p>welcome koa!</p>`;
	} else {
		ctx.response.body = `<p>log failed</p>
		<a href="/">重新登录</a>`;
	}
})

app.use(bodyParser());
app.use(router.routes());

app.listen(3000);
console.log('app start at port 3000');