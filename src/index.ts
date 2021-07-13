import { program } from 'commander';

import { subfinder } from './subfinder';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const VERSION = require('../package.json').version;

program
  .version(VERSION)
  .argument('<file>', 'file to download subtitles for')
  .action(async (filename: string) => {
    try {
      await subfinder(filename, process.cwd());
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })
  .description('A CLI app for downloading subtitles.')
  .parse(process.argv);
