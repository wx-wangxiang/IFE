var http = require('http');
//var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/spider';
var mongoose = require('mongoose');

mongoose.Promise = global.Promise = require('bluebird'); //不加这段代码，save的时候会报警告
mongoose.connect(DB_CONN_STR);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(callback) {
	console.log('mongodb connected...');

	//定义schema
	var spiderDataSchema = mongoose.Schema({
		info: String,
		link: String,
		pic: String,
		title: String
	})

	//定义model
	var spiderData = mongoose.model('spiderData', spiderDataSchema);

	//实例化
	var iphone5 = new spiderData({
		info: 'hello',
		link: 'www.baidu.com',
		pic: 'img.baidu.com',
		title: 'iphone5',
		device: 'iphone5'
	})

	console.log(iphone5.link);

	//保存到数据库
	iphone5.save(function(err, device) {
		if(err) return console.error(err);
		console.log(device.info);
	})
})

/*var insertData = function(db, callback) {
	//连接到集合 nutrient
	var collection = db.collection('nutrient');
	//插入数据
	var data = [{'water': '250ml'}]; //{'生产日期': 20170606};//, {'保质期': '6个月'};

	collection.insert(data, function(err, result) {
		if(err) {
			console.log('Error:' + err);
			return;
		}
		callback(result);
	})
};*/

/*MongoClient.connect(DB_CONN_STR, function(err, db) {
	if(err) throw err;
	console.log('连接成功!');
	insertData(db, function(result) {
		console.log(result);
		db.close();
	})
})*/

/*http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type: text/plain; charset=utf-8"});
	response.write('hello mongodb');
	response.end();
}).listen(8000)*/