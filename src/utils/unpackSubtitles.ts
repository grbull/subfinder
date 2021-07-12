import admzip from 'adm-zip';
import * as fs from 'fs';

export function unzipSubtitles(zipFile: string, destFile: string): void {
  const archive = new admzip(zipFile);
  const entries = archive.getEntries();
  const subtitleEntry = entries.find(
    (entry) => entry.entryName.slice(entry.entryName.length - 3) === 'srt'
  );

  if (subtitleEntry) {
    archive.extractEntryTo(
      subtitleEntry.entryName,
      '/tmp/subfinder/',
      false,
      true
    );
    fs.renameSync('/tmp/subfinder/' + subtitleEntry.entryName, destFile);
  }
}
