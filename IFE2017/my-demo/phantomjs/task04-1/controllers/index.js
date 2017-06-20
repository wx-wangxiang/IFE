const util = require('../utility.js');
const path = require('path');
const downLoadImg = require('../modules/download-img');

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
	const dbModel = ctx.dbModel;
	const dir = 'task.js',
		keyword = ctx.request.body.keyword || '',
		device = ctx.request.body.device;
	const result = await util.searchData(dir, keyword, device);
	//定义一个存放下载图片的所有promise的数组
	const promiseList = [];

	//遍历搜索结果，如果存在缩略图的链接则下载该图片
	result.dataList.map(function(item) {
		if (item.pic) {
			const imgFileName = `${Math.trunc(Math.random()*Math.pow(10, 8))}.jpg`;
			const imgPath = `${path.join(__dirname, '../static/img')}/${imgFileName}`;

			promiseList.push(downLoadImg(item.pic, imgPath));
			return Object.assign(item, {
				localImg: `/static/img/${imgFileName}`
			})
		} else {
			return item;
		}
	})
	await Promise.all(promiseList);
	//保存到数据库
	await util.saveResult(result, dbModel);
	//从数据库取值,返回给前端页面
	const Data = await util.fetch(keyword, dbModel, device);

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