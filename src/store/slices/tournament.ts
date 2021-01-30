import { createSlice } from "@reduxjs/toolkit";

import { TournamentInfo } from "../../types/TournamentInfo";

interface TournamentState
{
  activeTournamentName : string
  activeTournament : TournamentInfo | null
}

const initialState : TournamentState = {
  activeTournamentName : '',
  activeTournament : null,
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
  },
})

export const {
  clearActiveTournament,
  setActiveTournament
} = tournamentSlice.actions
export default tournamentSlice.reducer