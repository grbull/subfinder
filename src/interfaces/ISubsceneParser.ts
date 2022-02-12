import { IOption } from './IOption';

export interface ISubsceneParser {
  parseMediaOptions<T extends Element>(elements: T[]): IOption[];
  parseMediaSubtitleOptions<T extends Element>(elements: T[]): IOption[];
}
