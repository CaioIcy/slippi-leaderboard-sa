const fs = require("fs");
const path = require("path");

const { DateTime, Duration, Settings } = require("luxon");
Settings.defaultZone = "utc";

const DIR_DATA = path.join(__dirname, '../data/storage');
const DIR_WEEKLY_SHOWCASE = path.join(__dirname, '../data/weekly-showcase');

const fileTimestamps = () => {
  const res = fs.readdirSync(path.join(DIR_DATA, 'players'));
  const candidates = res.map(f => parseInt(f.replace('players-', '').replace('.json', '')));
  return candidates;
};

const dataFromTimestamp = (ts) => {
  const filePath = path.join(DIR_DATA, `players/players-${ts}.json`);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const codeToSets = (players) => {
  return players.reduce((a, v) =>
    ({ ...a, [v.connectCode.code]: v.rankedNetplayProfile.wins + v.rankedNetplayProfile.losses}), {});
};

const goats = (playersBefore, playersAfter) => {
  const top = 16;
  const result = [];

  const codesBefore = playersBefore.map(p => p.connectCode.code);
  const codesAfter = playersAfter.map(p => p.connectCode.code);
  const codesToConsider = codesAfter.filter(c => codesBefore.includes(c));

  const sortables = [];
  codesToConsider.forEach(code => {
    const before = playersBefore.find(p => p.connectCode.code == code);
    const after = playersAfter.find(p => p.connectCode.code == code);

    const setsBefore = (before.rankedNetplayProfile.wins + before.rankedNetplayProfile.losses);
    const setsAfter = (after.rankedNetplayProfile.wins + after.rankedNetplayProfile.losses);
    const setCount = setsAfter - setsBefore;

    if(setCount <= 0) {
      return;
    }

    sortables.push([code, setCount]);
  });

  sortables.sort(function(a, b) {
    return b[1] - a[1];
  });

  return sortables.slice(0, top).map(s => {
    return {
      code: s[0],
      sets: s[1],
    };
  });
};

const main = () => {
  console.log("bake week");

  const now = DateTime.now().toUTC();
  const currentWeekStart = now.startOf("week");
  const lastWeekStart = currentWeekStart.minus({ weeks: 1 });
  const lastWeekEnd = currentWeekStart.minus({ milliseconds: 1 });

  console.log("Current week:", currentWeekStart.toString());
  console.log("Last week:", lastWeekStart.toString());

  const fts = fileTimestamps();
  const lastWeekStartTimestamp = Math.min(...fts.filter(t => t >= lastWeekStart.ts));
  const lastWeekEndTimestamp = Math.max(...fts.filter(t => t <= lastWeekEnd.ts));

  const playersBefore = dataFromTimestamp(lastWeekStartTimestamp);
  const playersAfter = dataFromTimestamp(lastWeekEndTimestamp);

  const players = goats(playersBefore, playersAfter);
  const result = {
    metadata: {
      timestamp: lastWeekStart.ts,
    },
    data: players,
  };
  const filename = path.join(DIR_WEEKLY_SHOWCASE, `week-${lastWeekStart.ts}.json`);
  console.log(`Saving to [${filename}]...`);
  fs.writeFileSync(filename, JSON.stringify(result));
};

main();
