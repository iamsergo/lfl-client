import React from 'react';

import {
  Cell,
  Div,
  HorizontalScroll,
  List,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Placeholder,
  Spinner,
  Tabs,
  TabsItem
} from '@vkontakte/vkui';

import { useSelector } from 'react-redux';
import { goBack, goForward } from '../../store/slices/navigation';
import { RootState } from '../../store/rootReducer';
import { goBackToTeam, requestSquad, setActiveTeam } from '../../store/slices/team';
import { clearActiveGame, goForwardToGame, requestGame } from '../../store/slices/game';
import {useAppDispatch} from '../../store/store';

import GameHeader from '../../components/Headers/GameHeader';
import GameInfoTabs from '../../components/GameInfoTabs';
import EventRow from '../../components/EventRow';

import { TEAM_PANEL } from '../../constans';

import { ClubInfo } from '../../types/ClubInfo';

interface GamePanelProps
{
  id : string
}

const TABS = [ 'События', 'Составы',]

const GamePanel : React.FC<GamePanelProps> = ({
  id,
}) => {
  const dispatch = useAppDispatch()
  const {history} = useSelector((s:RootState) => s.navigation)
  const {activeGameInfo,activeGameEvents,loading} = useSelector((s:RootState) => s.game)
  // const {activeGameInfo,loading} = useSelector((s:RootState) => s.game)
  const {activeTournament} = useSelector((s:RootState) => s.tournament)

  const [activeTab, setActiveTab] = React.useState(0)
  const [activeTeamTab, setActiveTeamTab] = React.useState(0)

  const goToBack = () => {
    const isToTeam = history[history.length-2] === 'team'
    if(isToTeam) dispatch(goBackToTeam())
    
    dispatch(goBack())
    dispatch(clearActiveGame())
  }

  const goToTeam = (team : ClubInfo) => {
    const tournamentId = activeTournament!.tournamentId
    const clubId = team.href.replace('/club','')

    dispatch(goForwardToGame())
    
    dispatch(setActiveTeam(team))
    dispatch(goForward(TEAM_PANEL))

    dispatch(clearActiveGame())

    dispatch(requestSquad({tournamentId, clubId}))
  }

  React.useEffect(() => {
    if(activeGameEvents) return

    const req = dispatch(requestGame({
      gameId : activeGameInfo.matchHref.replace('/match',''),
      tourId : ''+activeGameInfo.tour,
      tournamentId : activeTournament!.tournamentId,
    }))
    return () => {
      req.abort()
    }
  },[])

  const home = {
    name : activeGameInfo.homeName,
    href : activeGameInfo.homeHref,
    logo : activeGameInfo.homeLogo,
  }
  
  const away = {
    name : activeGameInfo.awayName,
    href : activeGameInfo.awayHref,
    logo : activeGameInfo.awayLogo,
  }

  const noInformation = activeGameEvents && !activeGameEvents.squads.some(s => s.length > 0)

  return(
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={goToBack} />}
      >Матч</PanelHeader>

      <GameHeader
        home={home}
        away={away}
        score={activeGameInfo.score}
        onGoToTeam={goToTeam}
      />

      <GameInfoTabs
        date={activeGameInfo.date !== '-' ? `${activeGameInfo.date}, ${activeGameInfo.time}` : null}
        refery={activeGameEvents && activeGameEvents.refery !== '-' ? activeGameEvents.refery : null}
        place={activeGameEvents && activeGameEvents.place !== '-' ? activeGameEvents.place : null}
      />

      {!loading && !noInformation &&
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
      }
      
      {noInformation && <Placeholder>Нет информации</Placeholder>}
      
      {loading && <Div><Spinner/></Div>}


      {!loading && activeTab === 0 && activeGameEvents &&
        activeGameEvents.events.map((e,i) => {
          let eventSymbol = ''
          if(e.type === 'goal') eventSymbol = '⚽'
          else if(e.type === 'assist') eventSymbol = '✅'
          else if(e.type === 'yc') eventSymbol = '🟨'
          else eventSymbol = '🟥'
          
          return <EventRow
            key={i}
            playerName={e.name}
            eventType={eventSymbol}
            isHome={e.team === 0}
            minute={e.minute}
          />
        })
      }

      {!loading && activeTab === 1 && <>
        <Tabs mode="buttons">
          {[activeGameInfo.homeName,activeGameInfo.awayName].map((team,i) => {
            return <TabsItem
              key={i}
              selected={activeTeamTab === i}
              onClick={() => setActiveTeamTab(i)}
            >{team}</TabsItem>
          })}
        </Tabs>
        <List>
          {activeGameEvents &&
            activeGameEvents.squads[activeTeamTab].map((player,i) => {
              return <Cell
                disabled
                key={i}
                description={activeGameInfo[activeTeamTab === 0 ? 'homeName' : 'awayName']}
              >{player.name}</Cell>
            })
          }
        </List>
      </>}
    </Panel>
  )
}

export default GamePanel