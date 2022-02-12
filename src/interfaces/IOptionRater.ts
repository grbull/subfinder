import { IOption } from './IOption';
import { IOptionRated } from './IOptionRated';

export interface IOptionRater {
  rateManyOptions(options: IOption[], matchString: string): IOptionRated[];
  rateSingleOption(option: IOption, matchString: string): IOptionRated;
}
