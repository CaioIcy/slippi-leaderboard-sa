import * as path from "path";
import * as fs from "fs";

export const DIR_STORAGE = path.join(__dirname, "../../data/storage");
export const DIR_LIVE = path.join(__dirname, "../../data/live");

export const getFileTimestamps = () => {
  const res = fs.readdirSync(path.join(DIR_STORAGE, 'players'));
  const candidates = res.map(f => tsFromFilename(f));
  return candidates;
};

export const tsFromFilename = (filename: string): number => {
  return parseInt(filename.replace('players-', '').replace('.json', ''));
}

export const filenameFromTs = (ts: number): string => {
  return `players-${ts}.json`;
}
