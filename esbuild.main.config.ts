import { BuildOptions } from 'esbuild';
import path from 'path';

export default {
  platform: 'node',
  entryPoints: [
    path.resolve('src/main/main.ts'),
    path.resolve('src/main/preload.ts'),
    path.resolve('src/main/background/torrent.ts'),
    path.resolve('src/main/background/server.ts'),
  ],
  bundle: true,
  target: 'node12.18.3',
  sourcemap: false
} as BuildOptions;
