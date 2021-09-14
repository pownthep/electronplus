import builder from 'electron-builder';
import { currentTarget } from './util.mjs';
import { getWebAppContent } from './util.mjs';

const Platform = builder.Platform;
const APP_URL = 'https://svp-pownthep.vercel.app';

(async () => {
  try {
    await getWebAppContent(APP_URL);
    await builder.build({
      targets: currentTarget(Platform),
      config: {
        extraResources: [`extraResources/${process.platform}/mpv`],
        asar: true,
        appId: 'io.comp.svp.desktop',
        productName: 'SVP',
        extraMetadata: {
          name: 'SVP',
          main: 'main.js'
        },
        files: [
          {
            from: '.',
            filter: ['package.json']
          },
          {
            from: 'dist/main'
          },
          'view'
        ],
        win: {
          target: [
            {
              target: 'nsis',
              arch: ['x64']
            }
          ],
          icon: 'resources/svp/icons/app.png'
        },
        mac: {
          target: ['zip'],
          icon: 'resources/svp/icons/app.png'
        },
        linux: {
          target: ['zip'],
          icon: 'resources/svp/icons/app.png'
        },
        directories: {
          buildResources: 'resources'
        },
        publish: null
      }
    });
  } catch (error) {
    console.log('Build failed');
    console.error(error);
  }
})();
