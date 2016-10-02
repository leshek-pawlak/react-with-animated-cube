'use strict'

var webpack = require('webpack')

var WebpackNotifierPlugin = require('webpack-notifier')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

var Dashboard = require('webpack-dashboard')
var DashboardPlugin = require('webpack-dashboard/plugin')
var dashboard = new Dashboard()

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
    config.devtool = 'source-map'

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
        new ExtractTextPlugin('[name].[hash].css', {
            disable: !BUILD,
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new HtmlWebpackPlugin({
            template: './src/views/index.html',
            inject: 'body',
        }),
    ]

    if (!BUILD) {
        config.plugins.push(
            new WebpackNotifierPlugin({
                title: 'my page compilation',
            }),
            new DashboardPlugin(dashboard.setData)
        )
    }

    if (BUILD) {
        config.plugins.push(
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new CopyWebpackPlugin([
                {
                    from: './src/views/favicon.ico',
                },
            ])
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
