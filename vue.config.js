const { VuetifyPlugin } = require('webpack-plugin-vuetify')

module.exports = {
  configureWebpack: () => {
    var webpack = require('webpack')
    var adjusted = {
      devtool: 'source-map',
      module: {
        rules: [
          {
            test: /\.md$/,
            loader: 'raw-loader' // npm install -D raw-loader
          }
        ]
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
        }),
        new VuetifyPlugin({
          styles: { configFile: 'src/styles/settings.scss' }
        })
      ]
    }
    return adjusted
  },
  transpileDependencies: ['vuetify']
}
