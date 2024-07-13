const http = require('http');
const httpProxy = require('http-proxy');

// 创建一个代理服务器实例
const proxy = httpProxy.createProxyServer({
  target: process.env.proxy_target,
  secure: false, // 如果目标服务器使用的是自签名证书，可以将此选项设置为false
  changeOrigin: true // 更改origin头
});

// 创建一个http服务器
const server = http.createServer((req, res) => {
  // 在接收到请求时，将请求代理到目标服务器
  proxy.web(req, res, (err) => {
    if (err) {
      console.error('Proxy error:', err);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end('Something went wrong.');
    }
  });
});

// 启动服务器，监听指定端口
server.listen(8080, () => {
  console.log('Proxy server is running on http://localhost:3000');
});

// 处理代理服务器错误
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong.');
});