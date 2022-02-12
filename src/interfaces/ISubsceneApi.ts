export interface ISubsceneApi {
  fetchSearchPage(query: string): Promise<string>;
  fetchPage(url: string): Promise<string>;
}
