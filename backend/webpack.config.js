const path = require('path');

module.exports = {
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
            "path": require.resolve("path-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "fs": false,
            "util": require.resolve("util/"),
            "url": require.resolve("url/"),
            "child_process": false,
        },
    },
    stats: {
        errorDetails: true, // Add this line to show error details
    },
};