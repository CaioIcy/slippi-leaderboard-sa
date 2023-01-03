import { RankedNetplayProfile, Player, CharacterStats } from '../lib/player';
import { StickyHeadTable, Column } from './StickyHeadTable';
import RowPlayer from './RowPlayer';
import { Flag } from './Flag';
import PendingIcon from '../../images/ranks/Pending.svg';
import { playerData } from '../lib/data';
import { Context, findByCode } from '../lib/context';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ShowcaseData {
  code: string;
  sets: number;
}

interface ShowcaseMetadata {
  timestamp: number;
}

interface Showcase {
  data: ShowcaseData[];
  metadata: ShowcaseMetadata;
}

interface Props {
  ctx: Context;
  showcase: Showcase;
  sx: any;
}

const columns: readonly Column[] = [
  {
    id: 'rank',
    label: 'RANK',
  },
  {
    id: 'foo',
    label: 'RANK',
  },
  {
    id: 'bar',
    label: 'RANK',
  },
];

export function Showcase({ sx, ctx, showcase }: Props) {
  const top = 8;

  const data = showcase.data;
  const metadata = showcase.metadata;

  // const lastWeek = new Date(metadata.timestamp).toISOString().split('T')[0];
  const lastWeek = new Date(metadata.timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const rows = data.slice(0, top).map((d, i) => {
    const player = findByCode(ctx, d.code);
    const rank = i+1;
    const fw = (rank <= 3) ? 900 : null;
    const cl = (rank > 3) ? 'primary.light' : {1: 'yellow', 2: 'silver', 3: 'orange'}[rank];
    return [
      <Typography sx={{color: cl, fontWeight: fw,}}>{rank}</Typography>,
      <RowPlayer player={player} />,
      <>
        <Box sx={{display: "flex"}}>
          <Typography sx={{color: 'primary.contrastText'}}>{d.sets}</Typography>
          <Typography sx={{color: 'primary.light'}}>&nbsp;sets</Typography>
        </Box>
      </>,
    ];
  });

  return (
    <>
      <Typography variant="subtitle1" sx={{color: 'primary.light'}}>Week of {lastWeek}</Typography>
      <StickyHeadTable columns={columns} rows={rows} />
    </>
  );
}
