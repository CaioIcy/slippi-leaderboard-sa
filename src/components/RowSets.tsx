import Typography from '@mui/material/Typography';
import { Player } from '../lib/player';

interface Props {
  player: Player;
}

export default function RowSets({ player }: Props) {
  const totalSets = Math.max(
    player.rankedNetplayProfile.wins + player.rankedNetplayProfile.losses,
    player.rankedNetplayProfile.ratingUpdateCount);

  return (
    <Typography>
      {totalSets}
    </Typography>
  );
}
