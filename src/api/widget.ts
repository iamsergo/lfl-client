import { BASE_URL } from "./BASE_URL"

export const addWidget = async ({
  user_id,
  group_id,
  app_id,
  access_token,
  v,
  site_type,
  tournament_id,
  league_id,
} : {
  user_id : number,
  group_id: number,
  app_id: number,
  access_token: string,
  v: string,
  site_type: number,
  tournament_id : number,
  league_id : number,
}) => {
  const url = `${BASE_URL}/widgets`
  const res = await fetch(url,{
    method : 'PUT',
    body: JSON.stringify({user_id,group_id,app_id,access_token,v,site_type,tournament_id,league_id}),
    headers : {'Content-Type': 'application/json;charset=utf-8'}
  })

  return await res.json()
}