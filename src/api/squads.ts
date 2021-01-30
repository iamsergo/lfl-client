import { BASE_URL } from "./BASE_URL"
import { request } from "./request"

export const getSquads = async ({tournamentId, clubId} : {tournamentId:string,clubId:string}) => {
  const url = `${BASE_URL}/squads/${tournamentId}/${clubId}`

  return await request(url)
}