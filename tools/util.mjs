import fetch from 'node-fetch';
import fs from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);

export const getWebAppContent = async (url) => {
  try {
    const response = await fetch(url);
    const body = await response.text();
    await writeFileAsync('./view/index.html', body);
  } catch (error) {
    throw error;
  }
};

export const currentTarget = (Platform) => {
  if (process.platform === 'win32') return Platform.WINDOWS.createTarget();
  else if (process.platform === 'darwin') return Platform.MAC.createTarget();
  else return Platform.LINUX.createTarget();
};
