var https = require('https');
var fs = require('fs');
var httpProxy = require('http-proxy');

// 读取证书和私钥
var options = {
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('fullchain.pem')
};

var proxy = httpProxy.createProxyServer({
  target: process.env.proxy_target,
  secure: false // 如果目标服务器使用自签名证书，需要设置为false
});

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong.');
});

var proxy_server = https.createServer(options, function (req, res) {
  proxy.web(req, res);
});

proxy_server.listen(8080, function () {
  console.log('proxy server is running on port 8080');
});
