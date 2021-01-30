import { GameInfo } from "../types/GameInfo";

export const getGamesByClub = (games : GameInfo[], clubId : string) : GameInfo[] => {
  return games.filter(game => game.homeHref === clubId || game.awayHref === clubId)
}