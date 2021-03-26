const path = require("path");
module.exports = {
	mode: "development",
	devtool: "source-map",
	entry: {
		app: "./src/frontend/entryPoints/app.tsx",
		landing: "./src/frontend/entryPoints/landing.tsx",
		login: "./src/frontend/entryPoints/login.tsx",
		browser: "./src/frontend/entryPoints/browser.tsx",
		dashboard: "./src/frontend/entryPoints/dashboard.tsx",
		builder: "./src/frontend/entryPoints/builder.tsx"
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
		        ],
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
		extensions: [".tsx", ".js", ".ts"]
	},
	externals: {
		jquery: "jQuery"
	}
};
