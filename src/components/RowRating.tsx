import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import { Player } from '../lib/player';
import { getRank } from '../lib/ranks';

export default function RowRating({ player }) {
  const isActive = true;
  const playerRank = getRank(player);
  const changeIndicator = (change: number, indicators: string[]) => {
    const color = (change >= 0) ? 'success.main' : 'error.main';
    return <Typography
      component="span"
      variant="subtitle2"
      sx={{color, fontWeight: 100, ml: '8px'}}
    >
     {(change >= 0) ? indicators[0]: indicators[1]}{Math.abs(change)}
    </Typography>
  }

  const changePlusMinus = (change: number) => {
    return changeIndicator(change, ['+', '-'])
  }
  const isNew = (player: Player) => {
    return !player.oldRankedNetplayProfile;
  }
  const getRatingChange = (player: Player) => {
    if (isNew(player)) {
      return null;
    }
    return Math.floor(player.rankedNetplayProfile.ratingOrdinal - player.oldRankedNetplayProfile.ratingOrdinal);
  }
  const ratingChange = getRatingChange(player);

  return (
    <Box sx={{display: "flex", flexDirection: "column", alignItems: "left" }}>
      <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
        {playerRank.iconUrl && <div className="flex items-center justify-center">
          <Avatar sx={{ height: 32, width: 32, }} src={playerRank.iconUrl} />
        </div>}

        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
          <Typography sx={{fontWeight: 800, ml: '8px'}}>{Math.floor(player.rankedNetplayProfile.ratingOrdinal)}</Typography>
          {Boolean(ratingChange) && changePlusMinus(ratingChange)}
        </Box>
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 100, color: 'primary.light' }}>
        {playerRank.name.toUpperCase()}
      </Typography>
    </Box>
  );
}
