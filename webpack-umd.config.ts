import * as webpack from 'webpack';
import * as path from 'path';
import * as fs from 'fs';
import * as angularExternals from 'webpack-angular-externals';
import * as rxjsExternals from 'webpack-rxjs-externals';
import * as UglifyJSPlugin from 'uglifyjs-webpack-plugin';

const pkg = JSON.parse(fs.readFileSync('./package.json').toString());

export default {
  entry: {
    'index.umd': './src/index.ts',
    'index.umd.min': './src/index.ts',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'case-ui-toolkit'
  },
  resolve: {
    extensions: [ '.ts', '.js', '.json' ]
  },
  externals: [
    angularExternals(),
    rxjsExternals()
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: 'tsconfig.json'
            }
          },
          {
            loader: 'angular2-template-loader'
          }
        ],
        exclude: [
          /node_modules/,
          /\.(spec|e2e)\.ts$/
        ]
      },

      {
        test: /\.json$/,
        use: 'json-loader'
      },

      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader']
      },

      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader']
      },

      {
        test: /\.html$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.join(__dirname, 'src')
    ),

    new UglifyJSPlugin({
      include: /\.min\.js$/,
      sourceMap: true
    }),

    new webpack.BannerPlugin({
      banner: `
/**
 * ${pkg.name} - ${pkg.description}
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @license ${pkg.license}
 */
      `.trim(),
      raw: true,
      entryOnly: true
    })

  ]
} as webpack.Configuration;
