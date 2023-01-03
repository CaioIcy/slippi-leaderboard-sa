import React from 'react';
import * as ReactDOM from 'react-dom'; // needed by tooltip
import ReactDOMServer from 'react-dom/server';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

import { CharacterStats } from '../lib/player';
import BowserIcon from '../../images/characters/bowser_default.png';
import DkIcon from '../../images/characters/dk_default.png';
import DocIcon from '../../images/characters/doc_default.png';
import FalcoIcon from '../../images/characters/falco_default.png';
import FalconIcon from '../../images/characters/falcon_default.png';
import FoxIcon from '../../images/characters/fox_default.png';
import GanonIcon from '../../images/characters/ganon_default.png';
import GnwIcon from '../../images/characters/gnw_default.png';
import IcsIcon from '../../images/characters/ics_default.png';
import KirbyIcon from '../../images/characters/kirby_default.png';
import LinkIcon from '../../images/characters/link_default.png';
import LuigiIcon from '../../images/characters/luigi_default.png';
import MarioIcon from '../../images/characters/mario_default.png';
import MarthIcon from '../../images/characters/marth_default.png';
import MewtwoIcon from '../../images/characters/mewtwo_default.png';
import NessIcon from '../../images/characters/ness_default.png';
import PeachIcon from '../../images/characters/peach_default.png';
import PichuIcon from '../../images/characters/pichu_default.png';
import PikachuIcon from '../../images/characters/pikachu_default.png';
import PuffIcon from '../../images/characters/puff_default.png';
import RoyIcon from '../../images/characters/roy_default.png';
import SamusIcon from '../../images/characters/samus_default.png';
import SheikIcon from '../../images/characters/sheik_default.png';
import YounglinkIcon from '../../images/characters/yl_default.png';
import YoshiIcon from '../../images/characters/yoshi_default.png';
import ZeldaIcon from '../../images/characters/zelda_default.png';
import UnknownIcon from '../../images/characters/unknown.png';

import { CircularProgressbarWithChildren, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// import CircularProgress from '@mui/material/CircularProgress';

interface Props {
  id: string;
  totalGames: number;
  stats: CharacterStats;
  small?: boolean;
}

const characterNameToIcon = new Map([
  ['BOWSER', BowserIcon],
  ['CAPTAIN_FALCON', FalconIcon],
  ['DONKEY_KONG', DkIcon],
  ['DR_MARIO', DocIcon],
  ['FALCO', FalcoIcon],
  ['FOX', FoxIcon],
  ['GAME_AND_WATCH', GnwIcon],
  ['GANONDORF', GanonIcon],
  ['ICE_CLIMBERS', IcsIcon],
  ['KIRBY', KirbyIcon],
  ['LINK', LinkIcon],
  ['LUIGI', LuigiIcon],
  ['MARIO', MarioIcon],
  ['MARTH', MarthIcon],
  ['MEWTWO', MewtwoIcon],
  ['NESS', NessIcon],
  ['PEACH', PeachIcon],
  ['PICHU', PichuIcon],
  ['PIKACHU', PikachuIcon],
  ['JIGGLYPUFF', PuffIcon],
  ['ROY', RoyIcon],
  ['SAMUS', SamusIcon],
  ['SHEIK', SheikIcon],
  ['YOSHI', YoshiIcon],
  ['YOUNG_LINK', YounglinkIcon],
  ['ZELDA', ZeldaIcon]
]);

export function Character({ id, totalGames, stats, small }: Props) {
  const icon = characterNameToIcon.get(stats.character) ?? UnknownIcon
  const percentage = 100*(stats.gameCount / totalGames)
  const charId = stats.character + id
  const humanCharName = stats.character.toLowerCase().split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
  const tooltipString = `${humanCharName} ${Number(percentage.toFixed(2))}%`

  const child = <Box>
    { small && <Avatar
      src={icon}
      sx={{
        width: '16px',
        height: '16px',
        alignItems: "center",
        justifyContent: "center",
        m: '2px',
      }}
    /> }

    { !small && <Box
      id={charId}
      sx={{
        maxWidth: '40px',
        maxHeight: '40px',
        m: '4px',
      }}>
      <CircularProgressbarWithChildren 
        value={percentage}
        strokeWidth={12}
        styles={buildStyles({
          strokeLinecap: 'butt',
          pathColor: '#2ECC40',
          trailColor: '#50525A',
        })}>
        <Avatar
          src={icon}
          sx={{
            width: '50%',
            height: '50%',
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </CircularProgressbarWithChildren>
    </Box> }
  </Box>

  return (
    <Tooltip
      disableFocusListener
      disableTouchListener
      placement="bottom"
      title={tooltipString}
    >
      { child }
    </Tooltip>
  );
}
