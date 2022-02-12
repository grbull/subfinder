import { WtrResult } from 'whats-the-release';

export interface IFormatter {
  formatRelease(result: WtrResult): string;
}
