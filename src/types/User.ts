import { Prediction } from "./Prediction";

export interface User
{
  id : number
  
  win : number
  lose : number
  predictions : Prediction[]
}