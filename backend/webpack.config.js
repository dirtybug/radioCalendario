const path = require('path');

module.exports = {
  entry: './server.js',  // Ensure this points to your server.js
  target: 'node',                 // Set the target to Node.js
  output: {
    filename: 'bundle.js',        // Output file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  resolve: {
    fallback: {
      fs: false,                  // Don't include polyfills for fs
      path: require.resolve('path-browserify'), // Fallback for path
      os: require.resolve('os-browserify/browser'), // Fallback for os
      util: require.resolve('util/'), // Fallback for util
      npm: false,                 // No fallback for npm
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  mode: 'development',            // Change to 'production' when deploying
};
