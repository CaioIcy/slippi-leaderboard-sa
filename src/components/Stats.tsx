import { RankedNetplayProfile, Player, CharacterStats } from '../lib/player';
import { CharacterContainer } from './CharacterContainer';
import { Flag } from './Flag';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Props {
  sx: any;
  players: Player[];
}

export function Stats({ sx, players }: Props) {
  let sets = 0;
  let games = 0;
  let wins = 0;
  let losses = 0;
  let countries = {};

  
  let fakeCharacterStatsBuilder: Record<string, number> = {};

  players.forEach((player) => {
    wins += player.rankedNetplayProfile.wins;
    losses += player.rankedNetplayProfile.losses;
    sets += player.rankedNetplayProfile.wins + player.rankedNetplayProfile.losses;
    games += player.rankedNetplayProfile.characters.reduce((acc, val)=> acc + val.gameCount, 0);

    const cc = player.extraData?.countryCode || player.extraData?.subregion || "aq";
    if(!(cc in countries)) {
      countries[cc] = 0;
    }
    countries[cc] += 1;

    player.rankedNetplayProfile.characters.forEach((cs) => {
      if(!(cs.character in fakeCharacterStatsBuilder)) {
        fakeCharacterStatsBuilder[cs.character] = 0;
      }
      fakeCharacterStatsBuilder[cs.character] += cs.gameCount;
    });
  });

  let fakeCharacterStats: CharacterStats[] = [];
  for (const [charName, gameCount] of Object.entries(fakeCharacterStatsBuilder)) {
    fakeCharacterStats.push({
      character: charName,
      gameCount: gameCount,
    });
  }

  let correctness = 100.0 - (100.0 * (Math.abs(wins - losses) / Math.max(wins, losses)));

  let sortableCountries = [];
  for (const [k, v] of Object.entries(countries)) {
    if(k == "aq") {
       continue;
    }
    sortableCountries.push([k, v]);
  }
  sortableCountries.sort((c1, c2) => {
    return c2[1] - c1[1];
  });
  if("aq" in countries) {
    sortableCountries.push(["aq", countries["aq"]]);
  }


  let fakePlayer: Player = {
    displayName: "FAKE",
    connectCode: {
      code: "FAKE#000",
    },
    rankedNetplayProfile: {
      ratingOrdinal: 0,
      ratingUpdateCount: 0,
      wins: 0,
      losses: 0,
      dailyGlobalPlacement: null,
      dailyRegionalPlacement: null,
      characters: fakeCharacterStats,
      continent: "",
    },
  };

  return (
      <Box sx={sx}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1" sx={{color: 'primary.contrastText', alignItems: "center"}}>
            {sets} sets&nbsp;
            • {games} games&nbsp;
            { process.env.NODE_ENV === 'development' && <>• {correctness.toFixed(1)}% cov</> }
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {sortableCountries.map((cc, i) =>
            <Box
              key={`stats-country-${cc[0]}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems:"center",
              }}
            >
              <Flag countryCode={cc[0]} />
              <Typography sx={{color: 'primary.contrastText', alignItems: "center"}}>{cc[1]}</Typography>
            </Box>
          )}
        </Box>

        <CharacterContainer player={fakePlayer} totalGames={games} condensedSize={5} justifyContent="center" />
      </Box>
  );
}
