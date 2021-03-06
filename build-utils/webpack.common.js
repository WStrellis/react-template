/* Shared config for all environments */
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = (isDevelopment, path, webpack, envKeys) => ({
    entry: {
        app: "./src/index.js",
    },
    output: {
        filename: "[name].[hash].js",
        // enable nested routes in development
        publicPath: "/",
        path: path.resolve(__dirname, "../", "public"),
        // used for codesplitting
        chunkFilename: "[name].[hash].js",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                // look for css/sass modules
                test: /\.(sa|sc|c)ss$/,
                include: /\.module\.(sa|sc|c)ss$/,
                // loaders to transform files. Loaders are executed in opposite order of declaration
                loader: [
                    // last loader
                    // MiniCss plugin extracts css to separate file for production
                    isDevelopment
                        ? "style-loader"
                        : MiniCssExtractPlugin.loader,
                    {
                        // resolve url() and @import in CSS
                        loader: "css-loader",
                        options: {
                            // number of loaders before this one
                            importLoaders: 2,
                            // use module rules on @import resources
                            modules: true,
                            sourceMap: isDevelopment,
                            // Class names will be camelized, the original class name will not to be removed from the locals
                            localsConvention: "camelCase",
                        },
                    },
                    {
                        // apply prefixes and minimize
                        loader: "postcss-loader",
                        options: {
                            config: {
                                path: path.resolve(
                                    __dirname,
                                    "../",
                                    "build-utils/postcss.config.js",
                                ),
                            },
                        },
                    },
                    {
                        // first loader. convert SASS to CSS
                        loader: "sass-loader",
                        options: {
                            implementation: require("node-sass"),
                        },
                    },
                ],
            },
            {
                // look for standard css/sass stylesheets
                test: /\.(sa|sc|c)ss$/,
                exclude: /\.module\.(sa|sc|c)ss$/,
                // loaders to transform files. Loaders are executed in opposite order of declarationc
                loader: [
                    // last loader
                    // MiniCss plugin extracts css to separate file for production
                    isDevelopment
                        ? "style-loader"
                        : MiniCssExtractPlugin.loader,
                    {
                        // resolve url() and @import in CSS
                        loader: "css-loader",
                        options: {
                            // number of loaders before this one
                            importLoaders: 2,
                            sourceMap: isDevelopment,
                            // Class names will be camelized, the original class name will not to be removed from the locals
                            localsConvention: "camelCase",
                        },
                    },
                    {
                        // apply prefixes and minimize
                        loader: "postcss-loader",
                        options: {
                            config: {
                                path: path.resolve(
                                    __dirname,
                                    "../",
                                    "build-utils/postcss.config.js",
                                ),
                            },
                        },
                    },
                    {
                        // first loader. convert SASS to CSS
                        loader: "sass-loader",
                        options: {
                            implementation: require("node-sass"),
                        },
                    },
                ],
            },
            {
                // Process images
                test: /\.(png|jpe?g|gif|svg|webp)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            outputPath: "images",
                        },
                    },
                ],
            },
            {
                // Apply rule for fonts files
                test: /\.(woff|woff2|ttf|otf|eot)$/,
                use: [
                    {
                        // Using file-loader too
                        loader: "file-loader",
                        options: {
                            outputPath: "fonts",
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        // Eliminate need to type relative path to directories/files from these paths
        modules: ["node_modules", "src/styles", "test-utils", "src/components"],
        //  imports don't have to use the  file extension
        enforceExtension: false,
        extensions: [
            "*",
            ".js",
            ".jsx",
            ".scss",
            ".sass",
            ".css",
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".svg",
            ".webp",
        ],
    },
    plugins: [
        // delete contents of /dist
        new CleanWebpackPlugin({
            verbose: true,
        }),
        // generate index.html
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            title: "",
            favicon: "./src/assets/images/favicon.png",
        }),
        // put css in separate file from js
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].[hash].css",
        }),
        new webpack.DefinePlugin(envKeys),
    ],
})
