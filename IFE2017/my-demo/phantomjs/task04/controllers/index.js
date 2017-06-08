const fn_index = async(ctx, next) => {
	ctx.response.body = `<h1>Index</h1>
		<form action="/signin" method="post">
			<p>name: <input type="text" name="name" value="koa"></p>
			<p>Password: <input name="password" type="password"></p>
			<button type="submit">submit</button>
		</form>`;
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

module.exports = {
	'GET /': fn_index,
	'POST /signin': fn_signin
}