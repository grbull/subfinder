import { AxiosInstance } from 'axios';

import { ISubsceneApi } from '../interfaces/ISubsceneApi';

export class SubSceneApi implements ISubsceneApi {
  private readonly _axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this._axios = axios;
  }

  /**
   * Searches Subscene for the particular query and returns the raw html
   *
   * @param query The search query for the particular media.
   * @returns The raw html from the search page.
   */
  public async fetchSearchPage(query: string): Promise<string> {
    const result = await this._axios.request<string>({
      method: 'POST',
      url: 'https://subscene.com/subtitles/searchbytitle',
      data: `query=${query}&l=`,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)' },
    });
    return result.data;
  }

  /**
   * Fetches the page and returns the raw html.
   *
   * @param url The url of the page to fetch.
   * @returns The raw html from the page.
   */
  public async fetchPage(url: string): Promise<string> {
    const result = await this._axios.request({
      method: 'GET',
      url: 'https://subscene.com' + url,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)' },
    });
    return result.data;
  }
}
