import Cookies from 'js-cookie';

import storage from 'storage';

import KApiClient from './k';

class ApiClient extends KApiClient {
  isLogged() {
    return storage.getItem<boolean>('is_logged');
  }

  protected getAccessToken() {
    return Cookies.get('access_token') || storage.getItem<string>('access_token');
  }

  protected getRefreshToken() {
    return Cookies.get('refresh_token') || storage.getItem<string>('refresh_token');
  }

  protected saveTokens({ access_token, refresh_token, expires_in }: { access_token: string; refresh_token: string; expires_in: number }) {
    storage.setItem('is_logged', true, 30 * 24 * 3600);
    storage.setItem('access_token', access_token, expires_in);
    storage.setItem('refresh_token', refresh_token, 30 * 24 * 3600);

    Cookies.set('access_token', access_token, { expires: expires_in / (24 * 3600) });
    Cookies.set('refresh_token', refresh_token, { expires: 30 });
  }

  protected clearTokens() {
    (['access_token', 'refresh_token'] as const).forEach((key) => Cookies.remove(key));
    (['access_token', 'refresh_token', 'is_logged'] as const).forEach((key) => storage.removeItem(key));
  }
}

export default ApiClient;
