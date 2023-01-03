import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Player } from '../lib/player';
import { getRank } from '../lib/ranks';

export default function RowRank({ player }) {
  const rank = getRank(player);
  const isNew = (player: Player) => {
    return !player.oldRankedNetplayProfile;
  }

  const getRankChange = (player: Player) => {
    if (isNew(player)) {
      return null;
    }
    return player.oldRankedNetplayProfile.rank - player.rankedNetplayProfile.rank;
  }
  const changeIndicator = (change: number, indicators: string[]) => {
    const color = (change >= 0) ? 'success.main' : 'error.main';
    return <Typography
      component="span"
      variant="subtitle2"
      sx={{color, fontWeight: 100}}
    >
     {(change >= 0) ? indicators[0]: indicators[1]}{Math.abs(change)}
    </Typography>
  }

  const changeArrow = (change: number) => {
    return changeIndicator(change, ['▲ ', '▼ '])
  }

  const rankChange = getRankChange(player);
  return (
    <Box>
      <Typography>{`${player.rankedNetplayProfile.rank}`}</Typography>
      {Boolean(rankChange) && changeArrow(rankChange)}
      {Boolean(isNew(player)) && <Typography variant="body2" sx={{color: 'success.main'}}>NEW!</Typography>}
    </Box>
  );
}
