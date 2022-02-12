import { IOption } from './IOption';

export interface ISubsceneParser {
  parseMediaOptions<T extends Element>(elements: T[]): IOption[];
  parseSubtitleOptions<T extends Element>(elements: T[]): IOption[];
}
