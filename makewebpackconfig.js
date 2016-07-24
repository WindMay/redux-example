var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

require('dotenv').config();

module.exports = function(options) {
  var config = require('./webpack/config')(options)
  var entry, jsLoaders, cssLoaders, plugins = [];

  function getEntry() {
    if (options.build) {
      return [path.resolve(__dirname, 'src/js/index.js')]
    } else {
      return [
        'webpack-dev-server/client?http://localhost:3000', // Needed for hot reloading
        'webpack/hot/only-dev-server', // See above
        path.resolve(__dirname, 'src/js/index.js') // Start with js/index.js...
      ]
    }
  }

  function getUglifyJSPlugin() {
    return new webpack.optimize.UglifyJsPlugin({ // Optimize the JavaScript...
      compress: {
        warnings: false // ...but do not show warnings in the console (there is a lot of them)
      }
    });
  }

  function getPlugins() {
    var plugins = []

    // Only use a template when local or development
    if (!options.build || config.environment == 'development') {
      plugins.push(new HtmlWebpackPlugin({template: 'dev/index_dev.html', inject: true}));
    } else { // Only uglify if it will be deployed to a non dev environment
      plugins.push(getUglifyJSPlugin());
    }

    if (options.build) { // Only for deployments to any environment:
      plugins.push(new ExtractTextPlugin('css/main.css'));
    } else { // Only for local development
      plugins.push(new webpack.HotModuleReplacementPlugin())
    }

    return plugins
  }


  // Setup plugins

  return {
    entry: getEntry(),
    output: { // Compile into js/dist.js
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/bundle.js'
    },
    module: {
      loaders: [{
        test: /\.js$/, // Transform all .js files required somewhere within an entry point...
        loaders: ['react-hot', 'babel'], // ...with the specified loaders...
        exclude: path.join(__dirname, '/node_modules/') // ...except for the node_modules folder.
      }, {
        test:   /\.css$/, // Transform all .css files required somewhere within an entry point...
        loader: 'style-loader!css-loader!postcss-loader' // ...with PostCSS
      }, {
        test: /src.*\.(jpe?g|png|gif)$/i,
        loader: 'file?name=[path][name].[ext]&context=src'
      }, {
        test: /sprite.*\.png$/i,
        loader: 'url-loader?limit=10000'
      }]
    },
    postcss: function(webpack) {
      return [
        require('postcss-import')({ // Import all the css files...
          glob: true,
          addDependencyTo: webpack
        }),
        require('precss'),
        require('postcss-simple-vars')(), // ...then replace the variables...
        require('postcss-focus')(), // ...add a :focus to ever :hover...
        require('autoprefixer')({ // ...and add vendor prefixes...
          browsers: ['last 2 versions'] // ...supporting the last 2 major browser versions and IE 8 and up...
        }),
        require('postcss-reporter')({ // This plugin makes sure we get warnings in the console
          clearMessages: true
        })
      ];
    },
    plugins: getPlugins(),
    target: 'web', // Make web variables accessible to webpack, e.g. window
    stats: false, // Don't show stats in the console
    progress: true
  }
}
