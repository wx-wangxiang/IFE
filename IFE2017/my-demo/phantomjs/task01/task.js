phantom.outputEncoding="gbk"; //防止中文输出乱码

var page = require('webpage').create();
var system = require('system'); //system模块用于获取命令行中输入的参数
var timeStart = +new Date(); //该次搜索花费的时间
var result = {
       code: 0, //返回状态码，1为成功，0为失败
       msg: '抓取失败', //返回的信息
       word: '', //抓取的关键字
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
}

result.word = getKeywords(system.args);

console.log(result.word);
page.open('http://nba.stats.qq.com/nbascore/?mid=1470069&ptag=baidu.ald.sc.nba', function(status) {
	console.log(status);
	if (status === 'success') {
		page.includeJs('http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js', function() {
			console.log('evaluate start');
			result.code = 1;
			result.msg = '抓取成功';
			result.time = getDuration();
			result.dataList = page.evaluate(getContainer);
			console.log(JSON.stringify(result, null, 4));
			phantom.exit();
		});
		//生成网页截图
		page.render(result.word + '.png');
	} else {
		result.time = getDuration();
		console.log('搜索失败，请重试');
		console.log(JSON.stringify(result, null, 4));
		phantom.exit();
	}
});

//获取命令行中输入的关键字
function getKeywords(args) {
	var arrKeywords = args;

	arrKeywords.splice(0, 1); //删除第一个参数 （文件名）
	return arrKeywords.join(' ');
}
//获取花费的时间
function getDuration() {
	return +new Date() - timeStart + 'ms';
}
//解析html结构，获取想要的数据
function getContainer() {
	/*var content = $('.data');
	var containers = content.find('.c-container');*/
	var results = [];

	var tempObj = {
       title: '',  //结果条目的标题
       score: '', //比分
       quarter: '', //节数            
       time: '' //剩余时间
    };
    var visitgoal = $('.visitgoal').text();
    var homegoal = $('.homegoal').text();
    var quarter = $('.data').find('.bg:first').find('td:last').text();

    tempObj.score = visitgoal + ':' + homegoal;
    tempObj.quarter = quarter;
    results.push(tempObj);

	/*containers.each(function(index, item) {
		var tempObj = {
               title: '',  //结果条目的标题
               info: '', //摘要
               link: '', //链接
               pic: '' //缩略图地址
            };
        tempObj.title = $(item).find('.t > a').text() || '';
        tempObj.info = $(item).find('.c-abstract').text() || '';
        tempObj.link = $(item).find('.t > a:first').attr('href') || '';
        tempObj.pic = $(item).find('.c-row img').attr('src') || '';
        results.push(tempObj);
	});*/
	return results;
}
//console.log('hello');