import fs from 'fs';
import path from 'path';

interface FileInfo {
  directory: string;
  name: string;
  path: string;
}

export function useFileInfo(filepath: string): FileInfo {
  if (!fs.existsSync(filepath)) {
    throw new Error('Unable to locate file.');
  }

  const name = path.basename(filepath);
  const directory = path.dirname(filepath);

  return { name, directory, path: filepath };
}
