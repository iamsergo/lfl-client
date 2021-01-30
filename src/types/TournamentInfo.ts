import { ClubInfo } from "./ClubInfo";
import { GameInfo } from "./GameInfo";
import { StrikerInfo } from "./StrikerInfo";

export interface TournamentInfo
{
  tournamentId : string
  table : ClubInfo[]
  calendar : GameInfo[]
  results : GameInfo[]
  strikers : StrikerInfo[]
  assistents : StrikerInfo[]
}