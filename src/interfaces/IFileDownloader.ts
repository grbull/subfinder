export interface IFileDownloader {
  downloadFile(url: string, path: string): Promise<void>;
}
