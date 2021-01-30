import React from 'react';

import {AdaptivityProvider, AppRoot, ConfigProvider, ScreenSpinner, View} from '@vkontakte/vkui';

import TournamentPanel from './panels/Tournament';
import TeamPanel from './panels/Team';
import GamePanel from './panels/Game';
import TournamentsPanel from './panels/Tournaments';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/rootReducer';
import { GAME_PANEL, TEAM_PANEL, TOURNAMENTS_PANEL, TOURNAMENT_PANEL } from './constans';
import { requestTournaments } from './store/slices/tournaments';

const App = () => {
  const dispatch = useDispatch()
  const {activePanel, history} = useSelector((s:RootState) => s.navigation)
  const {loading : loadingTournaments, error : errorTournaments, tournaments} = useSelector((s:RootState) => s.tournaments)

  React.useEffect(() => {
    dispatch(requestTournaments())
  },[])

  return (
    <ConfigProvider isWebView={true}>
      <AppRoot>
        <View
          activePanel={activePanel}
          history={history}
          popout={loadingTournaments && <ScreenSpinner />}
        >
          <TournamentsPanel id={TOURNAMENTS_PANEL} tournaments={tournaments}/>
          <TournamentPanel id={TOURNAMENT_PANEL}/>
          <GamePanel id={GAME_PANEL}/>
          <TeamPanel id={TEAM_PANEL}/>
        </View>
      </AppRoot>
    </ConfigProvider>
  );
}

export default App;
