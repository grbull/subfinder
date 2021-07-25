import path from 'path';
import React, { ReactElement, useEffect, useState } from 'react';
import { parse } from 'whats-the-release';

import { InfoBar } from './components/InfoBar';
import { SelectResult } from './components/SelectResult';
import { StatusBar } from './components/StatusBar';
import { TitleBar } from './components/TitleBar';
import { useFileInfo } from './hooks/useFileInfo';
import { bestMatch, matchRatings, RatedResult } from './utils/bestMatch';
import { filterResultsByEpisode } from './utils/filterResultsByEpisode';
import {
  ParsedResult,
  parseSearchPage,
  parseSubtitleDownloadLink,
  parseSubtitlesPage,
} from './utils/parse';
import { seasonToOrdinal } from './utils/seasonToOrdinal';
import { subSceneApi } from './utils/subSceneApi';
import { unzipSubtitles } from './utils/unpackSubtitles';

interface Props {
  filePath: string;
  isInteractive?: boolean;
  version: string;
}

export function App({
  filePath,
  isInteractive = false,
  version,
}: Props): ReactElement {
  const [status, setStatus] = useState('Parsing filename...');
  const [mediaOptions, setMediaOptions] = useState<RatedResult[] | undefined>(
    undefined
  );
  const [subOptions, setSubOptions] = useState<RatedResult[] | undefined>(
    undefined
  );

  const file = useFileInfo(filePath);
  const release = parse(file.name);

  async function selectRelease(
    media: RatedResult | ParsedResult
  ): Promise<void> {
    setSubOptions(undefined);
    setStatus('Fetching subtitle download url...');

    const downloadPage = await subSceneApi.getPage(media.link);
    const downloadUrl = parseSubtitleDownloadLink(downloadPage);

    setStatus('Downloading subtitles...');

    const zipFile = await subSceneApi.getZipFile(downloadUrl);

    const destFile = release.container
      ? path.join(
          file.directory,
          `${file.name.slice(0, file.name.length - 4)}.srt`
        )
      : path.join(file.directory, file.name + '.srt');

    setStatus('Unzipping subtitles...');

    unzipSubtitles(zipFile, destFile);

    setStatus('Complete.');
  }

  // when user chooses a search result, eg movie or series
  async function selectMedia(media: RatedResult | ParsedResult): Promise<void> {
    if (isInteractive) {
      setMediaOptions(undefined);
    }

    setStatus('Fetching subtitle releases for selected media...');

    const subtitlesPage = await subSceneApi.getPage(media.link);

    let parsedSubtitlesPage = parseSubtitlesPage(subtitlesPage);
    if (release.type === 'Show') {
      parsedSubtitlesPage = filterResultsByEpisode(
        parsedSubtitlesPage,
        release.episode
      );
    }

    if (isInteractive) {
      const ratedResults = matchRatings(parsedSubtitlesPage, file.name);
      setSubOptions(ratedResults);
      setStatus('> Please choose the correct subtitle for your release.');
    } else {
      const subtitlesResult = bestMatch(parsedSubtitlesPage, file.name);
      await selectRelease(subtitlesResult);
    }
  }

  useEffect(() => {
    // Check file exists and ability to show errors

    async function subfinder(): Promise<void> {
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

      setStatus('Searching subscene');

      const searchPage = await subSceneApi.search(searchQuery);
      const parsedSearchPage = parseSearchPage(searchPage);

      if (isInteractive) {
        const ratedResults = matchRatings(parsedSearchPage, searchQueryMatch);
        setMediaOptions(ratedResults);
        if (release.type === 'Movie') {
          setStatus('> Please choose the correct movie.');
        }
        if (release.type === 'Show') {
          setStatus('> Please choose the correct show and season.');
        }
      } else {
        const searchResult = bestMatch(parsedSearchPage, searchQueryMatch);
        await selectMedia(searchResult);
      }
    }

    subfinder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TitleBar version={version} />
      <InfoBar fileName={file.name} isInteractive={isInteractive} />
      <StatusBar status={status} />
      {mediaOptions && (
        <SelectResult onSelect={selectMedia} options={mediaOptions} />
      )}
      {subOptions && (
        <SelectResult onSelect={selectRelease} options={subOptions} />
      )}
    </>
  );
}

App.defaultProps = { isInteractive: false };
