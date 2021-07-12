import { JSDOM } from 'jsdom';

export type ParsedResult = { title: string; link: string };

export function parseSearchPage(data: string): ParsedResult[] {
  const dom = new JSDOM(data);
  const { document } = dom.window;

  const resultElements = document.querySelectorAll(
    'div.search-result > ul > li > div.title > a'
  );

  const results: ParsedResult[] = [];

  for (const el of resultElements) {
    const title = el.innerHTML;
    const link = el.getAttribute('href');

    if (title && link) {
      results.push({ title, link });
    }
  }

  return results;
}

export function parseSubtitlesPage(
  data: string,
  language = 'English'
): ParsedResult[] {
  const dom = new JSDOM(data);
  const { document } = dom.window;

  const resultElements = document.querySelectorAll(
    'table > tbody > tr > td.a1'
  );

  const results: ParsedResult[] = [];

  for (const el of resultElements) {
    const spans = el.querySelectorAll('span');
    const title = spans[1].innerHTML.trim();
    const link = el.querySelector('a')?.getAttribute('href');
    const lang = spans[0].innerHTML.trim();

    if (title && link && lang === language) {
      results.push({ title, link });
    }
  }

  return results;
}

export function parseSubtitleDownloadLink(data: string): string {
  const dom = new JSDOM(data);
  const { document } = dom.window;

  const downloadUrl = document
    .querySelector('div.download >  a#downloadButton.button')
    ?.getAttribute('href');

  if (!downloadUrl) {
    throw new Error('Unable to parse download url.');
  }

  return downloadUrl;
}
