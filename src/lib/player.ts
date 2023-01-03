type LeaderboardSubregion = 'cl' | 'br' ;

export interface CharacterStats {
  character: string;
  gameCount: number;
}

export interface RankedNetplayProfile {
  rank?: number; // populated separately
  ratingOrdinal: number;
  ratingUpdateCount: number;
  wins: number;
  losses: number;
  dailyGlobalPlacement: number | null;
  dailyRegionalPlacement: number | null;
  characters: CharacterStats[];
  continent: string;
}

export interface ExtraPlayerData {
  subregion?: LeaderboardSubregion;
  countryCode?: string;
  tag?: string;
  ssbmRank?: number;
}

export interface Player {
  displayName: string;
  connectCode: {
    code: string;
  };
  rankedNetplayProfile: RankedNetplayProfile
  oldRankedNetplayProfile?: RankedNetplayProfile // populated separately
  extraData?: ExtraPlayerData; // populated separately
}
