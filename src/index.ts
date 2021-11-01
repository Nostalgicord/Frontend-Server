import express from 'express';
import path from 'path';

const frontend = express();
const port = 4000;

frontend.use(
  '/assets',
  express.static(path.join(__dirname, '..', 'build', 'assets')),
);

frontend.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

frontend.listen(port, () => {
  console.log(`[Server] Successfully starts at http://localhost:${port}`);
});
