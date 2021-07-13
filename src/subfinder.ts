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

export async function subfinder(file: string): Promise<void> {
  if (!fs.existsSync(file)) {
    throw new Error('Unable to locate file.');
  }

  const filename = path.basename(file);
  const fileDir = path.dirname(file);

  const release = parse(filename);

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
  const subtitlesResult = bestMatch(parsedSubtitlesPage, filename);

  console.log('Selected subtitles:', subtitlesResult.title);

  const downloadPage = await subSceneApi.getPage(subtitlesResult.link);
  const downloadUrl = parseSubtitleDownloadLink(downloadPage);

  const zipFile = await subSceneApi.getZipFile(downloadUrl);

  const destFile = release.container
    ? path.join(fileDir, `${filename.slice(0, filename.length - 4)}.srt`)
    : path.join(fileDir, filename + '.srt');

  unzipSubtitles(zipFile, destFile);

  console.log('Complete');
}
