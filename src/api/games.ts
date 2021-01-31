import { BASE_URL } from "./BASE_URL"
import { request } from "./request"

export const getGames = async (gameId : number) => {
  const url = `${BASE_URL}/games/${gameId}`

  return await request(url)
}