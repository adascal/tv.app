const { TVWebApp, ProfileManager, TizenCertManager } = require('@tizentv/webide-common-tizentv');
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const bluebird = require('bluebird');
const camelCase = require('lodash/camelCase');
const pkg = require('../package.json');

const copy = util.promisify(fs.copy);
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const rename = util.promisify(fs.rename);

const APP_IDS = [];

const sourceDir = path.resolve(process.cwd(), 'tizen');
const buildDir = path.resolve(process.cwd(), 'build');
const tmpDir = path.resolve(process.cwd(), 'tmp/tizen');
const outDir = path.resolve(buildDir, 'dl/tizen');
const profilesPath = path.resolve(tmpDir, 'profiles');
const tizenCertPath = path.resolve(tmpDir, 'certs');

const profileManager = new ProfileManager(profilesPath);
const tizenCertManager = new TizenCertManager(tizenCertPath);

async function generatePackage(appName, appTitle, appVersion, appDescription, url, currentAppId) {
  const [id, name = id] = currentAppId.split(':');
  const buildDir = path.resolve(tmpDir, name);
  const configPath = path.resolve(buildDir, 'config.xml');
  const indexPath = path.resolve(buildDir, 'index.html');

  await copy(sourceDir, buildDir);

  const configText = await readFile(configPath, 'utf8');
  const indexText = await readFile(indexPath, 'utf8');

  await writeFile(indexPath, indexText.replaceAll('{{URL}}', url));
  await writeFile(
    configPath,
    configText
      .replaceAll('{{NAME}}', camelCase(appName))
      .replaceAll('{{TITLE}}', appTitle)
      .replaceAll('{{VERSION}}', appVersion)
      .replaceAll('{{URL}}', url),
  );

  return new Promise(async (resolve, reject) => {
    const packager = new TVWebApp(appName, buildDir);

    const authorCertPath = path.resolve(tizenCertManager.authorPath, `${appName}.p12`);
    if (!fs.existsSync(authorCertPath)) {
      tizenCertManager.createCert({
        keyFileName: appName,
        authorName: appName,
        authorPassword: appName,
        emailInfo: `${appName}@${url}`,
        countryInfo: '',
        stateInfo: '',
        cityInfo: '',
        organizationInfo: '',
        departmentInfo: '',
      });
    }
    const tizenAuthorProfile = {
      authorCA: tizenCertManager.getTizenDeveloperCA(),
      authorCertPath: authorCertPath,
      authorPassword: appName,
    };
    const tizenDistributorProfile = tizenCertManager.getTizenDistributorProfile('public');

    try {
      if (!profileManager.isProfileExist(appName)) {
        await profileManager.registerProfile(appName, tizenAuthorProfile, tizenDistributorProfile);
      }

      profileManager.setActivateProfile(appName);

      await packager.buildWidget(profileManager.profilePath);
      await rename(path.resolve(buildDir, `${appName}.wgt`), path.resolve(outDir, `${appName}${id === appName ? '' : `_${name}`}.wgt`));

      resolve();
    } catch (ex) {
      console.error(ex);
      reject(ex);
      return;
    }
  });
}

(async () => {
  if (process.env.REACT_APP_URL && process.env.PACKAGE_TIZEN === 'true') {
    await tizenCertManager.init();

    if (!fs.existsSync(profileManager.resourcePath)) {
      await mkdir(profileManager.resourcePath, { recursive: true });
    }

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
