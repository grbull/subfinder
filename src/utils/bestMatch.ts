import { findBestMatch, Rating } from 'string-similarity';

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

export type RatedResult = ParsedResult & { rating: number };

export function matchRatings(
  results: ParsedResult[],
  query: string
): RatedResult[] {
  const options = results.map((result) => result.title);

  const { ratings } = findBestMatch(query, options);

  const ratedResults: RatedResult[] = results.map((result) => {
    const rating = ratings.find(
      (rating) => rating.target === result.title
    ) as Rating;
    return { ...result, rating: Math.round(rating.rating * 100) };
  });

  return ratedResults.sort((a, b) => b.rating - a.rating);
}
