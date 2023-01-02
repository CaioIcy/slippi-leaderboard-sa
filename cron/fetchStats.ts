import { getPlayerDataThrottled } from './slippi'
import * as syncFs from 'fs';
import * as path from 'path';
import util from 'util';
import * as settings from '../settings'

import { exec } from 'child_process';
const fs = syncFs.promises;
const execPromise = util.promisify(exec);

const getPlayerConnectCodes = async (): Promise<string[]> => {
  return [
    'DRMARI#0',
    'CALU#204',
    'SKYY#519',
    'LAJ#525',
    'CLWN#583',
    'MASK#169',
    'E#9',
    'VINS#130',
    'BOB#520',
    'TXR#205',
    'MCS#356',
    'TOXC#638',
    'NIVA#511',
    'MAZU#655',
    'CODY#690',
    'NEKO#690',
    'HEND#168',
    'RAIK#405',
    'ROCK#422',
    'AISE#145',
    'LPDE#396',
    'ADTT#185',
    'PPRS#512',
    'LAIN#465',
    'JUDI#499',
    'BRAT#840',
    'LUDE#803',
    'PHON#387',
    'TOBA#232',
    'IZZI#399',
    'GOVE#420',
    'SHOJAM#0',
    'HIGH#103',
    'GEN#134',
    'PNDA#140',
    'VECC#942',
    'MIRO#588',
    'OLDN#984',
    'MIGU#608',
    'BSDA#510',
    'ALOR#511',
    'WARI#512',
    'MURO#881',
    'RACK#607',
    'SENK#1',
    'DON#305',
    'MICI#573',
    'IGUANA#0',
    'CAIO#966',
    'LESO#826',
    'WORI#459',
    'DAZA#887',
    'WAST#766',
    'NYCK#444',
    'COCK#563',
    'BLUE#824',
    'MAVE#409',
    'DOUM#303',
    'CPTS#832',
    'NOHACK#0',
    'FAUX#488',
    'LIXO#815',
    'ELYI#462',
    'AMID#505',
    'DITT#404',
    'LUCA#807',
    'UNKN#438',
    'JOXA#420',
    'NRKX#873',
    'CEFE#488',
    'RULO#553',
    'JUAN#576',
    'MITS#384',
    'GODU#315',
    'NDJ#132',
    'HOMER#0',
    'EXCEL#0',
    'ACAB#640',
    'PAI#235',
    'RAND#649',
    'GENE#475',
    'TOSC#669',
    'COCK#940',
    'GNZ#143',
    'HUNK#582',
    'MKUN#863',
    'KUSA#164',
    'TKR#747',
    'YEAH#507',
    'TEWA#266',
    'CCJ#802',
    'WOLF#646',
    'KLAO#360',
    'VITO#638',
    'QUAK#657',
    'ASHE#748',
    'LX#386',
    'TPOZ#69',
    'LOL#807',
    'POMF#250',
    'KATA#702',
    'CHPA#675',
    'DEZA#140',
    'NAKA#164',
    'ZAG#814',
    'MANV#337',
    'JENS#613',
    'AKNO#691',
    'NAGI#688',
    'REKT#716',
    'SAL#360',
    'GUAS#734',
    'WOOP#700',
    'LINCHO#9',
    'NEOM#753'
  ] as string[]
};

const getPlayers = async () => {
  const codes = await getPlayerConnectCodes()
  console.log(`Found ${codes.length} player codes`)
  const allData = codes.map((code, i) => {
    // console.log(`${i+1}/${codes.length}...`);
    return getPlayerDataThrottled(code);
  });
  const results = await Promise.all(allData.map(p => p.catch(e => e)));
  const validResults = results.filter(result => !(result instanceof Error));
  const invalidResults = results.filter(result => (result instanceof Error));
  if(invalidResults.length) {
    console.log(invalidResults);
  }
  const unsortedPlayers = validResults
    .filter((data: any) => data?.data?.getConnectCode?.user)
    .map((data: any) => data.data.getConnectCode.user);
  return unsortedPlayers.sort((p1, p2) =>
    p2.rankedNetplayProfile.ratingOrdinal - p1.rankedNetplayProfile.ratingOrdinal)
}

async function main() {
  console.log('Starting player fetch.');
  const players = await getPlayers();
  if(!players.length) {
    console.log('Error fetching player data. Terminating.')
    return
  }
  console.log('Player fetch complete.');
  // rename original to players-old
  const newFile = path.join(__dirname, 'data/players-new.json')
  const oldFile = path.join(__dirname, 'data/players-old.json')
  const timestamp = path.join(__dirname, 'data/timestamp.json')

  await fs.rename(newFile, oldFile)
  console.log('Renamed existing data file.');
  await fs.writeFile(newFile, JSON.stringify(players));
  await fs.writeFile(timestamp, JSON.stringify({updated: Date.now()}));
  console.log('Wrote new data file and timestamp.');

  return;

  const rootDir = path.normalize(path.join(__dirname, '..'))
  console.log(rootDir)
  // if no current git changes
  const { stdout, stderr } = await execPromise(`git -C ${rootDir} status --porcelain`);
  if(stdout || stderr) {
    console.log('Pending git changes... aborting deploy');
    return
  }
  console.log('Deploying.');
  const { stdout: stdout2, stderr: stderr2 } = await execPromise(`npm run --prefix ${rootDir} deploy`);
  console.log(stdout2);
  if(stderr2) {
    console.error(stderr2);
  }
  console.log('Deploy complete.');
}

main();
