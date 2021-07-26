#!/usr/bin/env node

import { program } from 'commander';
import { render } from 'ink';
import path from 'path';
import React from 'react';

import { Subfinder } from './Subfinder';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const VERSION = require('../package.json').version;

// Resolve ~/ paths
// Q should quit app
// Error boundaries
// Description to subs
// hard code popular languages
// handle no options
// fix ability to select in-existent option

interface CliOptions {
  interactive?: boolean;
}

program
  .version(VERSION)
  .argument('<file>', 'file to download subtitles for')
  .option('-I, --interactive', 'Interactive Mode', false)
  .action((file: string, options: CliOptions) => {
    render(
      <Subfinder
        filePath={path.join(process.cwd(), file)}
        isInteractive={options.interactive}
        version={VERSION}
      />
    );
  })
  .description('A CLI app for downloading subtitles.')
  .parse(process.argv);
