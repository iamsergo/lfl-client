import { BASE_URL } from "./BASE_URL"
import { request } from "./request"

export const getPredictionsByMatch = async (matchId : number) => {
  const url = `${BASE_URL}/predictions/${matchId}`

  return await request(url)
}

export const doPrediction = async ({
  matchId, 
  userId,
  prediction
} : {
  matchId:number,
  userId:number,
  prediction : 0 | 1
}) => {
  const url = `${BASE_URL}/predictions`

  const res = await fetch(url,{
    method : 'POST',
    body : JSON.stringify({matchId, userId, prediction}),
    headers : {'Content-Type': 'application/json;charset=utf-8'}
  })

  return res.json()
}