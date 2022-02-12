import { compareTwoStrings } from 'string-similarity';

import { IOption } from '../interfaces/IOption';
import { IOptionRated } from '../interfaces/IOptionRated';
import { IOptionRater } from '../interfaces/IOptionRater';

export class OptionRater implements IOptionRater {
  /**
   * Maps over the given list of options, adds a rating property based on the
   * similarity between the matchString and the option title.
   * They are then sorted from highest rated to least rated.
   *
   * @param options The options to add ratings to.
   * @param matchString The string to rate the option title against.
   * @returns A list of options with ratings.
   */
  public rateManyOptions(options: IOption[], matchString: string): IOptionRated[] {
    return options.map((option) => this.rateSingleOption(option, matchString)).sort((a, b) => b.rating - a.rating);
  }

  /**
   * Rates an individual option based on the similarity between the matchString and option title.
   *
   * @param option The option to rate.
   * @param matchString The string to rate the option title against.
   * @returns A rated option.
   */
  public rateSingleOption(option: IOption, matchString: string): IOptionRated {
    const rating = Math.round(compareTwoStrings(matchString, option.title) * 100);
    return { ...option, rating };
  }
}
