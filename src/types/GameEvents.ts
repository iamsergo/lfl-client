interface PlayerInfo
{
  href : string
  name : string
}

export type GameEventType = 'goal' | 'assist' | 'yc' | '2yc' | 'rc'

export interface GameEvent extends PlayerInfo
{
  minute : number
  team : 0 | 1
  type : GameEventType
}

export interface GameEvents
{
  refery : string
  place : string
  date : number
  squads : PlayerInfo[][]
  events : GameEvent[]
}