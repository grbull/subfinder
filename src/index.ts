import { program } from 'commander';
import path from 'path';

import { subfinder } from './subfinder';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const VERSION = require('../package.json').version;

program
  .version(VERSION)
  .argument('<file>', 'file to download subtitles for')
  .action(async (file: string) => {
    try {
      console.log(`subfinder v${VERSION}`);
      await subfinder(path.join(process.cwd(), file));
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })
  .description('A CLI app for downloading subtitles.')
  .parse(process.argv);
