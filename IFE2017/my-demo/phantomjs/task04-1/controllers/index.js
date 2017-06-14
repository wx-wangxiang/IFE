const util = require('../utility.js');

const fn_index = async(ctx, next) => {
	ctx.render('index.html');
};
const fn_signin = async(ctx, next) => {
	var keyword = ctx.request.body.keyword || '',
		device = ctx.request.body.device || '';
	ctx.response.body = `${keyword}--${device}`;
};
//根据得到的数据，处理异步请求，执行爬取数据的任务
const fn_getResult = async(ctx, next) => {
	const path = 'task.js',
		keyword = ctx.request.body.keyword || '',
		device = ctx.request.body.device || '';
	const result = await util.searchData({path, keyword, device});
	//保存到数据库
	await util.saveResult(result);
	//从数据库取值
	const Data = await util.fetch(keyword);

	ctx.response.body = {
		Data,
		Status: true
	};
	ctx.response.type = 'application/json';

	//console.log(result);
}

module.exports = {
	'GET /': fn_index,
	'POST /signin': fn_signin,
	'POST /getResult': fn_getResult
}