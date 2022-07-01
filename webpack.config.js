const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: `./index.js`,
    output: {
        path: path.resolve("./dist"),
        filename: "index.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"],
    },
    target: "web",
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                parallel: true,
                terserOptions: {
                    toplevel: true,
                    ie8: true,
                    safari10: true,
                },
            }),
        ],
    },
};
