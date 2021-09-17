import WebTorrent from 'webtorrent';
import BackgroundTask from '.';
import { TORRENT } from '../handle/torrent';
import getPort from 'get-port';
import { Server } from 'http';

const task = new BackgroundTask();
const client = new WebTorrent();
let server: Server;
client.on('error', onClientError);

task.setup();

task.on('add_torrent', handleAddTorrent);
task.on('stream_torrent', handleStreamTorrent);

async function handleStreamTorrent(torrentId: string, socket: any) {
  try {
    if (server) server.close();
    const torrent = client.get(torrentId);
    if (torrent) {
      server = torrent.createServer();
      const port = await getPort({ port: [9000, 9001, 9002, 9003, 9004] });
      server.listen(port);
      task.emit.msg(socket, port, TORRENT.STREAM);
    }
  } catch (error) {
    task.emit.err(socket, error, TORRENT.STREAM);
  }
}

function handleAddTorrent(torrentId: string, socket: any) {
  const existingTorrent = client.get(torrentId);
  if (existingTorrent) onAddTorrent(existingTorrent, socket);
  else client.add(torrentId, (torrent) => onAddTorrent(torrent, socket));
}

// function registerTorrentEvents(torrent: WebTorrent.Torrent, socket: any) {
//   torrent.on('done', () => onTorrentDone());
//   torrent.on('download', onTorrentDownload);
//   torrent.on('error', onTorrentError);
// }

function onAddTorrent(torrent: WebTorrent.Torrent, socket: any) {
  // registerTorrentEvents(torrent);
  const files = torrent.files.map((f) => ({
    name: f.name,
    size: f.length
  }));
  task.emit.msg(socket, files, TORRENT.ADD);
}

// function onTorrentDone() {
//   task.emit.msg('done', 'torrent done');
// }

// function onTorrentDownload(byte: number) {
//   task.emit.msg(byte, 'torrent download');
// }

// function onTorrentError(err) {
//   task.emit.err(err, 'torrent error');
// }

function onClientError(err) {
  console.error(err);
}
