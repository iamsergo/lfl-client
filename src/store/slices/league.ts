import { createSlice } from "@reduxjs/toolkit"

import {CityInfo} from '../../types/CityInfo'

interface leagueState
{
  activeLeague : CityInfo | null
}

const initialState : leagueState = {
  activeLeague : null
}

const leagueSlice = createSlice({
  name : 'league',
  initialState,
  reducers : {
    setActiveLeague(state,action)
    {
      state.activeLeague = action.payload
    },
  },
})

export const {setActiveLeague} = leagueSlice.actions
export default leagueSlice.reducer