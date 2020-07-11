'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
var webpack = require('webpack')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = defaultSettings.title || '恒昌医药' // page title
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
const port = 9001 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: './static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/apis': {
                target: `http://127.0.0.1:8849`,
                changeOrigin: true,
                pathRewrite: {
                    '^/apis': ''
                }
            }
        }
    },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: name,
        externals: {
            'vue': 'Vue',
            'vuex': 'Vuex',
            'element-ui': 'ELEMENT'
        },
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(zh-cn|en-gb)$/)
        ]
    },
    chainWebpack(config) {
        const cdn = {
            css: [],
            js: [
                'https://unpkg.com/vue@2.6.10/dist/vue.min.js',
                'https://unpkg.com/vuex@3.1.1/dist/vuex.min.js',
                'https://cdn.bootcss.com/element-ui/2.10.1/index.js',
                'https://unpkg.com/tinymce@4.9.3/tinymce.min.js'
            ]
        }
        config.plugin('html')
            .tap(args => {
                args[0].cdn = cdn
                return args
            })
        config.plugins.delete('preload') // TODO: need test
        config.plugins.delete('prefetch') // TODO: need test

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        // set preserveWhitespace
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace = true
                return options
            })
            .end()

        config
            // https://webpack.js.org/configuration/devtool/#development
            .when(process.env.NODE_ENV === 'development',
                config => config.devtool('cheap-source-map')
            )

        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    config
                        .plugin('ScriptExtHtmlWebpackPlugin')
                        .after('html')
                        .use('script-ext-html-webpack-plugin', [{
                            // `runtime` must same as runtimeChunk name. default is `runtime`
                            inline: /runtime\..*\.js$/
                        }])
                        .end()
                    config
                        .optimization.splitChunks({
                            chunks: 'all',
                            cacheGroups: {
                                libs: {
                                    name: 'chunk-libs',
                                    test: /[\\/]node_modules[\\/]/,
                                    priority: 10,
                                    chunks: 'initial' // only package third parties that are initially dependent
                                },
                                commons: {
                                    name: 'chunk-commons',
                                    test: resolve('src/components'), // can customize your rules
                                    minChunks: 3, //  minimum common number
                                    priority: 5,
                                    reuseExistingChunk: true
                                }
                            }
                        })
                    config.optimization.runtimeChunk('single')
                }
            )
    }
}
