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
  .name('subfinder')
  .description('A CLI app for downloading subtitles.')
  .version(VERSION)
  .argument('<file>', 'file to download subtitles for')
  .option('-I, --interactive', 'Interactive Mode', false)
  .parse();

const options = program.opts() as CliOptions;
const relativeFilePath = process.argv[2];
const filePath = path.join(process.cwd(), relativeFilePath);

if (!fs.existsSync(filePath)) {
  console.error('Error: Unable to locate media file.');
  process.exit(1);
}

// Parse the filename for media info using whats-the-release package
const fileName = path.basename(filePath);
const release = parse(fileName);

render(<Subfinder filePath={filePath} isInteractive={options.interactive} release={release} version={VERSION} />);
