phantom.outputEncoding="gb2312"; //防止中文输出乱码
var page = require('webpage').create();
var config = require('./config.json');
var system = require('system'); //system模块用于获取命令行中输入的参数
var timeStart = +new Date(); //该次搜索花费的时间
var url = 'https://www.baidu.com/s?wd=';
var result = {
       code: 0, //返回状态码，1为成功，0为失败
       msg: '抓取失败', //返回的信息
       word: '', //抓取的关键字
       device: '', //模拟的设备
       time: 0, //任务的时间
       dataList:[   //抓取结果列表
           {
               title: '',  //结果条目的标题
               info: '', //摘要
               link: '', //链接
               pic: '' //缩略图地址
            }
       ]
   };
if(system.args.length === 1) {
	console.log('请输入想要搜索的内容');
	phantom.exit();
} else if(system.args.length === 2) {
	result.word = getKeywords('searchWord');
} else {
	result.word = getKeywords('searchWord');
	result.device = getKeywords('device');
	page.settings.userAgent = config[result.device].ua;
	page.settings.viewportSize = config[result.device].size;
}
page.open(url + encodeURIComponent(result.word), function(status) {
	if (status === 'success') {
		page.includeJs('http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js', function() {
			result.code = 1;
			result.msg = '抓取成功';
			result.time = getDuration();
			result.dataList = page.evaluate(getContainer, result.device);
			//输出结果
			console.log(JSON.stringify(result, null, 4));
			phantom.exit();
		});
		//生成网页截图
		//page.render(result.word + "_" + result.device + '.png');
	} else {
		result.time = getDuration();
		console.log('搜索失败，请重试');
		console.log(JSON.stringify(result, null, 4));
		phantom.exit();
	}
});

//获取命令行中输入的关键字
function getKeywords(args) {
	if (args === 'searchWord') {
		return system.args[1];
	} else if (args === 'device') {
		return system.args[2];
	}
}
//获取花费的时间
function getDuration() {
	return +new Date() - timeStart + 'ms';
}
//解析html结构，获取想要的数据
function getContainer(device) {
	//var device = 'iphone5';
	var containers = $('.result');
	var results = [];

	containers.each(function(index, item) {
		var tempObj = {
               title: '',  //结果条目的标题
               info: '', //摘要
               link: '', //链接            
               pic: '' //缩略图地址
            };

        //解析dom树，不同的设备访问的页面的dom结构是不同的
		switch(device) {
			//iphone5, iphone6
			case 'iphone6':
			case 'iphone5': var container = $(item).find('.c-container:first');
							tempObj.title = container.find('a .c-title:first').text() || '';
							tempObj.info = container.find('.c-abstract a:first p').text() || '';
							tempObj.link = container.find('a:first').attr('href');
							tempObj.pic = container.find('.c-abstract a:first img').attr('src');
			break;
			//ipad, pc
			default: 	tempObj.title = $(item).find('.t > a').text() || '';
			        	tempObj.info = $(item).find('.c-abstract').text() || '';
			        	tempObj.link = $(item).find('.t > a:first').attr('href') || '';
			        	tempObj.pic = $(item).find('.c-row .c-img').attr('src') || '';
		}
		results.push(tempObj);
	});
	return results;
}
//解析dom树，不同的设备访问的页面的dom结构是不同的
function parseDOM(device, item) {
	var tempObj = {
           title: '',  //结果条目的标题
           info: '', //摘要
           link: '', //链接            
           pic: '' //缩略图地址
        };

	switch(device) {
		case 'iphone5': tempObj.title = $(item).find('a .c-title').text() || '';
						tempObj.info = $(item).find('.c-abstract a p').text() || '';
						tempObj.link = $(item).find('a').attr('href');
						tempObj.pic = $(item).find('.c-abstract a img').attr('src');
		break;
		default: 	tempObj.title = $(item).find('.t > a').text() || '';
		        	tempObj.info = $(item).find('.c-abstract').text() || '';
		        	tempObj.link = $(item).find('.t > a:first').attr('href') || '';
		        	tempObj.pic = $(item).find('.c-row img').attr('src') || '';
	}

	return tempObj;
}
//console.log('hello');