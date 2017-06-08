var path = require('path');

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'src/app.js')
    },
    output: {
        path: path.resolve(__dirname, 'asset'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/, // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
            loader: 'babel', // 加载模块 "babel" 是 "babel-loader" 的缩写
        query: {
            presets: ['es2015']
        },
        exclude: /node_modules/,
        }]
    }

};