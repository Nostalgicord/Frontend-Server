import express from 'express';
import https from 'https';
import path from 'path';
import fs from 'fs';

export default function createServer(buildPath: string, sslPath: string): void {
  const frontend = express();
  const port = 4000;

  const server = https.createServer(
    {
      key: fs.readFileSync(path.join(sslPath, 'caKey.key'), 'utf8'),
      cert: fs.readFileSync(path.join(sslPath, 'cert.pem'), 'utf8'),
    },
    frontend,
  );

  server.listen(port, () => {
    console.log(`[Server] Successfully starts at http://localhost:${port}`);
  });

  frontend.use('/assets', express.static(path.join(buildPath, 'assets')));

  frontend.get('*', async (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}
