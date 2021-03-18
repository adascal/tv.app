import startCase from 'lodash/startCase';
import UAParser from 'ua-parser-js';

import { APP_TITLE, APP_VERSION } from 'utils/app';

const OS_SAFE_LIST = ['iOS'];

export function getDeviceInfo() {
  const uaParser = new UAParser();
  const uaOS = uaParser.getOS();
  const uaDevice = uaParser.getDevice();
  const uaBrowser = uaParser.getBrowser();
  const uaEngine = uaParser.getEngine();
  const title = APP_TITLE;
  const version = APP_VERSION;

  const browser =
    uaBrowser.name && uaBrowser.version
      ? `${startCase(uaBrowser.name)} ${uaBrowser.version}`
      : `${startCase(uaEngine.name)} ${uaEngine.version}`;

  const software = `${OS_SAFE_LIST.includes(uaOS.name!) ? uaOS.name : startCase(uaOS.name)}${
    uaOS.version ? ` ${uaOS.version}` : ''
  } (${title} ${version})`;

  const hardware = uaDevice.vendor ? `${startCase(uaDevice.vendor)}${uaDevice.model ? ` ${uaDevice.model}` : ''} (${browser})` : browser;

  return { browser, software, hardware, title, version } as const;
}
