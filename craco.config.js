const { ESLINT_MODES } = require('@craco/craco');
const { WebOSMetaPlugin, GracefulFsPlugin, ILibPlugin } = require('@enact/dev-utils');
const { appBuild, appSrc } = require('react-scripts/config/paths');
const { DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const dayjs = require('dayjs');

module.exports = {
  eslint: {
    mode: ESLINT_MODES.file,
  },
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        process.env.PROCESS_CSS_VARIABLES === 'true' && require('postcss-css-variables'),
      ].filter(Boolean),
    },
  },
  webpack: {
    /**
     * @type import("webpack").Configuration['alias']
     */
    alias: {
      '@enact/i18n/ilib': 'ilib',
    },
    /**
     * @type import("webpack").Configuration['plugins']
     */
    plugins: [
      new GracefulFsPlugin(),
      new WebOSMetaPlugin(),
      new ILibPlugin({ symlinks: false, ilib: 'resources/ilib' }),
      new CopyPlugin({
        patterns: [
          {
            from: `${appSrc}/manifest.json`,
            to: `${appBuild}/manifest.json`,
            transform(content) {
              const manifest = content.toString();

              return manifest.replace(/{{(\w+)}}/gm, (_, key) => process.env[key] ?? '');
            },
          },
          {
            from: `${appSrc}/bootstrap.html`,
            to: `${appBuild}/bootstrap.html`,
          },
        ],
      }),
      new DefinePlugin({
        __VERSION__: JSON.stringify(dayjs().format('YYYY-MM-DD')),
      }),
    ],
    configure: (
      /**
       * @type import("webpack").Configuration
       */
      webpackConfig,
    ) => {
      // TODO: Review css order in @enact/ui @enact/moonstone components
      const instanceOfMiniCssExtractPlugin = webpackConfig.plugins.find((plugin) => plugin.constructor.name === 'MiniCssExtractPlugin');
      if (instanceOfMiniCssExtractPlugin) {
        instanceOfMiniCssExtractPlugin.options.ignoreOrder = true;
      }

      return webpackConfig;
    },
  },
};
