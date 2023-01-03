import { Player } from './player';
import { playerData } from './data';

import dataOldPlayers from '../../data/live/players-old.json';
import dataNewPlayers from '../../data/live/players-new.json';

export interface Context {
  players: Player[];
}

export const findByCode = (ctx: Context, code: string) => {
  return ctx.players.find(p => p.connectCode.code === code);
};

const setCount = (player: Player) => {
  if(!player.rankedNetplayProfile) {
    return 0;
  }
  return player.rankedNetplayProfile.wins +
    player.rankedNetplayProfile.losses;
}

const sortAndPopulatePlayers = (players: Player[]) => {
  players = players.filter((p)=> setCount(p))
    .concat(players.filter((p)=> !setCount(p)));
  players = players.filter((p) => p.rankedNetplayProfile?.continent === "SOUTH_AMERICA")
  players.forEach((player: Player, i: number) => {
    if(setCount(player) > 0) {
      player.rankedNetplayProfile.rank = i + 1
    }
  })
  return players
}

const injectData = (players: Player[]) => {
  players.forEach((player: Player) => {
    player.extraData = playerData(player.connectCode.code);
  });
  return players
}

export const buildContext = (): Context => {
  const rankedPlayersOld = sortAndPopulatePlayers(dataOldPlayers)
  const oldPlayersMap = new Map(
    rankedPlayersOld.map((p) => [p.connectCode.code, p]));
  
  const players = sortAndPopulatePlayers(dataNewPlayers);
  players.forEach((p) => {
    const oldData = oldPlayersMap.get(p.connectCode.code)
    if(oldData) {
      p.oldRankedNetplayProfile = oldData.rankedNetplayProfile
    }
  })

  injectData(players);
  return { players: players };
}