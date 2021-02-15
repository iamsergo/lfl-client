import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api"

import { GameInfo } from "../../types/GameInfo"

interface ModalState
{
  activeModal : string | null
  activeGame : GameInfo | null
  loading : boolean
  error : boolean
}

const initialState : ModalState = {
  activeModal : null,
  activeGame : null,
  loading : false,
  error : false,
}

export const requestEditScore = createAsyncThunk(
  'games/edit/request',
  (params: { tournamentId: string, score: string, userId: number, matchHref: string }) => api.editScore(params)
)

const modalSlice = createSlice({
  name : 'modal',
  initialState,
  reducers : {
    setActiveModal(state,action)
    {
      state.activeModal = action.payload
    },
    setActiveGame(state,action)
    {
      state.activeGame = action.payload
    },
  },
  extraReducers(builder)
  {
    builder
      .addCase(requestEditScore.pending, state => {
        state.loading = true
        state.error = false
      })
      .addCase(requestEditScore.rejected, state => {
        state.loading = false
        state.error = true
      })
      .addCase(requestEditScore.fulfilled, (state, action) => {
        state.loading = false
        state.error = false
        state.activeModal = null
      })
  },
})

export const {setActiveModal, setActiveGame} = modalSlice.actions
export default modalSlice.reducer