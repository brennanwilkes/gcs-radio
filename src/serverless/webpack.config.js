const path = require('path');
module.exports = {
	target: "node",
	mode: "development",
	entry: "./src/serverless/index.ts",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "..", "..", "build-serverless"),
		library: 'serverless',
		libraryExport: 'default'
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".js"]
	},
	module: {
		rules: [{ test: /\.ts$/, loader: "ts-loader" }]
	}
}
