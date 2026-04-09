[1/1]
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 转发所有请求到谷歌
app.use('/', createProxyMiddleware({
    target: 'https://generativelanguage.googleapis.com',
    changeOrigin: true,
    pathRewrite: (path) => path, // 保持原样转发
    onProxyRes: function (proxyRes) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

app.listen(process.env.PORT || 3000);
