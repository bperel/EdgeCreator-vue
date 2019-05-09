module.exports = {
  devServer: {
    proxy: {
      '^/(?!sockjs-node)': {
        target: 'http://localhost:8001',
        changeOrigin: true
      }
    }
  }
}
