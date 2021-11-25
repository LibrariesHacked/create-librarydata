module.exports = {
  configureWebpack: (config) => {
    var webpack = require('webpack')
    var adjusted = {
      devtool: 'source-map',
      module: {
        rules: [
          {
            test: /\.md$/,
            loader: "raw-loader" // npm install -D raw-loader
          }
        ],
      },
      resolve: {
        fallback: {
          fs: false,
          http: false,
          https: false
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer']
        })
      ]
    }
    return adjusted;
  },
  transpileDependencies: ["vuetify"]
};
