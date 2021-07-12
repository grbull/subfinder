import { ParsedResult } from './parse';

export function filterResultsByEpisode(
  results: ParsedResult[],
  episode: string
): ParsedResult[] {
  return results.filter((result) =>
    result.title.toUpperCase().includes(`E${episode}`)
  );
}
