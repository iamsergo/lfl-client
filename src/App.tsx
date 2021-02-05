import React from 'react';

import bridge from '@vkontakte/vk-bridge';
import {AdaptivityProvider, AppRoot, ConfigProvider, ScreenSpinner, View} from '@vkontakte/vkui';

import TournamentPanel from './panels/Tournament';
import TeamPanel from './panels/Team';
import GamePanel from './panels/Game';
import TournamentsPanel from './panels/Tournaments';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/rootReducer';
import { GAME_PANEL, TEAM_PANEL, TOURNAMENTS_PANEL, TOURNAMENT_PANEL } from './constans';
import { requestTournaments } from './store/slices/tournaments';
import { requestUser } from './store/slices/user';
import { goBack } from './store/slices/navigation';
import { clearActiveGame, goBackToGame } from './store/slices/game';
import { clearActiveteam, goBackToTeam } from './store/slices/team';
import { clearPredictionsInfo } from './store/slices/predictions';
import { clearActiveTournament, setActiveTab as setActiveTournamentTab } from './store/slices/tournament';
import { setActiveTab as setActiveTeamTab } from './store/slices/team';

const App = () => {
  const dispatch = useDispatch()
  const {activePanel, history} = useSelector((s:RootState) => s.navigation)
  const {loading : loadingTournaments, cities} = useSelector((s:RootState) => s.tournaments)
  const {loading : loadingTournament} = useSelector((s:RootState) => s.tournament)
  const {loading : loadingUser} = useSelector((s:RootState) => s.user)

  React.useEffect(() => {
    const initApp = async () => {
      const userInfo = await bridge.send('VKWebAppGetUserInfo')
      // const userInfo = {id : 17}
      dispatch(requestUser(userInfo.id))
      dispatch(requestTournaments())
      bridge.send('VKWebAppEnableSwipeBack').then(res=>res).catch(err=>err)
    }
    
    initApp()
  },[])

  const goToBack = () => {
    const currentPanel = history[history.length-1]
    const newPanel = history[history.length-2]
    
    if(currentPanel === 'team')
    {
      if(newPanel === 'game') dispatch(goBackToGame())

      dispatch(clearActiveteam())
    }
    else if(currentPanel === 'game')
    {
      if(newPanel === 'team') dispatch(goBackToTeam())

      dispatch(clearActiveGame())
      dispatch(clearPredictionsInfo())
    }
    
    if(newPanel === 'tournaments')
    {
      dispatch(setActiveTournamentTab(0))
      dispatch(clearActiveTournament())
    }
    else if(newPanel === 'tournament')
    {
      dispatch(setActiveTeamTab(0))
    }

    dispatch(goBack())
  }

  return (
    <ConfigProvider isWebView={true}>
      <AppRoot>
        <View
          activePanel={activePanel}
          onSwipeBack={goToBack}
          history={history}
          popout={(loadingTournaments || loadingUser || loadingTournament) && <ScreenSpinner />}
        >
          <TournamentsPanel id={TOURNAMENTS_PANEL} cities={cities}/>
          <TournamentPanel id={TOURNAMENT_PANEL}/>
          <GamePanel id={GAME_PANEL}/>
          <TeamPanel id={TEAM_PANEL}/>
        </View>
      </AppRoot>
    </ConfigProvider>
  );
}

export default App;
