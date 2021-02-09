import React from 'react';

import {
  Cell,
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
import { clearActiveTournament, setActiveTab } from '../../store/slices/tournament';
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

const TABS = [ 'Таблица', 'Расписание', 'Результаты']

const TournamentPanel : React.FC<TournamentPanelProps> = ({
  id,
}) => {
  const dispatch = useDispatch()
  const {activeTournament,activeTournamentName,activeTournamentCity,activeTab,activeSiteType,activeVkHref} = useSelector((s:RootState) => s.tournament)

  const goToTeam = (team : ClubInfo) => {
    dispatch(setActiveTeam(team))
    dispatch(goForward(TEAM_PANEL))
  }

  const goToGame = (game : GameInfo) => {
    console.log(game)
    if(game.date === '-' && !game.score) return
    
    dispatch(setActiveGameInfo(game))
    dispatch(goForward(GAME_PANEL))
  }

  const goToTournaments = () => {
    dispatch(goBack())
    dispatch(clearActiveTournament())
    dispatch(setActiveTab(0))
  }

  return(
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={goToTournaments} />}
      >Турнир</PanelHeader>
      
      <PlainHeader
        hrefText={'Сайт'}
        href={activeSiteType === 0
            ? `https://lfl.ru/tournament${activeTournament?.tournamentId}`
            : `https://www.goalstream.org/season/${activeTournament?.tournamentId}`
        }
        title={activeTournamentName}
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

      
      {activeTab === 0 && activeTournament &&
        <List>
          <TableRow
            isHeader={true}
            title={'Команда'}
            values={['И','В','Н','П','О']}
            colors={['','green','orange','red']}
          />
          {
            activeTournament.table.map((team,i) => {
              if(team.title === '') return

              return team.title
                ? <Cell
                    key={i}
                    disabled
                    style={{fontWeight:'bold'}}
                  >{team.title}</Cell>
                : <TableRow
                    key={i}
                    n={team.place}
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

      {activeTab === 1 && activeTournament &&
        Object.entries(getGamesByTours(activeTournament.calendar))
          .map(([tour, games],i) => {
            return <GamesList
              key={i}
              header={`${tour} ТУР`}
              games={games}
              // onGoToGame={goToGame} // !!!!
            />
          })
      }

      {activeTab === 2 && activeTournament &&
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

      {/* {activeTab === 3 && activeTournament &&
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

      {activeTab === 4 && activeTournament &&
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
      } */}


    </Panel>
  )
}

export default TournamentPanel