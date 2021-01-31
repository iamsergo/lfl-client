import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import api from "../../api"

import { PredictionInfo } from "../../types/PredictionInfo"

interface PredictionsState
{
  loading : boolean
  error : boolean
  predictionsInfo : PredictionInfo | null
}

const initialState : PredictionsState = {
  loading : false,
  error : false,
  predictionsInfo : null
}

export const requestPredictions = createAsyncThunk(
  'predictions/get',
  (matchId : number) => api.getPredictionsByMatch(matchId)
)

export const requestDoPrediction = createAsyncThunk(
  'predictions/do',
  ({ matchId, userId, prediction }: { matchId: number, userId: number, prediction : 0 | 1 }) => {
    return api.doPrediction({ matchId, userId, prediction })
  }
)

const predictionsSlice = createSlice({
  name : 'predictions',
  initialState,
  reducers : {
    clearPredictionsInfo(state)
    {
      state.predictionsInfo = null
    },
  },
  extraReducers(builder)
  {
    builder
      .addCase(requestPredictions.pending, state => {
        state.loading = true
        state.error = false
      })
      .addCase(requestPredictions.rejected, state => {
        state.loading = false
        state.error = true
      })
      .addCase(requestPredictions.fulfilled, (state, action) => {
        state.loading = false
        state.error = false
        state.predictionsInfo = action.payload
      })

      .addCase(requestDoPrediction.pending, state => {
        state.loading = true
        state.error = false
      })
      .addCase(requestDoPrediction.rejected, state => {
        state.loading = false
        state.error = true
      })
      .addCase(requestDoPrediction.fulfilled, (state, action) => {
        state.loading = false
        state.error = false
      })
  },
})

export const {clearPredictionsInfo} = predictionsSlice.actions
export default predictionsSlice.reducer