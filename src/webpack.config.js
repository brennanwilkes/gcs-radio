const path = require("path");
module.exports = {
	mode: "development",
	devtool: "source-map",
	entry: "./src/frontend/index.tsx",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "..", "public-frontend")
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.m?js$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"]
					}
				}
			},
			{
				test: /\.(png|jpg)$/,
				use: {
					loader: "url-loader?limit=8192"
				}
			},
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	externals: {
		jquery: "jQuery"
	}
};
