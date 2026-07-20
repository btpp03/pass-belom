#!/usr/bin/env node

const http = require("http");
const fs = require("fs");
const PORT = process.env.SERVER_PORT || process.env.PORT || 7860;
const subtxt = "./.npm/sub.txt";

const server = http.createServer((req, res) => {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Hello world!');
    } else if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    } else if (req.url === '/sub') {
      fs.readFile(subtxt, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Error reading sub.txt' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(data);
        }
      });
    } else {
      res.writeHead(404);
      res.end();
    }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
