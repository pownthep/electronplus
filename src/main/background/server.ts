import express from 'express';
import os from 'os';
import download from 'image-downloader';
import fs from 'fs';
import path from 'path';
import stringHash from 'string-hash';

const CACHE_DIR = path.join(os.tmpdir(), 'electronplus_cache');
fs.access(CACHE_DIR, fs.constants.F_OK, (err) => {
  if (err)
    fs.mkdir(CACHE_DIR, (err) => {
      if (err) console.error(err);
    });
});

const app = express();
const PORT = 8000;
app.use(express.static(CACHE_DIR));

app.get('/', (req, res) => res.send('cache server running'));
app.get('/img', async (req, res) => {
  const fileName = stringHash(req.query.url);
  const dest = path.join(CACHE_DIR, `${fileName}`);
  fs.access(dest, fs.constants.F_OK, (err) => {
    if (err) {
      download
        .image({
          url: req.query.url,
          dest: dest,
          extractFilename: false
        })
        .then(() => {
          res.sendFile(dest);
        })
        .catch((err) => console.error(err));
    } else res.sendFile(dest);
  });
});
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
