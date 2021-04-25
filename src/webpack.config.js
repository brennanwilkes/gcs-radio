const path = require("path");

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const mode = "development";

module.exports = {
	mode,
	stats: {
		warnings:false
	},
	...(mode === "development" ? {} : {
		devtool: "source-map",
	}),
	entry: {
		app: "./src/frontend/entryPoints/app.tsx",
		landing: "./src/frontend/entryPoints/landing.tsx",
		login: "./src/frontend/entryPoints/login.tsx",
		browser: "./src/frontend/entryPoints/browser.tsx",
		dashboard: "./src/frontend/entryPoints/dashboard.tsx",
		builder: "./src/frontend/entryPoints/builder.tsx",
		generator: "./src/frontend/entryPoints/generator.tsx"
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, "..", "public-frontend", "dist"),
	},
	module: {
		rules: [
			{
		        test: /\.s[ac]ss$/i,
		        use: [
		          // Creates `style` nodes from JS strings
		          "style-loader",
		          // Translates CSS into CommonJS
		          "css-loader",
		          // Compiles Sass to CSS
		          "sass-loader",
              ]
			},
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
				},
				exclude: [/node_modules/,/backend/]
			},
			{
				test: /\.(png|jpg|otf)$/,
				use: {
					loader: "url-loader?limit=8192"
				}
			},
			{
				test: /\.tsx?$/,
				exclude: [/node_modules/,/backend/],
				use: {
					loader: "ts-loader",
					options: {
						transpileOnly: true
					}
				}
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".js", ".d.ts", ".ts"]
	},
	externals: {
		jquery: "jQuery",
		react: "React",
		'react-dom': 'ReactDOM'
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin(),
	]
};
