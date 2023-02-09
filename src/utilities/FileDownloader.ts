import axios from 'axios';
import fs from 'fs';

import { IFileDownloader } from '../interfaces/IFileDownloader';

export class FileDownloader implements IFileDownloader {
  /**
   * Downloads a file and saves it in the desired path.
   *
   * @param url the url of the file to download
   * @param path the local path to save the file at
   */
  public async downloadFile(url: string, path: string): Promise<void> {
    const fileStream = fs.createWriteStream(path);
    const request = await axios.request({
      method: 'GET',
      url: url,
      responseType: 'stream',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)' },
    });
    request.data.pipe(fileStream);

    await new Promise((resolve, reject) => {
      fileStream.on('close', resolve);
      fileStream.on('error', reject);
    });
  }
}
