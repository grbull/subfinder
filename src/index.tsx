#!/usr/bin/env node

import { program } from 'commander';
import { render } from 'ink';
import path from 'path';
import React from 'react';

import { App } from './subfinder-interactive';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const VERSION = require('../package.json').version;

// Resolve ~/ paths
// Q should quit app
// Error boundaries
// Description to subs
// Linting rules
// hard code popular languages
// handle no options
// fix ability to select in-existent option

program
  .version(VERSION)
  .argument('<file>', 'file to download subtitles for')
  .option('-I, --interactive', 'Interactive Mode', false)
  .action((file: string, options: { interactive?: boolean }) => {
    try {
      render(
        <App
          filePath={path.join(process.cwd(), file)}
          isInteractive={options.interactive}
          version={VERSION}
        />
      );
    } catch (error) {
      // Add error boundary
      console.error(error);
      process.exit(1);
    }
  })
  .description('A CLI app for downloading subtitles.')
  .parse(process.argv);
