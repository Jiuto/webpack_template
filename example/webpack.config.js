const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const utils = require('../index.js');
const devMode = process.env.NODE_ENV === "development" ? true : false;
const pagesFile = ['shoppingMall', 'personalCenter', 'home'];
const { entry, htmlWebpackPlugins } = utils.setEntryAndHtmlPlugin(pagesFile);

module.exports = {
    entry: entry,
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[hash].js",
        publicPath: "/"
    },

    resolve: {
        extensions: [".js", ".jsx", ".json"],
        alias: {
          components: path.resolve(__dirname, "src/components")
        },
    },

    devtool: devMode ?"eval-source-map":"",

    devServer: {
        contentBase: false,
        inline: true, //实时刷新
        historyApiFallback: true,
    },

    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            import: true,
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
        new CopyWebpackPlugin({
            patterns: [
              { from: path.resolve(__dirname, "src/api"), to: "api" }
            ],
        }),
    ].concat(htmlWebpackPlugins.map(html=>{return new HtmlWebpackPlugin(html)})),
}