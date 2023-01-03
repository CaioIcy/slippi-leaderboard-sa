import * as React from 'react';

import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';


import Grid from '@mui/material/Unstable_Grid2';

import fizzi from '../../../../images/misc/kingfizzi.png';

import { Context, buildContext } from '../../../lib/context'

import timestamp from '../../../../data/live/timestamp.json';
const { DateTime, Duration } = require("luxon");

import { getRank } from '../../../lib/ranks'
import { Player } from '../../../lib/player'
import { Flag } from '../../Flag';

import { StickyHeadTable, Column } from '../../StickyHeadTable';

import RowPlayer from '../../RowPlayer';
import RowCharacters from '../../RowCharacters';
import RowRating from '../../RowRating';
import RowRank from '../../RowRank';
import RowSets from '../../RowSets';
import { Stats } from '../../Stats';

import { Showcase } from '../../Showcase';
import dataWeeklyShowcase from '../../../../data/live/week.json';

interface NewHomePageState {
  subregionID: number;
  updateDescription: string;
  ctx: Context;
}

const updatedAtDescription = () => {
  const now = DateTime.now().toUTC();
  const past = DateTime.fromMillis(timestamp.updated);
  const diff = now.diff(past);
  const unit = (diff.as("hours") >= 1) ? "hours" : "minutes";
  const result = now.minus({ milliseconds: diff.milliseconds })
    .toRelative({ unit });
  return `${result}`;
}

export default class NewHomePage extends React.Component<{}, NewHomePageState> {
  timerID: ReturnType<typeof setInterval>;

  constructor(props) {
    super(props);

    this.state = {
      subregionID: 1,
      updateDescription: updatedAtDescription(),
      ctx: buildContext(),
    };

    this.onChangeSubregionID = this.onChangeSubregionID.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      60*1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      updateDescription: updatedAtDescription(),
    })
  }

  onChangeSubregionID(e, newSubregionID) {
    this.setState({
      subregionID: newSubregionID || this.state.subregionID,
    });
  }

  render() {
    const filteredPlayers = this.state.ctx.players.filter(p => {
      if(this.state.subregionID === 1) return true;
      if(this.state.subregionID === 2) return p.extraData?.subregion === "cl";
      if(this.state.subregionID === 3) return p.extraData?.subregion === "br";
      if(this.state.subregionID === 4) return !["cl", "br"].includes(p.extraData?.subregion);
    });

    const rows = filteredPlayers.map((player) => {
      const rank = <RowRank player={player} />;
      const plyr = <RowPlayer player={player} />;
      const characters = <RowCharacters player={player} />;
      const rating = <RowRating player={player} />;
      const sets = <RowSets player={player} />;

      return [rank, plyr, characters, rating, sets]
    });

    const headerPxH = "64px";
    const footerPxH = "32px";

    return (
      <Box
        sx={{
          height: '100%',
          maxHeight: '100%',
        }}
      >

        <Box
          sx={{
            height: headerPxH,
            border: '1px solid',
            borderColor: 'primary.dark',
          }}
        >
          <Paper
            elevation={4}
            square={true}
            sx={{
              bgcolor: "secondary.main",
              height: '100%',
              maxHeight: '100%',
              display: "flex",
              justifyContent: "left",
              alignItems:"center",
            }}
          >
            <Typography sx={{ color: "secondary.contrastText", fontWeight: 900, ml: '10px',}}>
              🐸 Slippi Hub - South America Melee
            </Typography>
          </Paper>
        </Box>

        <Grid
          container
          sx={{
            bgcolor: 'primary.dark',
            height: `calc(96% - ${headerPxH} - 2*${footerPxH})`,
            maxHeight: `calc(96% - ${headerPxH} - 2*${footerPxH})`,
            my: '1%',
            justifyContent:"center",
          }}
        >
          <Grid
            xs={12}
            lg={3}
            sx={{
              px: '24px',
              mt: "1%",
              height: "100%",
              maxHeight: "100%",
              display: "flex",
              flexDirection: "column",
            }}>
              <Typography variant="h4" sx={{ color: "primary.contrastText" }}>
                Stats
              </Typography>

              <Stats
                sx={{
                  bgcolor: 'primary.main',
                  height: `${25*2}%`,
                  maxHeight: `${25*2}%`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  py: `${2*2}%`,
                }}
                players={filteredPlayers}
              />

              <Typography variant="h4" sx={{ color: "primary.contrastText", mt: '5%', }}>
                Showcase
              </Typography>

              <Showcase
                sx={{
                  bgcolor: 'blue',
                  height: `${65*2}%`,
                }}
                ctx={this.state.ctx}
                showcase={dataWeeklyShowcase}
              />


          </Grid>

          <Grid xs={12} lg={8}
            sx={{
              px: '24px',
              mt: "1%",
              height: "100%",
              maxHeight: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h4" sx={{ color: "primary.contrastText" }}>
              Leaderboards
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: '1%',
                flexWrap: "wrap",
              }}
            >
              <ToggleButtonGroup
                size="small"
                color="success"
                value={this.state.subregionID}
                exclusive
                onChange={this.onChangeSubregionID}
                aria-label="Subregion"
                sx={{
                  maxHeight: "32px",
                }}
              >
                <ToggleButton value={1} sx={{ color: "primary.light", px: '16px', fontWeight: 900, borderColor: 'primary.light', }}>All</ToggleButton>
                <ToggleButton value={2} sx={{ color: "primary.light", px: '16px', fontWeight: 900, borderColor: 'primary.light',  }}>Chile</ToggleButton>
                <ToggleButton value={3} sx={{ color: "primary.light", px: '16px', fontWeight: 900, borderColor: 'primary.light',  }}>Brazil</ToggleButton>
                <ToggleButton value={4} sx={{ color: "primary.light", px: '16px', fontWeight: 900, borderColor: 'primary.light',  }}>Other</ToggleButton>
              </ToggleButtonGroup>

              <Typography variant="body1" sx={{ color: "primary.light", fontWeight: 100, }}>
                Updated {this.state.updateDescription}
              </Typography>
            </Box>

            <StickyHeadTable columns={columns} rows={rows} withHeader={true} />
          </Grid>

          <Grid
            xs={12}
            component="footer"
            sx={{
              display: "flex",
              alignItems:"center",
              justifyContent:"center",
              color: "primary.light",
              height: footerPxH,
              minHeight: footerPxH,
              mt: '2%',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{}}>
              <Link href="https://slippi.gg/#support" target="_blank" rel="noreferrer" color="inherit" sx={{fontWeight: 900}}>
                Support Slippi
              </Link>

              &nbsp;• Maintained by&nbsp;
              <Link href="https://www.twitter.com/caioicy" target="_blank" rel="noreferrer"
                 color="inherit">
                @caioicy
              </Link>

              &nbsp;• Originally by&nbsp;
              <Link href="https://www.buymeacoffee.com/blorppppp" target="_blank" rel="noreferrer"
                 color="inherit">
                blorppppp
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

const columns: readonly Column[] = [
  {
    id: 'rank',
    label: 'RANK',
  },
  {
    id: 'player',
    label: 'PLAYER',
    minWidth: 128,
  },
  {
    id: 'characters',
    label: 'CHARACTERS',
    minWidth: 200,
  },
  {
    id: 'rating',
    label: 'RATING',
    minWidth: 100,
  },
  {
    id: 'sets',
    label: 'SETS',
  },
];
