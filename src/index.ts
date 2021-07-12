#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { parse } from 'whats-the-release';

import { bestMatch } from './utils/bestMatch';
import { filterResultsByEpisode } from './utils/filterResultsByEpisode';
import {
  parseSearchPage,
  parseSubtitleDownloadLink,
  parseSubtitlesPage,
} from './utils/parse';
import { seasonToOrdinal } from './utils/seasonToOrdinal';
import { subSceneApi } from './utils/subSceneApi';
import { unzipSubtitles } from './utils/unpackSubtitles';

export async function subFinder(file: string, dir: string): Promise<void> {
  if (!fs.existsSync(path.join(dir, file))) {
    throw new Error('Unable to locate file.');
  }

  // I want to display version info
  console.log('Subfinder');

  const release = parse(file);

  const searchQuery = release.name;
  let searchQueryMatch = release.name;

  if (release.type === 'Movie') {
    const { name, year } = release;
    searchQueryMatch = year ? `${name} (${year})` : name;
  }
  if (release.type === 'Show') {
    const { name, season } = release;
    searchQueryMatch = `${name} - ${seasonToOrdinal(season)} Season`;
  }

  const searchPage = await subSceneApi.search(searchQuery);
  const parsedSearchPage = parseSearchPage(searchPage);
  const searchResult = bestMatch(parsedSearchPage, searchQueryMatch);

  console.log('Selected release:', searchResult.title);

  const subtitlesPage = await subSceneApi.getPage(searchResult.link);
  let parsedSubtitlesPage = parseSubtitlesPage(subtitlesPage);
  if (release.type === 'Show') {
    parsedSubtitlesPage = filterResultsByEpisode(
      parsedSubtitlesPage,
      release.episode
    );
  }
  const subtitlesResult = bestMatch(parsedSubtitlesPage, file);

  console.log('Selected subtitles:', subtitlesResult.title);

  const downloadPage = await subSceneApi.getPage(subtitlesResult.link);
  const downloadUrl = parseSubtitleDownloadLink(downloadPage);

  const zipFile = await subSceneApi.getZipFile(downloadUrl);

  const destFile = release.container
    ? path.join(dir, `${file.slice(0, file.length - 4)}.srt`)
    : path.join(dir, file + '.srt');

  unzipSubtitles(zipFile, destFile);

  console.log('Complete');
}

subFinder(process.argv[2], process.cwd())
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
