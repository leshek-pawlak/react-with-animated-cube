'use strict'

var webpack = require('webpack')

var WebpackNotifierPlugin = require('webpack-notifier')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

var DashboardPlugin = require('webpack-dashboard/plugin')

module.exports = function makeWebpackConfig(options) {
    /**
     * Environment type
     * BUILD is for generating minified builds
     */
    var BUILD = !!options.BUILD

    var config = {}

    /**
     * Entry configuration
     */
    config.entry = {
        app: ['./src/views/index'],
        vendor: ['react'],
    }

    /**
     * Eesolve configuration
     */
    config.resolve = {
        extensions: ['', '.js', '.jsx', '.json'],
        modulesDirectories: ['src', 'node_modules'],
    }

    /**
     * Output configuration
     */
    config.output = {
        path: __dirname + '/dist',
        publicPath: BUILD ? '/' : 'http://localhost:8080/',
        filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',
        chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js',
    }

    /**
     * Devtool configuration
     */
    if (BUILD) {
        config.devtool = 'source-map'
    } else {
        config.devtool = 'eval'
    }

    /**
     * Modules configuration
     */
    config.module = {
        preLoaders: [
            {
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
            },
        ],
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel?cacheDirectory',
            exclude: /node_modules/,
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader',
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            loader: 'file',
        }, {
            test: /\.html$/,
            loader: 'raw',
        }],
        externals: {
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react',
            },
        },
    }

    /**
     * Plugins configuration
     */
    config.plugins = [
        new webpack.optimize.CommonsChunkPlugin('vendor', BUILD ? 'vendor.[hash].js' : 'vendor.bundle.js'),
        new webpack.optimize.OccurenceOrderPlugin(),
        new DashboardPlugin(),
        new HtmlWebpackPlugin({
            template: './src/views/index.html',
            inject: 'body',
        }),
    ]

    if (!BUILD) {
        config.plugins.push(
            new WebpackNotifierPlugin({
                title: 'my page compilation',
            })
        )
    }

    if (BUILD) {
        config.plugins.push(
            new ExtractTextPlugin('[name].[hash].css'),
            new webpack.EnvironmentPlugin(['NODE_ENV']),
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.DedupePlugin(),
            new CopyWebpackPlugin([
                {
                    from: './src/views/favicon.ico',
                },
            ]),
            new webpack.optimize.UglifyJsPlugin()
        )
    }

    /**
     * Dev server configuration
     */
    config.devServer = {
        contentBase: './',
        noInfo: true,
        quiet: true,
        stats: {
            modules: false,
            cached: false,
            colors: false,
            chunk: false,
        },
    }


    return config
}
