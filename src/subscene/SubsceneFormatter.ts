import { WtrResult } from 'whats-the-release';

import { IFormatter } from '../interfaces/IFormatter';
import { IOrdinalConverter } from '../interfaces/IOrdinalConverter';

export class SubsceneFormatter implements IFormatter {
  private readonly _ordinalConverter: IOrdinalConverter;

  constructor(ordinalConverter: IOrdinalConverter) {
    this._ordinalConverter = ordinalConverter;
  }

  /**
   * Formats the release into a string that resembles how subscene displays them.
   * This enables us to try and find the closest matching string.
   *
   * Searching for a movie:
   * query: Movie Name
   * match: Movie Name (Year)
   *
   * Searching for a show:
   * query: Show Name
   * match: Show Name (Tenth Season)
   * @param release
   */
  public formatRelease(release: WtrResult): string {
    if (release.type === 'Movie') {
      if (release.year) {
        return `${release.name} (${release.year})`;
      }
      return release.name;
    }

    return `${release.name} - ${this._ordinalConverter.convert(release.season)} Season`;
  }
}
