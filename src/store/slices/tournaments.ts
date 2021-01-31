import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import api from "../../api"

import { CityInfo } from "../../types/CityInfo"

interface TournamentsState
{
  loading : boolean
  error : boolean
  cities : (CityInfo & {collapsed : boolean})[]
}

const initialState : TournamentsState = {
  loading : false,
  error : false,
  cities : []
}

export const requestTournaments = createAsyncThunk('tournaments/request', api.getTournaments)

const tournamentsSlice = createSlice({
  name : 'tournaments',
  initialState,
  reducers : {
    toggleCollapse(state,action)
    {
      state.cities = state.cities.map((c,i) => {
        if(i === action.payload)
        {
          return {...c, collapsed : !c.collapsed}
        }

        return c
      })
    },
  },
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
        state.cities = (action.payload as CityInfo[]).map(city => ({...city, collapsed : true}))
      })
  },
})

export const {toggleCollapse} = tournamentsSlice.actions
export default tournamentsSlice.reducer