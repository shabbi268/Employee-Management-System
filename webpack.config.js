const path = require(`path`);
const webpack = require(`webpack`);
const pkg = require(`./package.json`);

module.exports = {
  mode: `development`,
  devtool : `eval-source-map`,
  entry: {
    app: `./client/resources/js/app.module.js`,
  },
  output: {
    path: path.resolve(__dirname, `public`, `js`),
    filename: `[name].bundle.js`
  },
  module: {
    rules: [
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: `url-loader?limit=100000`
      },
      {
        test: /\.scss?$/,
        loaders: [
          `style-loader`, `css-loader`, `sass-loader`
        ]
      },
      {
        test: /\.css?$/,
        loaders: [
          `style-loader`, `css-loader`
        ]
      },
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, `client`, `resources`, `js`)
        ],
        exclude: [],
        use: [
          {
            loader: `babel-loader`,
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react"
              ],
              plugins: [
                "@babel/plugin-transform-runtime",
                "@babel/plugin-proposal-class-properties",
              ],
              compact: false
            }
          },
          {
            loader: `imports-loader?jQuery=jquery,$=jquery`
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: `jquery`,
      jQuery: `jquery`
    }),
    new webpack.DefinePlugin({
      REPLACE_APP_VERSION: JSON.stringify(pkg.version)
    })
  ],
  resolve: {
    modules: [
      `node_modules`,
      `shared`
    ],
    extensions: [ `.js`, `.css` ]
  },
  profile: false,
  bail: true,
  cache: true
};