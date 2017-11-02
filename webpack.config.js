var path = require('path');
var webpack = require('webpack');
var glob = require('glob');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var entries = getMultiEntry('./src/**/**/*.js');
var chunks = Object.keys(entries);

module.exports = {
  entry: entries,
  output: {
    path: path.resolve(__dirname, './lib'),
    // publicPath: './lib/',
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, './src')]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['lib']),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'index',
    //   chunks: chunks,
	  // 	minChunks: chunks.length || 3
    // }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, './src'),
      to: path.resolve(__dirname, './lib'),
      ignore: ['*.js'],
      force: true
    }])
  ],
  resolve: {
    modules: [path.resolve(__dirname, "..")],
    extensions: ['.js', '.json']
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, "..")]
  }
}

if (process.env.NODE_ENV === 'production') {
  // module.exports.devtool = 'cheap-module-source-map';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      // sourceMap: true,
      compress: {
        warnings: false
      }
    })
  ]);
} else if (process.env.NODE_ENV === 'dev') {
  module.exports.devtool = 'cheap-module-eval-source-map';
}

function getMultiEntry (globPath) {
  var entries = {};
  glob.sync(globPath).forEach(function (entry) {
    var pathname = entry.substring(entry.indexOf('/src/') + 5, entry.lastIndexOf('.'));
    entries[pathname] = entry;
  });
  return entries;
}
