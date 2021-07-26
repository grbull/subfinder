import React, { ReactElement, useEffect, useState } from 'react';
import { parse } from 'whats-the-release';

import { InfoBar } from './components/InfoBar';
import { SelectOption } from './components/SelectOption';
import { StatusBar } from './components/StatusBar';
import { TitleBar } from './components/TitleBar';
import { useFileInfo } from './hooks/useFileInfo';
import { Option } from './Option';
import { seasonToOrdinal } from './utils/seasonToOrdinal';
import { subscene } from './utils/subscene';

interface Props {
  filePath: string;
  isInteractive?: boolean;
  version: string;
}

export function Subfinder({
  filePath,
  isInteractive = false,
  version,
}: Props): ReactElement {
  const [status, setStatus] = useState('Parsing filename...');
  const [mediaOptions, setMediaOptions] = useState<Option[] | undefined>(
    undefined
  );
  const [subOptions, setSubOptions] = useState<Option[] | undefined>(undefined);

  const file = useFileInfo(filePath);
  const release = parse(file.name);

  async function selectRelease(media: Option): Promise<void> {
    setSubOptions(undefined);

    setStatus('Downloading subtitles...');

    const destFile = release.container
      ? filePath.slice(0, filePath.length - 4) + '.srt'
      : filePath;

    await subscene.download(media, destFile);

    setStatus('Complete.');
  }

  // when user chooses a search result, eg movie or series
  async function selectMedia(media: Option): Promise<void> {
    if (isInteractive) {
      setMediaOptions(undefined);
    }

    setStatus('Fetching subtitle releases for selected media...');
    const subtitleOptions = await subscene.getSubtitleOptions(media, release);

    if (isInteractive) {
      setSubOptions(subtitleOptions);
      setStatus('> Please choose the correct subtitle for your release.');
    } else {
      await selectRelease(subtitleOptions[0]);
    }
  }

  useEffect(() => {
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

      setStatus('Searching subscene...');

      const mediaOptions = await subscene.getMediaOptions(
        searchQuery,
        searchQueryMatch
      );

      if (isInteractive) {
        setMediaOptions(mediaOptions);
        if (release.type === 'Movie') {
          setStatus('> Please choose the correct movie.');
        }
        if (release.type === 'Show') {
          setStatus('> Please choose the correct show and season.');
        }
      } else {
        await selectMedia(mediaOptions[0]);
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
        <SelectOption onSelect={selectMedia} options={mediaOptions} />
      )}
      {subOptions && (
        <SelectOption onSelect={selectRelease} options={subOptions} />
      )}
    </>
  );
}

Subfinder.defaultProps = { isInteractive: false };
