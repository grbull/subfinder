import Axios from 'axios';
import * as fs from 'fs';

const axios = Axios.create({ baseURL: 'https://subscene.com' });

async function search(query: string): Promise<string> {
  const { data } = await axios.post<string>(
    '/subtitles/searchbytitle',
    `query=${query}&l=`
  );
  return data;
}

async function getPage(url: string): Promise<string> {
  const { data } = await axios.get(url);
  return data;
}

async function getZipFile(url: string): Promise<string> {
  const zipDest = `/tmp/subfinder-${Date.now()}.zip`;
  const writer = fs.createWriteStream(zipDest);

  const response = await axios.get(url, { responseType: 'stream' });
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('close', () => resolve(zipDest));
    writer.on('error', reject);
  });
}

export const subSceneApi = { search, getPage, getZipFile };
