const { Packager } = require('@webosose/ares-cli/lib/package');
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const bluebird = require('bluebird');
const pkg = require('../package.json');

const copy = util.promisify(fs.copy);
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const rename = util.promisify(fs.rename);

const APP_IDS = ['netflix', 'amazon', 'ivi', 'youtube', 'com.27668.188461:movies_lg-cinema', 'ui30:movies_rakuten-tv'];

const sourceDir = path.resolve(process.cwd(), 'webos');
const buildDir = path.resolve(process.cwd(), 'build');
const tmpDir = path.resolve(process.cwd(), 'tmp/webos');
const outDir = path.resolve(buildDir, 'dl/webos');

async function generatePackage(appName, appTitle, appVersion, appDescription, url, currentAppId) {
  const [id, name = id] = currentAppId.split(':');
  const buildDir = path.resolve(tmpDir, name);
  const appInfoPath = path.resolve(buildDir, 'appinfo.json');
  const indexPath = path.resolve(buildDir, 'index.html');

  await copy(sourceDir, buildDir);

  const appInfoText = await readFile(appInfoPath, 'utf8');
  const indexText = await readFile(indexPath, 'utf8');
  const appInfo = JSON.parse(appInfoText);

  const newAppInfo = {
    ...appInfo,
    id,
    title: appTitle || appInfo.title,
    version: appVersion || appInfo.version,
    description: appDescription || appInfo.description,
  };

  await writeFile(indexPath, indexText.replaceAll('{{URL}}', url));
  await writeFile(appInfoPath, JSON.stringify(newAppInfo, null, 4));

  return new Promise((resolve, reject) => {
    const options = {
      pkgversion: newAppInfo.version,
    };

    const packager = new Packager(options);

    packager.generatePackage([buildDir], outDir, options, async (error) => {
      if (error) {
        console.error(error);
        reject(error);
        return;
      }

      await rename(path.resolve(outDir, packager.ipkFileName), path.resolve(outDir, `${appName}${id === appName ? '' : `_${name}`}.ipk`));

      resolve();
    });
  });
}

(async () => {
  if (process.env.REACT_APP_URL && process.env.PACKAGE_WEBOS === 'true') {
    if (!fs.existsSync(outDir)) {
      await mkdir(outDir, { recursive: true });
    }

    await bluebird.all(
      bluebird.map([process.env.REACT_APP_ID || pkg.name, ...APP_IDS], (appId) =>
        generatePackage(
          process.env.REACT_APP_ID || pkg.name,
          process.env.REACT_APP_TITLE || pkg.description,
          process.env.REACT_APP_VERSION || pkg.version,
          process.env.REACT_APP_DESCRIPTION,
          process.env.REACT_APP_URL,
          appId,
        ),
      ),
    );
  }
})();
