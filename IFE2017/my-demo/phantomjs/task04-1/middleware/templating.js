//引入模板引擎
const nunjucks = require('nunjucks');

function templating(path, opts) {
	const env = createEnv(path, opts);

	return async(ctx, next) => {
		ctx.render = function(view, model) {
			ctx.response.type = 'text/html';
			ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}));
		};
		await next();
	}
}

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

module.exports = templating;