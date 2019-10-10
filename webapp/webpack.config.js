var path = require('path');

module.exports = {
    entry: ["babel-polyfill", "./src/index.tsx"],
    output: {
        path: path.resolve(__dirname, './build2'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    module: {
        rules: [
            // {
            //     test: /\.tsx?$/,
            //     use: 'ts-loader',
            //     exclude: /node_modules/,
            // },
            { 
                test: /\.tsx?$/, 
                loader: "babel-loader",
                query: {
                    presets: ['@babel/preset-react','@babel/preset-env'],
                  }
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
        ]
    }
};