const koa = require('koa');
//引入koa-bodyparser
const bodyParser = require('koa-bodyparser');
const controller = require('./controller.js');
const app = new koa();
//引入模板引擎
const nunjucks = require('nunjucks');
const env = createEnv('views', {
	watch: true,
	filters: {
		hex: function(n) {
			return 'Ox' + n.toString(16);
		}
	}
});
const s = env.render('hello.html', {name: '<script>alert("小明")</script>'});

function createEnv(path, opts) {
	var autoescape = opts.autoescape || true,
		noCache = opts.noCache || false,
		watch = opts.watch || false,
		throwOnUndefined = opts.throwOnUndefined || false,
		env = new nunjucks.Environment(
			new nunjucks.FileSystemLoader(path, {
			noCache: noCache,
			watch: watch
		}), {
			autoescape: autoescape,
			throwOnUndefined: throwOnUndefined
		});
	if (opts.filters) {
		for (var f in opts.filters) {
			env.addFilter(f, opts.filters[f]);
		}
	}
	return env;
}

app.use(async(ctx, next) => {
	console.log(`${ctx.request.method} ${ctx.request.url}`);
	await next();
})

app.use(bodyParser());
app.use(controller());

app.listen(3000);
console.log('app start at port 3000');
console.log(s);