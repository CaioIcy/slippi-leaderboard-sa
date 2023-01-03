import { CharacterContainer } from './CharacterContainer';
import { Player } from '../lib/player';

export default function RowCharacters({ player }) {
  const totalGames = player.rankedNetplayProfile.characters.reduce((acc, val)=> acc + val.gameCount, 0);
  return (
    <CharacterContainer player={player} totalGames={totalGames} />
  );
}
