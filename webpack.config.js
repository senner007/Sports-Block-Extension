const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const common = {
   mode: "production",
   resolve: {
      extensions: [".ts", ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
      ],
   }
}

module.exports = [{
   entry: {
      main: path.resolve(__dirname, "src\\Content", "extension-content.ts"),
   },
   output: {
      path: path.join(__dirname, "./"),
      filename: "extension-content.js",
   },
   ...common
},
{
   entry: {
      main: path.resolve(__dirname, "src\\UI", "extension-ui.ts"),
   },
   output: {
      path: path.join(__dirname, "./"),
      filename: "extension-ui.js",
   },
   ...common
},
{
   entry: {
      main: path.resolve(__dirname, "src", "service-worker.ts"),
   },
   output: {
      path: path.join(__dirname, "./"),
      filename: "service-worker.js",
   },
   ...common
}]