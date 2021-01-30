import React from 'react';

import {
  Group, 
  HorizontalScroll, 
  List, 
  Panel, 
  PanelHeader, 
  PanelHeaderBack, 
  Tabs, 
  TabsItem
} from '@vkontakte/vkui';

import { useDispatch, useSelector } from 'react-redux';
import { goBack, goForward } from '../../store/slices/navigation';
import { RootState } from '../../store/rootReducer';
import { clearActiveTournament } from '../../store/slices/tournament';
import { requestSquad, setActiveTeam} from '../../store/slices/team';
import { setActiveGameInfo } from '../../store/slices/game';

import PlainHeader from '../../components/Headers/PlainHeader';
import GamesList from '../../components/GamesList';
import TableRow from '../../components/Table/TableRow';

import { GameInfo } from '../../types/GameInfo';
import { ClubInfo } from '../../types/ClubInfo';

import { getGamesByTours } from '../../utils/getGamesByTour';
import { GAME_PANEL, TEAM_PANEL } from '../../constans';

interface TournamentPanelProps
{
  id : string
}

const TABS = [ 'Таблица', 'Расписание', 'Результаты', 'Бомбардиры', 'Ассистенты' ]

const TournamentPanel : React.FC<TournamentPanelProps> = ({
  id,
}) => {
  const dispatch = useDispatch()
  const {activeTournament,activeTournamentName} = useSelector((s:RootState) => s.tournament)
  
  const [activeTab, setActiveTab] = React.useState(0)

  const goToTeam = (team : ClubInfo) => {
    const tournamentId = activeTournament!.tournamentId
    const clubId = team.href.replace('/club','')

    dispatch(setActiveTeam(team))
    dispatch(goForward(TEAM_PANEL))

    dispatch(requestSquad({tournamentId, clubId}))
  }

  const goToGame = (game : GameInfo) => {
    dispatch(setActiveGameInfo(game))
    dispatch(goForward(GAME_PANEL))
  }

  const goToTournaments = () => {
    dispatch(goBack())
    dispatch(clearActiveTournament())
  }

  return(
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={goToTournaments} />}
      >Турнир</PanelHeader>
      
      <PlainHeader
        title={activeTournamentName}
      >
        <HorizontalScroll>
          <Tabs mode="buttons">
            {TABS.map((tab,i) => {
              return <TabsItem
                key={i}
                selected={activeTab === i}
                onClick={() => setActiveTab(i)}
              >{tab}</TabsItem>
            })}
          </Tabs>
        </HorizontalScroll>
      </PlainHeader>

      {activeTournament &&
        <Group style={{marginTop:112}}>
          {activeTab === 0 &&
            <List>
              <TableRow
                isHeader={true}
                title={'Команда'}
                values={['И','В','Н','П','О']}
                colors={['','green','orange','red']}
              />
              {
                activeTournament.table.map((team,i) => {
                  return <TableRow
                    key={i}
                    n={i+1}
                    title={team.name}
                    photo={team.logo}
                    onClick={() => goToTeam(team)}
                    values={[team.win+team.draw+team.lose,team.win,team.draw,team.lose,team.points].map(n=>''+n)}
                    colors={['','green','orange','red']}
                    isDark={i % 2 === 0}
                  />
                })
              }
            </List>
          }

          {activeTab === 1 &&
            Object.entries(getGamesByTours(activeTournament.calendar))
              .map(([tour, games],i) => {
                return <GamesList
                  key={i}
                  header={`${tour} ТУР`}
                  games={games}
                />
              })
          }

          {activeTab === 2 &&
            Object.entries(getGamesByTours(activeTournament.results)).reverse()
              .map(([tour, games],i) => {
                return <GamesList
                  key={i}
                  header={`${tour} ТУР`}
                  games={games}
                  onGoToGame={goToGame}
                />
              })
          }

          {activeTab === 3 &&
            <List>
              <TableRow
                  isHeader={true}
                  title={'Игрок'}
                  values={['Г']}
                  colors={[]}
                />
              {
                activeTournament.strikers.map((player,i) => {
                  return <TableRow
                    key={i}
                    n={i+1}
                    title={player.playerName}
                    photo={player.playerPhoto}
                    description={player.teamName}
                    values={[''+player.points]}
                    colors={[]}
                    isDark={i % 2 === 0}
                  />
                })
              }
            </List>
          }

          {activeTab === 4 &&
            <List>
              <TableRow
                  isHeader={true}
                  title={'Игрок'}
                  values={['А']}
                  colors={[]}
                />
              {
                activeTournament.assistents.map((player,i) => {
                  return <TableRow
                    key={i}
                    n={i+1}
                    title={player.playerName}
                    photo={player.playerPhoto}
                    description={player.teamName}
                    values={[''+player.points]}
                    colors={[]}
                    isDark={i % 2 === 0}
                  />
                })
              }
            </List>
          }
        </Group>
      }


    </Panel>
  )
}

export default TournamentPanel