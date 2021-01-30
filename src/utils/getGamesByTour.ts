import { GameInfo } from "../types/GameInfo";

export const getGamesByTours =  (calendar : GameInfo[]) : {[tour : string] : GameInfo[]} => {
  const data : {[tour : string] : GameInfo[]} = {}

  calendar.forEach(game => {
    if(!data[game.tour])
    {
      data[game.tour] = []
    }

    data[game.tour].push(game)
  })

  return data
}