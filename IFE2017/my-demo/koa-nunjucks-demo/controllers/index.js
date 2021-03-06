const fn_index = async(ctx, next) => {
	ctx.render('hello.html');
};
const fn_signin = async(ctx, next) => {
	var name = ctx.request.body.name || '',
		password = ctx.request.body.password || '';
	if(name === 'koa' && password === '12345') {
		ctx.response.body = `<p>welcome koa</p>`;
	} else {
		ctx.response.body = `<p>log failed</p>
		<a href="/">重新登录</a>`;
	}
};

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

module.exports = {
	'GET /': fn_index,
	'POST /signin': fn_signin
}