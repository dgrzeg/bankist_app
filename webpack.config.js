const path = require(`path`);
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const { CleanWebpackPlugin } = require(`clean-webpack-plugin`);
const glob = require(`glob`);

const htmlPages = glob.sync(`./src/*.html`).map((path) => {
  //`.src/a.html`
  const chunk = path.replace(`.html`, ``).replace(`./src/`, ``);
  return new HtmlWebpackPlugin({
    template: path,
    filename: `${chunk}.html`,
    chunks: [`index`],
    inject: true,
  });
});

let mode = `development`;

if (process.env.NODE_ENV === `production`) {
  mode = `production`;
}

module.exports = {
  mode: mode,

  entry: {
    index: `./src/index.js`,
  },

  output: {
    //filename: `js/[name]/[name]`,
    path: path.resolve(__dirname, `dist`),
    assetModuleFilename: `img/[hash][ext][query]`,
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: `asset/resource`, //samo asset w zaleznosci od wielkosci obrazka male osadzi w js, inline osadzi wszystkie w js
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: `` },
          },
          `css-loader`,
          `postcss-loader`,
          `sass-loader`,
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: `babel-loader`,
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    // new HtmlWebpackPlugin({
    //   template: './src/index.html',
    // }),
  ].concat(htmlPages),

  devtool: `source-map`,
  devServer: {
    static: `./dist`,
    host: `127.0.0.1`, //bez tego uruchomi sie tez w ipv4
  },
};
