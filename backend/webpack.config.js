const path = require('path');

module.exports = {
    mode: 'development', // Set mode to development
    entry: './server.js', // Adjust based on your entry file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: 'html-loader',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(css|scss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    resolve: {
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "assert": require.resolve("assert/"),
            "async_hooks": false, // If you don't need it, you can set it to false
        },
    },
    stats: {
        errorDetails: true,
    },
};
