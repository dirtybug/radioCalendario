const path = require('path');

module.exports = {
    entry: './server.js', // Entry point of your application
    output: {
        filename: 'bundle.js', // Output filename
        path: path.resolve(__dirname, 'dist'), // Output path
    },
    mode: 'development', // Change to 'production' for production builds
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // If using Babel for transpilation
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};