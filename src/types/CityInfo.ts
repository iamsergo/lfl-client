import { Tournament } from "./Tournament";

export interface CityInfo
{
  id : number
  title : string
  tournaments : Tournament[]
  vkHref : string
}