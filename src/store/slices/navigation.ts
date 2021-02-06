import { createSlice } from "@reduxjs/toolkit";

import { 
  GAME_PANEL, 
  LEAGUE_PANEL, 
  TEAM_PANEL, 
  TOURNAMENTS_PANEL, 
  TOURNAMENT_PANEL 
} from "../../constans";

type Panel = 
  | typeof TOURNAMENTS_PANEL 
  | typeof TOURNAMENT_PANEL 
  | typeof GAME_PANEL 
  | typeof TEAM_PANEL
  | typeof LEAGUE_PANEL

interface NavigationState
{
  activePanel : Panel
  history : Panel[]
}

const initialState : NavigationState = {
  activePanel : TOURNAMENTS_PANEL,
  history : [TOURNAMENTS_PANEL]
}

const navigationSlice = createSlice({
  name : 'navigation',
  initialState,
  reducers : {
    setNavigation(state, action)
    {
      const data = action.payload
      state.activePanel = data.activePanel
      state.history = data.history
    },
    goForward(state, action)
    {
      const newPanel = action.payload
      state.activePanel = newPanel
      state.history.push(newPanel)
    },
    goBack(state)
    {
      state.history.pop()
      const newPanel = state.history[state.history.length - 1]
      state.activePanel = newPanel!
    },
  }
})

export const {goBack, goForward, setNavigation} = navigationSlice.actions
export default navigationSlice.reducer