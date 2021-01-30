import { combineReducers } from "@reduxjs/toolkit"

import navigation from './slices/navigation'
import tournaments from './slices/tournaments'
import tournament from './slices/tournament'
import team from './slices/team'
import game from './slices/game'

const rootReducer = combineReducers({
  navigation,
  tournaments,
  tournament,
  team,
  game,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer