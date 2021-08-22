#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import { render } from 'ink';
import path from 'path';
import React from 'react';
import { parse } from 'whats-the-release';

import { Subfinder } from './Subfinder';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const VERSION = require('../package.json').version;

interface CliOptions {
  interactive?: boolean;
}

program
  .version(VERSION)
  .argument('<file>', 'file to download subtitles for')
  .option('-I, --interactive', 'Interactive Mode', false)
  .action((file: string, options: CliOptions) => {
    const filePath = path.join(process.cwd(), file);

    if (!fs.existsSync(filePath)) {
      console.error('Error: Unable to locate media file.');
      process.exit(1);
    }

    const fileName = path.basename(filePath);
    const release = parse(fileName);

    render(
      <Subfinder
        filePath={filePath}
        isInteractive={options.interactive}
        release={release}
        version={VERSION}
      />
    );
  })
  .description('A CLI app for downloading subtitles.')
  .parse(process.argv);
