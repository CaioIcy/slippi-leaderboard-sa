import { allPlayerCodes, rankedPlayerCodes, unrankedPlayerCodes } from '../src/lib/data';
import { getPlayerDataThrottled } from './slippi';
import * as path from "path";
import * as fs from "fs";

import { DateTime, Duration, Settings } from "luxon";
Settings.defaultZone = "utc";

const FETCH_RANKED = true;

const getPlayerCodes = (): string[] => {
  // return ["JENS#613"];
  return FETCH_RANKED ? rankedPlayerCodes() : unrankedPlayerCodes();
}

const getSlippiPlayers = async (codes) => {
  console.log(`Fetching ${codes.length} players from slippi.gg...`);

  if(false) {
    console.log("getSlippiPlayers: returning dummy data");
    return JSON.parse('[{"displayName":"dummy","connectCode":{"code":"FOO#420"},"rankedNetplayProfile":{"id":"0x894425","ratingOrdinal":2195.378109,"ratingUpdateCount":150,"wins":126,"losses":24,"dailyGlobalPlacement":null,"dailyRegionalPlacement":25,"continent":"SOUTH_AMERICA","characters":[{"id":"0x894d55","character":"YOSHI","gameCount":10}]}}]');
  }

  const allData = codes.map(code => getPlayerDataThrottled(code));
  const results = await Promise.all(allData.map(p => p.catch(e => e)));
  const validResults = results.filter(result => !(result instanceof Error));
  const invalidResults = results.filter(result => (result instanceof Error));
  if(invalidResults.length) {
    console.log(`Invalid results (${invalidResults.length}):`);
    console.log(invalidResults);
  }

  const unsortedPlayers = validResults
    .filter((data: any) => data?.data?.getConnectCode?.user)
    .map((data: any) => data.data.getConnectCode.user);
  return unsortedPlayers.sort((p1, p2) =>
    (p2.rankedNetplayProfile?.ratingOrdinal || 0 ) - (p1.rankedNetplayProfile?.ratingOrdinal || 0))
}

async function main() {
  if(process.version !== "v18.12.0") {
    console.error("Wrong node version");
    return;
  }

  const now = DateTime.now().toUTC();
  console.log(`Running fetchPlayers (${FETCH_RANKED ? "ranked" : "unranked"}): ${now.ts}`);

  const codes = getPlayerCodes();
  const rc = await getSlippiPlayers(codes);
  const newPlayersJSON = JSON.stringify(rc);

  const filename = FETCH_RANKED
    ? path.join(__dirname, `../data/storage/players/players-${now.ts}.json`)
    : path.join(__dirname, `../data/storage/unranked-${now.ts}.json`);
  fs.writeFileSync(filename, newPlayersJSON);
  console.log(`Saved as [${filename}]`);
};

main();
