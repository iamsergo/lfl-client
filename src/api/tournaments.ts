import { BASE_URL } from "./BASE_URL"
import { request } from "./request"

export const getTournaments = async () => {
  const url = `${BASE_URL}/tournaments`

  return await request(url)
}