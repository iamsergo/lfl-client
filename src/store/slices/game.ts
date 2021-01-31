import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api"
import { GameEvents } from "../../types/GameEvents"
import { GameInfo } from "../../types/GameInfo"



interface GameHistoryRecord
{
  activeGameInfo : GameInfo
  activeGameEvents : GameEvents | null  
}

interface GameState
{
  loading : boolean
  error : boolean
  activeGameInfo : GameInfo
  activeGameEvents : GameEvents | null
  gameHistory : GameHistoryRecord[]
}

const initialState : GameState = {
  loading : false,
  error : false,
  activeGameEvents : null,
  activeGameInfo : {
    awayHref: "",
    awayLogo: "",
    awayName: "",
    date: "-",
    homeHref: "",
    homeLogo: "",
    homeName: "",
    matchHref: "",
    place: "-",
    score: "-:-",
    time: "-",
    tour: 1,
  },
  gameHistory : [],
}

export const requestGame = createAsyncThunk(
  'game/request',
  (gameId : number) => api.getGames(gameId)
)

const gameSlice = createSlice({
  name : 'game',
  initialState,
  reducers : {
    setActiveGameInfo(state,action)
    {
      state.activeGameInfo = action.payload
    },
    clearActiveGame(state)
    {
      state.activeGameInfo = initialState.activeGameInfo
      state.activeGameEvents = null
    },
    goForwardToGame(state)
    {
      state.gameHistory.push({
        activeGameEvents : state.activeGameEvents,
        activeGameInfo : state.activeGameInfo,
      })
    },
    goBackToGame(state)
    {
      if(state.gameHistory.length === 0) return
      
      const activeGame = state.gameHistory.pop()!

      state.activeGameEvents = activeGame.activeGameEvents
      state.activeGameInfo = activeGame.activeGameInfo
    },
  },
  extraReducers(builder)
  {
    builder
      .addCase(requestGame.pending, state => {
        state.loading = true
        state.error = false
      })
      .addCase(requestGame.rejected, state => {
        state.loading = false
        state.error = true
      })
      .addCase(requestGame.fulfilled, (state, action) => {
        state.loading = false
        state.error = false

        const activeGameEvents = action.payload
        state.activeGameEvents = activeGameEvents
        state.activeGameEvents!.events.sort((a,b) => a.minute - b.minute)
      })
  },
})

export const {
  setActiveGameInfo,
  goBackToGame,
  goForwardToGame,
  clearActiveGame,
} = gameSlice.actions
export default gameSlice.reducer