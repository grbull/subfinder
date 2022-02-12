import { WtrResult } from 'whats-the-release';

import { IOption } from './IOption';
import { IOptionRated } from './IOptionRated';

export interface ISubtitleSource {
  searchMediaOptions(release: WtrResult): Promise<IOptionRated[]>;
  getSubtitleOptions(mediaOption: IOption, release: WtrResult): Promise<IOptionRated[]>;
  downloadSubtitles(subtitleOption: IOption, destinationPath: string): Promise<void>;
}
