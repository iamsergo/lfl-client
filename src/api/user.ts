import { BASE_URL } from "./BASE_URL"
import { request } from "./request"

export const getUser = async (id : number) => {
  const url = `${BASE_URL}/users/${id}`

  return await request(url)
}

export const registerUser = async (id : number) => {
  const url = `${BASE_URL}/users/${id}`

  const res = await fetch(url,{
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  })

  return await res.json()
}