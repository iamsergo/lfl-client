import { createSlice } from "@reduxjs/toolkit";

import { TournamentInfo } from "../../types/TournamentInfo";

interface TournamentState
{
  activeTournamentName : string
  activeTournament : TournamentInfo | null
  activeTab : number
}

const initialState : TournamentState = {
  activeTournamentName : '',
  activeTournament : null,
  activeTab : 0
}

const tournamentSlice = createSlice({
  name : 'tournament',
  initialState,
  reducers : {
    setActiveTournament(state,action)
    {
      const activeTournament = action.payload
      state.activeTournamentName = activeTournament.name
      state.activeTournament = activeTournament.data
    },
    clearActiveTournament(state)
    {
      state.activeTournament = null
      state.activeTournamentName = ''
    },
    setActiveTab(state,action)
    {
      state.activeTab = action.payload
    },
  },
})

export const {
  clearActiveTournament,
  setActiveTournament,
  setActiveTab,
} = tournamentSlice.actions
export default tournamentSlice.reducer