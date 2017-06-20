const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

/**
 * 根据传入的url和dir返回相应的静态文件
 * @param  {string} url 请求的静态文件的url开头部分，类似/static/
 * @param  {string} dir 服务器存放静态文件的目录，类似__dirname + '/static'
 * @return {[type]}     [description]
 */
function staticFiles(url, dir) {
	return async(ctx, next) => {
		const reqPath = ctx.request.path;
		//判断是否以指定的url开头
		if (reqPath.startsWith(url)) {
			//获取该文件的完整地址
			const filePath = path.join(dir, reqPath.substring(url.length));
			//判断该文件是否存在
			if (await fs.exists(filePath)) {
				//获取文件的mime type
				ctx.response.type = mime.lookup(reqPath);
				//读取文件内容，并返回给response.body
				ctx.response.body = await fs.readFile(filePath);
			} else {
				//文件不存在
				ctx.response.status = 404;
			}
		} else {
			//不是请求静态文件，则继续处理下一个middleware
			await next();
		}
	}
}

module.exports = staticFiles;