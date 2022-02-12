import admzip from 'adm-zip';
import Axios from 'axios';
import * as fs from 'fs';
import { JSDOM } from 'jsdom';
import { compareTwoStrings } from 'string-similarity';
import { WtrResult } from 'whats-the-release';

import { Option } from '../Option';
import { seasonToOrdinal } from './seasonToOrdinal';

const axios = Axios.create({ baseURL: 'https://subscene.com' });

/**
 * Searches subscene based on the given query. Parses the search results and
 * adds ratings by comparing the result string to the match string.#
 * We then refer to them as options.
 *
 * @param release the release info provided by whats-the-release
 * @returns media options
 */
async function getMediaOptions(release: WtrResult): Promise<Option[]> {
  const query = release.name;
  let match = release.name;

  /**
   * Searching for a movie:
   * query: Movie Name
   * match: Movie Name (Year)
   *
   * Searching for a show:
   * query: Show Name
   * match: Show Name (Tenth Season)
   */
  if (release.type === 'Movie') {
    const { name, year } = release;
    match = year ? `${name} (${year})` : name;
  }
  if (release.type === 'Show') {
    const { name, season } = release;
    match = `${name} - ${seasonToOrdinal(season)} Season`;
  }

  const { data } = await axios.request<string>({
    method: 'POST',
    url: '/subtitles/searchbytitle',
    data: `query=${query}&l=`,
  });

  // Create a virtual dom so we can parse the necessary elements with ease
  const mediaElements = new JSDOM(data).window.document.querySelectorAll(
    'div.title > a'
  );

  const options: Option[] = [];

  for (const el of mediaElements) {
    const title = el.innerHTML;
    const url = el.getAttribute('href');

    // The properties exist and the option doesn't already exist.
    if (title && url && !options.find((option) => option.url === url)) {
      // Create a rating based on the match string provided.
      const rating = Math.round(compareTwoStrings(match, title) * 100);

      options.push({ title, url, rating });
    }
  }

  // Sort options from highest rating to lowest
  // We can automatically get the best one by picking the first item in array.
  options.sort((a, b) => b.rating - a.rating);

  return options;
}

/**
 * Grabs the media's page, parses all of the subtitle options, adds ratings
 * based on the full filename and returns them.
 *
 * @param media the selected media option to get subtitle options for
 * @param release the release info provided by whats-the-release
 * @param language the language which defaults to "English"
 * @returns subtitle options
 */
async function getSubtitleOptions(
  media: Option,
  release: WtrResult,
  language = 'English'
): Promise<Option[]> {
  const { data } = await axios.request({
    method: 'GET',
    url: media.url,
  });

  // Create a virtual dom so we can parse the necessary elements with ease
  const subtitleElements = new JSDOM(data).window.document.querySelectorAll(
    'table > tbody > tr > td.a1'
  );

  const options: Option[] = [];

  for (const el of subtitleElements) {
    const spans = el.querySelectorAll('span');
    const title = spans[1].innerHTML.trim();
    const url = el.querySelector('a')?.getAttribute('href');
    const lang = spans[0].innerHTML.trim();

    if (
      title && // Elements exist
      url &&
      lang === language && // Correct language
      !options.find((option) => option.url === url) // Not a duplicate
    ) {
      // Create a rating based on the filename
      const rating = Math.round(
        compareTwoStrings(release.filename, title) * 100
      );
      options.push({ title, url, rating });
    }
  }

  // If we're dealing with a show we filter out incorrect episodes
  if (release.type === 'Show') {
    return options.filter((option) =>
      option.title.toUpperCase().includes(`E${release.episode}`)
    );
  }

  // Sort options from highest rating to lowest
  // We can automatically get the best one by picking the first item in array.
  options.sort((a, b) => b.rating - a.rating);

  return options;
}

/**
 * Grabs the specific subtitle page, parses the download url, downloads zip
 * file to tmp folder, unzips and writes file to destFile
 *
 * @param subtitle the selected subtitle option to download
 * @param destFile the location to download the file to
 */
async function download(subtitle: Option, destFile: string): Promise<void> {
  const subtitlePage = await axios.request({
    method: 'GET',
    url: subtitle.url,
  });

  // Create a virtual dom so we can parse the necessary elements with ease
  const downloadUrl = new JSDOM(subtitlePage.data).window.document
    .querySelector('div.download >  a#downloadButton.button')
    .getAttribute('href');

  if (!downloadUrl) {
    throw new Error('Unable to determine url for subtitle file.');
  }

  // Download zip file
  const zipDest = `/tmp/subfinder-${Date.now()}.zip`;
  const writer = fs.createWriteStream(zipDest);

  const zipFile = await axios.request({
    method: 'GET',
    url: downloadUrl,
    responseType: 'stream',
  });
  zipFile.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on('close', resolve);
    writer.on('error', reject);
  });

  // Extract zip file
  const archive = new admzip(zipDest);
  const entries = archive.getEntries();
  const subtitleEntry = entries.find(
    (entry) => entry.entryName.slice(entry.entryName.length - 3) === 'srt'
  );

  if (subtitleEntry) {
    archive.extractEntryTo(
      subtitleEntry.entryName,
      '/tmp/subfinder/',
      false,
      true
    );
    fs.renameSync('/tmp/subfinder/' + subtitleEntry.entryName, destFile);
  }
}

export const subscene = {
  getMediaOptions,
  getSubtitleOptions,
  download,
};
