var webpack = require('webpack');
var path = require('path');
module.exports = [{
    name: "dev",
    entry: {
        imoney: "./index.js",
    },
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "build/",
        filename: "[name].js"
    }
},{
    name: "build",
    entry: {
        imoney: "./index.js",
    },
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "build/",
        filename: "[name].min.js"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}]
