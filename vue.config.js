module.exports = {
  configureWebpack: (config) => {
    var webpack = require('webpack')
    var adjusted = {
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
          https: false,
          stream: require.resolve("stream-browserify")
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
