import { BASE_URL } from "./BASE_URL"
import { request } from "./request"

export const getGames = async ({
  matchId,
  postfix,
  siteType
}: {
  matchId?:string,
  postfix:string,
  siteType:number
}) => {
  const p = encodeURIComponent(postfix)
  const url = `${BASE_URL}/games?siteType=${siteType}&postfix=${p}&matchId=${matchId}`

  return await request(url)
}