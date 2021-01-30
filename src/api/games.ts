import { BASE_URL } from "./BASE_URL"
import { request } from "./request"

export const getGames = async ({tournamentId, tourId, gameId} : {tournamentId:string,tourId:string,gameId:string}) => {
  const url = `${BASE_URL}/games/${tournamentId}/${tourId}/${gameId}`

  return await request(url)
}