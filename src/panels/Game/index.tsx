import React from 'react';

import {
  Div,
  Link,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Placeholder,
  Spinner} from '@vkontakte/vkui';

import { useSelector } from 'react-redux';
import { goBack, goForward } from '../../store/slices/navigation';
import { RootState } from '../../store/rootReducer';
import { goBackToTeam, setActiveTeam } from '../../store/slices/team';
import { clearActiveGame, goForwardToGame, requestGame } from '../../store/slices/game';
import {useAppDispatch} from '../../store/store';

import GameHeader from '../../components/Headers/GameHeader';
import GameInfoTabs from '../../components/GameInfoTabs';
import EventRow from '../../components/EventRow';

import { TEAM_PANEL } from '../../constans';

import { ClubInfo } from '../../types/ClubInfo';
import { requestPredictions, clearPredictionsInfo } from '../../store/slices/predictions';
import { nowLessThen } from '../../utils/nowLessThen';

interface GamePanelProps
{
  id : string
}

// const TABS = [ 'События', 'Составы',]

const GamePanel : React.FC<GamePanelProps> = ({
  id,
}) => {
  const dispatch = useAppDispatch()
  const {history} = useSelector((s:RootState) => s.navigation)
  const {activeGameInfo,activeGameEvents,loading, error} = useSelector((s:RootState) => s.game)
  const {activeTournament,activeSiteType,activeDivisionId} = useSelector((s:RootState) => s.tournament)
  const {user} = useSelector((s:RootState) => s.user)

  const [activeTab] = React.useState(0)
  const [, setUserPrediction] = React.useState<0|1|null>(null)

  const canPredict = nowLessThen(
    activeGameInfo.date.split(' ')[0].split('.').map(s=>+s),
    activeGameInfo.time.split(':').map(s=>+s)
  )

  const goToBack = () => {
    const isToTeam = history[history.length-2] === 'team'
    if(isToTeam) dispatch(goBackToTeam())
    
    dispatch(goBack())
    dispatch(clearActiveGame())
    dispatch(clearPredictionsInfo())
  }

  const goToTeam = (team : ClubInfo) => {

    dispatch(goForwardToGame())
    
    dispatch(setActiveTeam(team))
    dispatch(goForward(TEAM_PANEL))

    dispatch(clearActiveGame())
    dispatch(clearPredictionsInfo())

    // dispatch(requestSquad({tournamentId, clubId}))
  }


  React.useEffect(() => {
    if(activeGameEvents) return

    if(activeGameInfo.matchHref.includes('/empty_protocol'))
    {
      const matchId = +activeGameInfo.matchHref.replace('/match','').replace('/empty_protocol','')
      const prediction = user!.predictions.find(p => p.matchId === matchId)
      if(prediction)
      {
        setUserPrediction(prediction.prediction)
      }

      if(!canPredict || !!prediction)
        dispatch(requestPredictions(matchId))
      return
    }

    const postfix = activeSiteType === 0
      ? (activeDivisionId
        ? `/division${activeDivisionId}/tour${activeGameInfo.tour}`
        : `/tournament${activeTournament!.tournamentId}/tour${activeGameInfo.tour}`
      )
      : activeGameInfo.matchHref

    const matchId = activeSiteType === 0 ? activeGameInfo.matchHref.replace('/match','') : ''

    const req = dispatch(requestGame({
      postfix,
      siteType : activeSiteType,
      matchId,
    }) )
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


  return(
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={goToBack} />}
      >Матч</PanelHeader>

      <GameHeader
        home={home}
        away={away}
        score={!activeGameInfo.score ? '-:-' : activeGameInfo.score}
        onGoToTeam={goToTeam}
      />

      <GameInfoTabs
        date={activeGameInfo.date !== '-' ? `${activeGameInfo.date}, ${activeGameInfo.time}` : null}
        refery={activeGameEvents && activeGameEvents.refery !== '-' ? activeGameEvents.refery : null}
        place={activeGameEvents && activeGameEvents.place !== '-' ? activeGameEvents.place : null}
      />

      {/* {!loading && !noInformation && activeGameInfo.score &&
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
      } */}
      
      {/* {!activeGameInfo.score &&
        <Prediction
          canPredict={canPredict}
          userPrediction={userPrediction}
          predictionsInfo={predictionsInfo}
          loading={loadingPrediction}
          title="Количество голов"
          variants={['Больше 7', 'Не больше 7']}
          onPrediction={doPredict}
        />
      } */}

      {error &&
        <Placeholder>
          Произошла ошибка, попробуйте посмотреть информацию на
          <Link
            href={activeSiteType === 0
              ? (activeDivisionId
                ? `https://www.lfl.ru/division${activeDivisionId}/tour${activeGameInfo.tour}`
                : `https://www.lfl.ru/tournament${activeTournament!.tournamentId}/tour${activeGameInfo.tour}`
              )
              : `http://www.goalstream.org${activeGameInfo.matchHref}`}
          >&nbsp;сайте</Link>
        </Placeholder>
      }

      {activeGameEvents && activeGameEvents.events.length === 0 && <Placeholder>Нет информации</Placeholder>}
      
      {loading && <>
        <Div><Spinner/></Div>
        <Placeholder>Загрузка займет некоторое время. Пожалуйста, подождите</Placeholder>
      </>}


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

      {/* {!loading && activeTab === 1 && <>
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
      </>} */}
    </Panel>
  )
}

export default GamePanel