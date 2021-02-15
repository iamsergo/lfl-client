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

export const editScore = async ({
  tournamentId,
  matchHref,
  score,
  userId
}: {
  tournamentId:string,
  score:string,
  userId:number,
  matchHref:string,
}) => {
  const mh = encodeURIComponent(matchHref)
  const s = encodeURIComponent(score)
  const url = `${BASE_URL}/games/edit?matchHref=${mh}&score=${s}&userId=${userId}&tournamentId=${tournamentId}`

  const res = await fetch(url,{
    method : 'POST',
    headers : {'Content-Type': 'application/json;charset=utf-8'}
  })

  return res.json()
}