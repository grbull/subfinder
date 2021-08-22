import { useApp, useInput } from 'ink';
import path from 'path';
import React, { ReactElement, useEffect, useState } from 'react';
import { WtrResult } from 'whats-the-release';

import { ErrorMessage } from './components/ErrorMessage';
import { InfoBar } from './components/InfoBar';
import { SelectOption } from './components/SelectOption';
import { StatusBar } from './components/StatusBar';
import { TitleBar } from './components/TitleBar';
import { Option } from './Option';
import { subscene } from './utils/subscene';

interface Props {
  filePath: string;
  isInteractive?: boolean;
  release: WtrResult;
  version: string;
}

export function Subfinder({
  filePath,
  isInteractive = false,
  release,
  version,
}: Props): ReactElement {
  const [error, setError] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState('...');
  const [mediaOptions, setMediaOptions] = useState<Option[] | undefined>(
    undefined
  );
  const [subOptions, setSubOptions] = useState<Option[] | undefined>(undefined);

  const { exit } = useApp();

  useInput((input) => {
    if (input === 'q') {
      exit();
    }
  });

  async function selectRelease(media: Option): Promise<void> {
    setSubOptions(undefined);

    setStatus('Downloading subtitles...');

    const destFile = release.container
      ? filePath.slice(0, filePath.length - 4) + '.srt'
      : filePath;

    try {
      await subscene.download(media, destFile);
    } catch {
      setError('Error downloading subtitles');
    }

    setStatus('Complete.');
    exit();
  }

  // when user chooses a search result, eg movie or series
  async function selectMedia(media: Option): Promise<void> {
    if (isInteractive) {
      setMediaOptions(undefined);
    }

    setStatus('Fetching subtitle releases for selected media...');

    try {
      const subtitleOptions = await subscene.getSubtitleOptions(media, release);

      if (isInteractive) {
        setSubOptions(subtitleOptions);
        setStatus('> Please choose the correct subtitle for your release.');
      } else {
        await selectRelease(subtitleOptions[0]);
      }
    } catch {
      setError('Error fetching subtitle options');
    }
  }

  useEffect(() => {
    async function subfinder(): Promise<void> {
      setStatus('Searching subscene...');

      try {
        const mediaOptions = await subscene.getMediaOptions(release);

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
      } catch {
        setError('Error fetching media options');
      }
    }

    subfinder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <>
        <TitleBar version={version} />
        <InfoBar
          fileName={path.basename(filePath)}
          isInteractive={isInteractive}
        />
        <ErrorMessage error={error} />
      </>
    );
  }

  return (
    <>
      <TitleBar version={version} />
      <InfoBar
        fileName={path.basename(filePath)}
        isInteractive={isInteractive}
      />
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
