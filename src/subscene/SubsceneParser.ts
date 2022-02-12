import { IOption } from '../interfaces/IOption';
import { ISubsceneParser } from '../interfaces/ISubsceneParser';

export class SubsceneParser implements ISubsceneParser {
  /**
   * Parses media results into option objects. This is likely to be changed based on Subscenes html.
   *
   * @param elements The elements to parse into options
   * @returns Options
   */
  public parseMediaOptions<T extends Element>(elements: T[]): IOption[] {
    return elements.reduce((options: IOption[], optionEl) => {
      const title = optionEl.innerHTML;
      const url = optionEl.getAttribute('href');

      if (title && url) {
        // Avoiding duplicates
        if (!options.find((option) => option.url === url)) {
          return [...options, { title, url }];
        }
      }

      return options;
    }, []);
  }

  /**
   * Parses subtitle results into option objects. This is likely to be changed based on Subscenes html.
   *
   * @param elements The elements to parse into options
   * @returns Options
   */
  public parseMediaSubtitleOptions<T extends Element>(elements: T[]): IOption[] {
    return elements.reduce((options: IOption[], optionEl) => {
      const url = (optionEl.querySelector('a') as HTMLAnchorElement).getAttribute('href');
      const spanEl = optionEl.querySelectorAll('span');
      const language = spanEl[0].innerHTML.trim();
      const title = spanEl[1].innerHTML.trim();

      if (title && url && language === 'English') {
        if (!options.find((option) => option.url === url)) {
          return [...options, { title, url }];
        }
      }

      return options;
    }, []);
  }
}
