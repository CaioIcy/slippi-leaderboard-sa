import { useState, useMemo } from 'react'
import { Player } from '../lib/player'
import { Character } from './Character'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Props {
  player: Player;
  totalGames: number;
  condensedSize?: number;
  justifyContent?: string;
}

export function CharacterContainer({ player, totalGames, condensedSize, justifyContent }: Props) {
  const finalCondensedSize = condensedSize || 3;

  const [expand, setExpand] = useState(false);

  const codeToId = (code: string) => {
    const parts = code.split('#');
    return `${parts[0].toLowerCase()}-${parts[1]}`;
  }

  const characters = useMemo(() => player.rankedNetplayProfile.characters
    .sort((a, b)=> b.gameCount - a.gameCount), [player]);

  const expandChracters = () => {
    setExpand(true);
  }

  const condenseCharacters = () => {
    setExpand(false);
  }

  // className="md:mx-1 mx-0.5 p-1 rounded-full border-gray-300 md:border-2 border
  //            border-dashed md:h-12 md:w-12 h-4 w-4 text-xs flex flex-col items-center
  //            justify-center hover:border-solid hover:text-gray-500 hover:border-gray-500"
  const condensedView = () => {
    return <>
      {characters.slice(0, finalCondensedSize).map((c) =>
          <Character id={codeToId(player.connectCode.code)}
            key={c.character} totalGames={totalGames} stats={c}/>
      )}

      <Box
        onClick={expandChracters}
        sx={{
          width: "36px",
          height: "36px",
          border: "2px",
          borderColor: "rgba(94, 96, 102, 0.498)",
          borderStyle: "dashed",
          borderRadius: '50%',

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mx: '4px',
        }}
      >
        <Typography paragraph sx={{color: 'rgb(147, 149, 153)', mb: 0, fontSize: 10}}>
          +{characters.length - finalCondensedSize}
        </Typography>
        <Typography paragraph sx={{color: 'rgb(147, 149, 153)', mb: 0, fontSize: 10}}>
          more
        </Typography>

      </Box>

    </>
  };

  const shouldCondense = characters.length > finalCondensedSize;

  const expandedView = () => {
    return <>
      {characters.slice(0, finalCondensedSize).map((c) =>
          <Character id={codeToId(player.connectCode.code)}
            key={c.character} totalGames={totalGames} stats={c}/>
      )}

      {characters.slice(finalCondensedSize, characters.length).map((c) =>
          <Character id={codeToId(player.connectCode.code)}
            small={true} key={c.character} totalGames={totalGames} stats={c}/>
      )}

      { shouldCondense &&
          <Box
            onClick={condenseCharacters}
            sx={{
              width: "36px",
              height: "36px",
              border: "2px",
              borderColor: "rgba(94, 96, 102, 0.498)",
              borderStyle: "dashed",
              borderRadius: '50%',

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mx: '4px',
            }}
          >
            <Typography paragraph sx={{color: 'rgb(147, 149, 153)', mb: 0, fontSize: 10}}>
              Hide
            </Typography>
          </Box>
      }
    </>
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: justifyContent || "flex-start",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {(expand || !shouldCondense) && expandedView()}
      {!expand && shouldCondense && condensedView()}
    </Box>
  );
}
