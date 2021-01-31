import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import api from "../../api"

import { ClubInfo } from "../../types/ClubInfo"
import { SquadInfo } from "../../types/SquadInfo"

interface TeamState
{
  loading : boolean
  error : boolean
  activeTeamSquad : SquadInfo[]
  activeTab : number
  
  activeTeam : ClubInfo | null
  teamHistory : ClubInfo[]
}

const initialState : TeamState = {
  loading : false,
  error : false,
  activeTeam : null,
  activeTeamSquad: [],
  teamHistory : [],
  activeTab : 0,
}

export const requestSquad = createAsyncThunk(
  'squad/request',
  ({ tournamentId,clubId }: { tournamentId: string, clubId: string}) => {
    return api.getSquads({tournamentId,clubId})
  }
)

const teamSlice = createSlice({
  name : 'team',
  initialState,
  reducers : {
    setActiveTeam(state,action)
    {
      state.activeTeam = action.payload
    },
    clearActiveteam(state)
    {
      state.activeTeam = null
      state.activeTeamSquad = []
    },
    goForwardToTeam(state)
    {
      state.teamHistory.push(state.activeTeam!)
    },
    goBackToTeam(state)
    {
      if(state.teamHistory.length === 0) return

      const activeTeam = state.teamHistory.pop()!
      state.activeTeam = activeTeam
    },
    setActiveTab(state,action)
    {
      state.activeTab = action.payload
    },
  },
  extraReducers(builder)
  {
    builder
      .addCase(requestSquad.pending, state => {
        state.loading = true
        state.error = false
      })
      .addCase(requestSquad.rejected, state => {
        state.loading = false
        state.error = true
      })
      .addCase(requestSquad.fulfilled, (state, action) => {
        state.loading = false
        state.error = false

        const activeTeamSquad = action.payload
        state.activeTeamSquad = activeTeamSquad
      })
  },
})

export const {
  clearActiveteam,
  setActiveTeam,
  setActiveTab,

  goForwardToTeam,
  goBackToTeam,
} = teamSlice.actions
export default teamSlice.reducer