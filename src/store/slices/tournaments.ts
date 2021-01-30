import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import api from "../../api"

import { Tournament } from "../../types/Tournament"

interface TournamentsState
{
  loading : boolean
  error : boolean
  tournaments : Tournament[]
}

const initialState : TournamentsState = {
  loading : false,
  error : false,
  tournaments : []
}

export const requestTournaments = createAsyncThunk('tournaments/request', api.getTournaments)

const tournamentsSlice = createSlice({
  name : 'tournaments',
  initialState,
  reducers : {},
  extraReducers(builder)
  {
    builder
      .addCase(requestTournaments.pending, state => {
        state.loading = true
        state.error = false
      })
      .addCase(requestTournaments.rejected, state => {
        state.loading = false
        state.error = true
      })
      .addCase(requestTournaments.fulfilled, (state, action) => {
        state.loading = false
        state.error = false
        state.tournaments = action.payload
      })
  },
})

export default tournamentsSlice.reducer