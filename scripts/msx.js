const fs = require('fs');
const path = require('path');
const util = require('util');
const pkg = require('../package.json');

const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

const buildDir = path.resolve(process.cwd(), 'build');
const outDir = path.resolve(buildDir, 'msx');

const createMSXConfig = (url, id, title, version, description) => ({
  name: 'Station X',
  version,
  parameter: `content:http://${url}/msx/start.json`,
  action: '[settings:validate_links:0|home]',
  dictionary: 'http://msxplayer.ru/assets/ru.json',
  pages: [
    {
      items: [
        {
          id: 'description',
          type: 'space',
          layout: '4,0,8,5',
          text: '',
        },
        {
          type: 'control',
          layout: '0,0,4,1',
          image: `http://${url}/logo512.png`,
          label: title,
          action: `link:http://${url}/bootstrap.html`,
          selection: {
            important: true,
            action: 'update:content:description',
            data: {
              text: [`{txt:msx-white: ${title}}${description ? ` — ${description}` : ''}`],
            },
          },
        },
        {
          type: 'control',
          layout: '0,1,4,1',
          image: 'http://msxplayer.ru/assets/msx-icon.png',
          label: 'MSXPlayer',
          action: 'execute:http://msxplayer.ru/msx/get-start-action',
          data: {
            referer: id,
          },
          selection: {
            important: true,
            action: 'update:content:description',
            data: {
              text: ['{txt:msx-white: MSXPlayer} — В этом плейлисте собраны все самые лучшие ссылки для твоего телевизора'],
            },
          },
        },
      ],
    },
  ],
});

(async () => {
  if (process.env.REACT_APP_URL) {
    if (!fs.existsSync(outDir)) {
      await mkdir(outDir, { recursive: true });
    }

    const msxConfig = createMSXConfig(
      process.env.REACT_APP_URL,
      process.env.REACT_APP_ID || pkg.name,
      process.env.REACT_APP_TITLE || pkg.description,
      process.env.REACT_APP_VERSION || pkg.version,
      process.env.REACT_APP_DESCRIPTION,
    );

    await writeFile(`${outDir}/start.json`, JSON.stringify(msxConfig, null, 2), {});
  }
})();
