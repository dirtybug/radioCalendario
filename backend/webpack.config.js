const path = require('path');

module.exports = {
  mode: 'development', // or 'production' based on your needs
  entry: './server.js', // Update this to your main file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    fallback: {
      "fs": false, // Some modules like fs have no browser equivalent
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "constants": require.resolve("constants-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "zlib": require.resolve("browserify-zlib"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "tls": false,
      "net": false,
      "child_process": false,
      "timers": require.resolve("timers-browserify"),
      "vm": require.resolve("vm-browserify"),
      "dns": false,
      "pg-hstore": false, 
      "child_process": false,
      "async_hooks": false,
      "readline": false

    }
  },
  
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'ignore-loader'
      },
      {
        test: /\.cs$/,
        use: 'ignore-loader'
      }
    ]
  }
};
