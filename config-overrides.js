const {
  override,
  addDecoratorsLegacy,
  disableEsLint,
  addBundleVisualizer,
  addWebpackAlias,
  adjustWorkbox,
  addLessLoader,
} = require('customize-cra');
const path = require('path');

module.exports = {
  webpack: override(
    addDecoratorsLegacy(),
    addBundleVisualizer({}, true),
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src'),
      components: path.resolve(__dirname, 'src/components'),
      assets: path.resolve(__dirname, 'src/assets')
    }),
    adjustWorkbox(wb =>
      Object.assign(wb, {
        skipWaiting: true,
        exclude: (wb.exclude || []).concat('index.html')
      })
    ),
    addLessLoader({
      localIdentName: '[local]--[hash:base64:8]',
      javascriptEnabled: true,
      modifyVars: {
        // 'hack': `true;@import "${require.resolve('antd/lib/style/color/colorPalette.less')}";`,
      }
    })
  )
};
