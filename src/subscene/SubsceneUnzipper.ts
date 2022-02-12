import AdmZip from 'adm-zip';
import fs from 'fs';

import { ISubsceneUnzipper } from '../interfaces/ISubsceneUnzipper';

export class SubsceneUnzipper implements ISubsceneUnzipper {
  /**
   * Extracts the subtitle file from a zip file.
   * This is intended to work specifically with Subscene.
   *
   * @param zipPath Path of the zip file.
   * @param filePath Path to extract the subtitle file to.
   */
  public unzip(zipPath: string, filePath: string): void {
    const archive = new AdmZip(zipPath); // TODO: Test? How? Create an archive?
    const entries = archive.getEntries();
    const subtitleEntry = entries.find((entry) => entry.entryName.slice(entry.entryName.length - 3) === 'srt');

    if (subtitleEntry) {
      archive.extractEntryTo(subtitleEntry.entryName, '/tmp/subfinder/', false, true);
      fs.renameSync('/tmp/subfinder/' + subtitleEntry.entryName, filePath);
    }
  }
}
