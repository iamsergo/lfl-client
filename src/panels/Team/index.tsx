import React from 'react';


import {
  HorizontalScroll,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Tabs,
  TabsItem
} from '@vkontakte/vkui';

import { useDispatch, useSelector } from 'react-redux';
import { goBack, goForward } from '../../store/slices/navigation';
import { RootState } from '../../store/rootReducer';
import { clearActiveteam, goForwardToTeam,setActiveTab } from '../../store/slices/team';
import { goBackToGame, setActiveGameInfo } from '../../store/slices/game';

import PlainHeader from '../../components/Headers/PlainHeader';
import GamesList from '../../components/GamesList';

import { GameInfo } from '../../types/GameInfo';

import { GAME_PANEL } from '../../constans';

interface TeamPanelProps
{
  id : string
}

// const TABS = [ 'Расписание', 'Результаты', 'Состав' ]
const TABS = [ 'Расписание', 'Результаты']

const TeamPanel : React.FC<TeamPanelProps> = ({
  id,
}) => {
  const dispatch = useDispatch()
  const { activeTeam, activeTab } = useSelector((s:RootState) => s.team)
  const {history} = useSelector((s:RootState) => s.navigation)
  const {activeTournament,activeTournamentCity} = useSelector((s:RootState) => s.tournament)

  const goToBack = () => {
    const isToGame = history[history.length-2] === 'game'
    if(isToGame) dispatch(goBackToGame())

    dispatch(goBack())
    dispatch(clearActiveteam())
  }

  const goToGame = (game : GameInfo) => {
    if(game.date === '-' && !game.score) return

    dispatch(goForwardToTeam())
    dispatch(setActiveGameInfo(game))
    dispatch(goForward(GAME_PANEL))
  }

  return(
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={goToBack} />}
      >Команда</PanelHeader>

      {activeTeam && <>
        <PlainHeader
          logo={activeTeam.logo}
          title={activeTeam.name}
          city={activeTournamentCity}
        />
        <HorizontalScroll>
          <Tabs mode="buttons">
            {TABS.map((tab,i) => {
              return <TabsItem
                key={i}
                selected={activeTab === i}
                onClick={() => dispatch(setActiveTab(i))}
              >{tab}</TabsItem>
            })}
          </Tabs>
        </HorizontalScroll>
      </>}

      
      {activeTab === 0 && activeTeam &&
        <GamesList
          games={activeTournament!.calendar.filter(g => g.homeHref === activeTeam.href || g.awayHref === activeTeam.href )}
          // onGoToGame={goToGame}
        />
      }

      {activeTab === 1 && activeTeam &&
        <GamesList
          teamHref={activeTeam.href}
          games={activeTournament!.results.filter(g => g.homeHref === activeTeam.href || g.awayHref === activeTeam.href )}
          onGoToGame={goToGame}
        />
      }

      {/* {activeTab === 2 && activeTeam &&
        <Group>
          <TableRow
            isHeader={true}
            title={'Игрок'}
            values={['И', 'Г','А','Ж','К']}
            colors={['','green','gray','orange','red']}
          />
          {
            loading
              ? <Div><Spinner/></Div>
              : activeTeamSquad.map((player,i) => {
                return <TableRow
                  key={i}
                  title={player.playerName}
                  photo={player.playerPhoto}
                  description={player.amplua}
                  values={[player.games,player.goals,player.assists,player.yc,player.rc].map(n=>''+n)}
                  colors={['','green','gray','orange','red']}
                  isDark={i % 2 === 0}
                />
              })
          }
        </Group>
      } */}
    </Panel>
  )
}

export default TeamPanel