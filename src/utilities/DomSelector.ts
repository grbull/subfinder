import { JSDOM } from 'jsdom';

import { IDomSelector } from '../interfaces/IDomSelector';

export class DomSelector implements IDomSelector {
  /**
   * Loads the HTML into a virtual dom and returns the desired element.
   *
   * @param html The html to select the element from.
   * @param selector The string used to select the specific element.
   * @returns The desired element.
   */
  public selectOne<T extends Element>(html: string, selector: string): T {
    const dom = new JSDOM(html);
    const element = dom.window.document.querySelector<T>(selector);

    if (element === null) {
      throw new Error('DomSelector: Element could not be selected.');
    }

    return element;
  }

  /**
   * Loads the HTML into a virtual dom and returns the desired elements as an array.
   *
   * @param html The html to select the element from.
   * @param selector The string used to select the specific element.
   * @returns The desired elements as an array.
   */
  public selectMany<T extends Element>(html: string, selector: string): T[] {
    const dom = new JSDOM(html);
    const elements = Array.from(dom.window.document.querySelectorAll<T>(selector));
    return elements;
  }
}
