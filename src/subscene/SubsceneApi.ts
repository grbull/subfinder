import { AxiosInstance } from 'axios';

import { ISubsceneApi } from '../interfaces/ISubsceneApi';

export class SubsceneApi implements ISubsceneApi {
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
      url: url,
    });
    return result.data;
  }
}
