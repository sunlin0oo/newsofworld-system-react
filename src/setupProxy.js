const { createProxyMiddleware } = require('http-proxy-middleware')
// ๅๅไปฃ็
module.exports = function (app) {
  app.use(createProxyMiddleware('/ajax', {
    target: 'https://i.maoyan.com',
    changeOrigin: true,
  }))
}
