import React from 'react';

import bridge from '@vkontakte/vk-bridge';
import {AppRoot, ConfigProvider, ScreenSpinner, View} from '@vkontakte/vkui';

import TournamentPanel from './panels/Tournament';
import TeamPanel from './panels/Team';
import GamePanel from './panels/Game';
import TournamentsPanel from './panels/Tournaments';
import { useSelector } from 'react-redux';
import { RootState } from './store/rootReducer';
import { ADD_WIDGET_PANEL, EDIT_GAME_MODAL, GAME_PANEL, LEAGUE_PANEL, TEAM_PANEL, TOURNAMENTS_PANEL, TOURNAMENT_PANEL } from './constans';
import { requestTournaments } from './store/slices/tournaments';
import { requestUser } from './store/slices/user';
import { goBack } from './store/slices/navigation';
import { clearActiveGame, goBackToGame } from './store/slices/game';
import { clearActiveteam, goBackToTeam } from './store/slices/team';
import { clearPredictionsInfo } from './store/slices/predictions';
import { setNavigation } from './store/slices/navigation';
import { clearActiveTournament, setActiveTab as setActiveTournamentTab } from './store/slices/tournament';
import { setActiveTab as setActiveTeamTab } from './store/slices/team';
import LeaguePanel from './panels/League';
import { useAppDispatch } from './store/store';
import { setActiveLeague } from './store/slices/league';
import { CityInfo } from './types/CityInfo';
import AddWidgetPanel from './panels/AddWidget';
import GameEditModal from './modal/GameEdit';

const App = () => {
  const dispatch = useAppDispatch()
  const {activePanel, history} = useSelector((s:RootState) => s.navigation)
  const {loading : loadingTournaments, cities} = useSelector((s:RootState) => s.tournaments)
  const {loading : loadingTournament} = useSelector((s:RootState) => s.tournament)
  const {loading : loadingUser} = useSelector((s:RootState) => s.user)
  const {activeModal} = useSelector((s:RootState) => s.modal)

  React.useEffect(() => {
    const initPanels = async (cities : CityInfo[]) => {
      try
      {
        const hash = window.location.hash
        const {keys} = await bridge.send('VKWebAppStorageGet',{keys:['favorite']})
        const favorite = keys.find(entrie => entrie.key === 'favorite')

        if(hash)
        {
          const id = +hash.slice(1).replace('league','')
          dispatch(setActiveLeague(cities.find(c => c.id === id)))
          dispatch(setNavigation({activePanel:LEAGUE_PANEL,history:[TOURNAMENTS_PANEL,LEAGUE_PANEL]}))
        }
        else if(favorite && favorite.value !== '')
        {
          const id = +favorite.value.replace('league','')
          dispatch(setActiveLeague(cities.find(c => c.id === id)))
          dispatch(setNavigation({activePanel:LEAGUE_PANEL,history:[TOURNAMENTS_PANEL,LEAGUE_PANEL]}))
        }
      }
      catch(err){}
    }

    const initApp = async () => {
      const userInfo = await bridge.send('VKWebAppGetUserInfo')
      // const userInfo = {id : 17}
      dispatch(requestUser(userInfo.id))
      dispatch(requestTournaments())
        .then((action) => initPanels(action.payload))
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
    
    if(newPanel === 'league')
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
          modal={activeModal && <GameEditModal />}
        >
          <TournamentsPanel id={TOURNAMENTS_PANEL} cities={cities}/>
          <LeaguePanel id={LEAGUE_PANEL} />
          <TournamentPanel id={TOURNAMENT_PANEL}/>
          <GamePanel id={GAME_PANEL}/>
          <TeamPanel id={TEAM_PANEL}/>
          <AddWidgetPanel id={ADD_WIDGET_PANEL} />
        </View>
      </AppRoot>
    </ConfigProvider>
  );
}

export default App;
