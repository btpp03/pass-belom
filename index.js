const http = require('http');
const fs = require('fs');
const { spawn } = require("child_process");
const PORT = process.env.SERVER_PORT || process.env.PORT || 7860;
const subtxt = './.npm/sub.txt';

// Create HTTP server first - responds immediately for health checks
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

// Run start.sh in background (use spawn to avoid pipe buffer overflow)
fs.chmod("start.sh", 0o777, (err) => {
  if (err) {
      console.error(`start.sh empowerment failed: ${err}`);
      return;
  }
  console.log(`start.sh empowerment successful`);
  const child = spawn('bash', ['start.sh'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });
  child.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
  child.stderr.on('data', (data) => {
    process.stderr.write(data);
  });
  child.on('close', (code) => {
    console.log(`start.sh exited with code ${code}`);
    console.log(`App is running`);
  });
});

// Handle SIGTERM gracefully
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down...');
  server.close(() => process.exit(0));
});
