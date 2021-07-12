import { findBestMatch } from 'string-similarity';

import { ParsedResult } from './parse';

export function bestMatch(
  results: ParsedResult[],
  query: string
): ParsedResult {
  const options = results.map((result) => result.title);

  const { bestMatch } = findBestMatch(query, options);

  return results.find(
    ({ title }) => title === bestMatch.target
  ) as ParsedResult;
}
