import Box from '@mui/material/Box';

export function Flag({ countryCode, width }: any) {
  const w = width || 24;

  return <>
    { countryCode &&
      <Box component="span" sx={{width: w, mx: '2px'}}>
        <img
          src={`https://flagcdn.com/${countryCode}.svg`}
          alt={`${countryCode} flag`}
          width={w}
        />
      </Box>
    }
  </>;
}
