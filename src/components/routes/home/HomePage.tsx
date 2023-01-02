import React, { useEffect, useState } from 'react';
import { Table } from '../../Table';
import { Player } from '../../../lib/player'
import { playerData } from '../../../lib/data'
import playersOld from '../../../../cron/data/players-old.json';
import playersNew from '../../../../cron/data/players-new.json';
import timestamp from '../../../../cron/data/timestamp.json';
import fizzi from '../../../../images/misc/kingfizzi.png';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // import plugin
import * as settings from '../../../../settings'
dayjs.extend(relativeTime)


const setCount = (player: Player) => {
  return player.rankedNetplayProfile.wins +
    player.rankedNetplayProfile.losses;
}

const sortAndPopulatePlayers = (players: Player[]) => {
  players = players.filter((p)=> setCount(p))
    .concat(players.filter((p)=> !setCount(p)));
  players = players.filter((p) => p.rankedNetplayProfile.continent == "SOUTH_AMERICA")
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

export default function HomePage() {

  const rankedPlayersOld = sortAndPopulatePlayers(playersOld)
  const oldPlayersMap = new Map(
    rankedPlayersOld.map((p) => [p.connectCode.code, p]));
  
  const players = sortAndPopulatePlayers(playersNew);
  players.forEach((p) => {
    const oldData = oldPlayersMap.get(p.connectCode.code)
    if(oldData) {
      p.oldRankedNetplayProfile = oldData.rankedNetplayProfile
    }
  })

  injectData(players);

  // continuously update
  const updatedAt = dayjs(timestamp.updated);
  const [updateDesc, setUpdateDesc] = useState(updatedAt.fromNow())
  useEffect(() => {
    const interval = setInterval(
      () => setUpdateDesc(updatedAt.fromNow()), 1000*60);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center h-screen p-8">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img className="md:h-16 md:w-16 h-6 w-6" src={fizzi} />
        <h1 className="text-3xl m-4 text-center text-white">
          {settings.title}
        </h1>
      </div>

      <div className="p-1 text-gray-300"> Updated {updateDesc}</div>
      <Table players={players} />

      <div className="p-4 text-gray-300 flex flex-col">
        <div className="text-center">
          Maintained by&nbsp;
          <a href="https://www.twitter.com/caioicy" target="_blank" rel="noreferrer"
             className="text-gray-400 hover:text-indigo-700 mr-2 hover:underline">
            @caioicy
          </a>
        </div>

        <div>
          Built by blorppppp •&nbsp;
          <a href="https://www.buymeacoffee.com/blorppppp" target="_blank" rel="noreferrer"
             className="text-gray-400 hover:text-indigo-700 mr-2 hover:underline">
            Buy them a coffee
          </a>☕
        </div>
      </div>
    </div>
  );
}
