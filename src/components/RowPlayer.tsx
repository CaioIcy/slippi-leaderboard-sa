import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Flag } from './Flag';

export default function RowPlayer({ player }) {
  const extra = player.extraData;
  const flagCode = extra?.countryCode || extra?.subregion;
  return (
    <Box
      sx={{
        minWidth: "128px",
      }}
    >
      <Typography
        sx={{
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          color: 'primary.contrastText'
        }}
      >
        <Flag countryCode={flagCode} />
        &nbsp;{player.displayName}
      </Typography>
      <Typography variant="subtitle2" sx={{ fontWeight: 100, color: 'primary.light', display: "flex", alignItems: "center" }}>
        {player.connectCode.code}
        { extra?.ssbmRank &&
          <Typography variant="inherit" sx={{ fontSize: '12px'}}>
            &nbsp;• #{extra.ssbmRank}
          </Typography>
        }
      </Typography>
    </Box>
  );
}
