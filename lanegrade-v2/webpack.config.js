const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require("webpack");
const { AutomaticPrefetchPlugin, ids } = webpack;
const { HashedModuleIdsPlugin } = ids;

const cssLoader = 'css-loader';

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: ['tailwindcss', 'autoprefixer']
    }
  }
};

module.exports = function(env, { analyze }) {
  const production = env.production || process.env.NODE_ENV === 'production';
  return {
    target: 'web',
    mode: production ? 'production' : 'development',
    devtool: production ? undefined : 'eval-cheap-source-map',
    entry: {
      entry: './src/main.ts'
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: production ? "[name].[chunkhash].bundle.js" : "[name].[fullhash].bundle.js",
      sourceMapFilename: production ? "[name].[chunkhash].bundle.map" : "[name].[fullhash].bundle.map",
      chunkFilename: production ? "[name].[chunkhash].chunk.js" : "[name].[fullhash].chunk.js",
    },
    optimization: {
      minimize: true,
      mangleExports: 'size',
      minimizer: [
        new TerserPlugin({
          parallel: true,
        }),
      ],
      nodeEnv: "production",
      runtimeChunk: true,
      splitChunks: {
        chunks: "all",
        minSize: 0,
        minRemainingSize: 0,
        maxAsyncRequests: Infinity,
        maxInitialRequests: Infinity,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace("@", "")}`;
            },
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    performance: { hints: production ? "warning" : false },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'dev-app'), 'node_modules']
    },
    devServer: {
      historyApiFallback: true,
      open: !process.env.CI,
      port: 9000
    },
    module: {
      rules: [
        { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', options: { limit: 8192 } },
        { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' } },
        { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } },
        { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader' },
        { test: /\.css$/i, use: [ 'style-loader', cssLoader, postcssLoader ] },
        { test: /\.ts$/i, use: ['ts-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        {
          test: /[/\\]src[/\\].+\.html$/i,
          use: '@aurelia/webpack-loader',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new AutomaticPrefetchPlugin(),    
      new HtmlWebpackPlugin({ template: 'index.html' }),
      new CopyWebpackPlugin({
        patterns: [{ from: "static", to: path.resolve(__dirname, "dist") }],
      }),
      production &&
      new CompressionPlugin({
        filename: "[path][base].br",
        algorithm: "brotliCompress",
        test: /\.(js|ts|css|html|svg|md|json)$/,
        compressionOptions: {
          level: 11,
        },
        threshold: 0,
        minRatio: 0.8,
        deleteOriginalAssets: false,
      }),
      analyze && new BundleAnalyzerPlugin()
    ].filter(p => p)
  }
}
