var path = require('path')

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'DingTalkSDK',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
        // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
        { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  }
};
