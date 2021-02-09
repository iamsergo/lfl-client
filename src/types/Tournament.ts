import { TournamentInfo } from "./TournamentInfo";

export interface Tournament
{
  id : string
  name : string
  logo : string
  city : string
  siteType : number
  divisionId ?: number
  // data : TournamentInfo
}