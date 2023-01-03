import * as path from "path";
import * as fs from "fs";
import * as utils from "./lib/utils";

import { DateTime, Duration, Settings } from "luxon";
Settings.defaultZone = "utc";

const findTimestamp = (timestamps: number[], now: DateTime, oldness: Duration) => {
  const dayInMs = Duration.fromObject({days: 1.25}).as('milliseconds');
  const diffs = timestamps.map(c => Math.abs((now - dayInMs) - c));
  const smallestDiff = Math.min(...diffs);
  const index = diffs.indexOf(smallestDiff);
  return timestamps[index];
};

async function main() {
  if(process.version !== "v18.12.0") {
    console.error("Wrong node version");
    return;
  }

  const now = DateTime.now().toUTC();
  console.log("Running preBuild: ", now.ts);

  const res = fs.readdirSync(path.join(utils.DIR_STORAGE, 'players'));
  res.sort();
  const latestFilename = res.pop();
  const latestTs = utils.tsFromFilename(latestFilename);

  const timestamps = utils.getFileTimestamps();
  const oldTs = findTimestamp(timestamps, now, {days : 1});
  const oldFilename = utils.filenameFromTs(oldTs);

  console.log(`Selected [${oldFilename}] > [${latestFilename}].`);

  // Copy to players-old.
  const oldFile = fs.readFileSync(path.join(utils.DIR_STORAGE, `players/${oldFilename}`));
  fs.writeFileSync(path.join(utils.DIR_LIVE, "players-old.json"), oldFile);

  // Copy to players-new.
  const newFile = fs.readFileSync(path.join(utils.DIR_STORAGE, `players/${latestFilename}`));
  fs.writeFileSync(path.join(utils.DIR_LIVE, "players-new.json"), newFile);

  // Update timestamp.json
  fs.writeFileSync(path.join(utils.DIR_LIVE, "timestamp.json"), JSON.stringify({updated: latestTs}));

  // Update weekly showcase.
  const currentWeekStart = now.startOf("week");
  const lastWeekStart = currentWeekStart.minus({ weeks: 1 });
  const weekFilename = `../weekly-showcase/week-${lastWeekStart.ts}.json`;
  const weekFile = fs.readFileSync(path.join(utils.DIR_STORAGE, weekFilename));
  console.log(`Week file [${weekFilename}].`)
  fs.writeFileSync(path.join(utils.DIR_LIVE, "week.json"), weekFile);
};

main();
