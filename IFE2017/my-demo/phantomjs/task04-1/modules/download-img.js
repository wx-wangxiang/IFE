const request = require('request');
const fs = require('fs');

function downLoadImg(imgSrc, path) {
	return new Promise(function(resolve, reject) {
		request.head(imgSrc, function(err, res, body) {
			if (err) {
				reject(err);
				return false;
			}
			request(imgSrc)
				.pipe(fs.createWriteStream(path))
				.on('close', function() {
					resolve();
				})
		})
	})
}

function downLoad(imgSrc, dir, fileName) {
	request(imgSrc).pipe(fs.createWriteStream(`${dir}/${fileName}`));
}

module.exports = downLoadImg;