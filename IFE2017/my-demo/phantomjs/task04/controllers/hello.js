const fn_hello = async(ctx, next)=>{
	var name = ctx.params.name;
	ctx.response.body = `<p>welcome ${name}</p>`;
};

module.exports = {
	'GET /hello/:name': fn_hello
};