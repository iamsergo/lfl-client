import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

import { TournamentInfo } from "../../types/TournamentInfo";

interface TournamentState
{
  activeTournamentName : string
  activeTournamentCity : string
  activeSiteType : number
  activeVkHref : string
  activeTournament : TournamentInfo | null
  activeTab : number
  activeDivisionId ?: number

  loading : boolean
  error : boolean
}

const initialState : TournamentState = {
  loading : false,
  error : false,

  activeTournamentName : '',
  activeTournamentCity : '',
  activeSiteType : 0,
  activeVkHref : '',
  activeTournament : null,
  activeTab : 0
}

export const requestTournament = createAsyncThunk('tournament/request', api.getTournament)

const tournamentSlice = createSlice({
  name : 'tournament',
  initialState,
  reducers : {
    setActiveTournament(state,action)
    {
      const activeTournament = action.payload
      state.activeTournamentName = activeTournament.name
      // state.activeTournament = activeTournament.data
      state.activeSiteType = activeTournament.siteType
      state.activeVkHref = activeTournament.vkHref
      state.activeTournamentCity = activeTournament.city
      state.activeDivisionId = activeTournament.divisionId
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
  extraReducers(builder)
  {
    builder
      .addCase(requestTournament.pending, state => {
        state.loading = true
        state.error = false
      })
      .addCase(requestTournament.rejected, state => {
        state.loading = false
        state.error = true
      })
      .addCase(requestTournament.fulfilled, (state, action) => {
        state.loading = false
        state.error = false

        const activeTournament = action.payload
        state.activeTournament = activeTournament
      })
  },
})

export const {
  clearActiveTournament,
  setActiveTournament,
  setActiveTab,
} = tournamentSlice.actions
export default tournamentSlice.reducer