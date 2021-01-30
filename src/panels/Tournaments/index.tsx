import React from 'react';

import {
  Avatar,
  Cell, 
  List, 
  Panel, 
  PanelHeader
} from '@vkontakte/vkui';
import { Icon28ChevronRightOutline } from '@vkontakte/icons';

import { useDispatch } from 'react-redux';
import { goForward } from '../../store/slices/navigation';
import { setActiveTournament } from '../../store/slices/tournament';

import { TOURNAMENT_PANEL } from '../../constans';

import { Tournament } from '../../types/Tournament';

interface TournamentsPanelProps
{
  id : string
  tournaments : Tournament[]
}

const TournamentsPanel : React.FC<TournamentsPanelProps> = ({
  id,
  tournaments,
}) => {
  const dispatch = useDispatch()

  const goToTournament = (t : Tournament) => {
    dispatch(goForward(TOURNAMENT_PANEL))
    dispatch(setActiveTournament(t))
  }

  return(
    <Panel id={id}>
      <PanelHeader>Турниры</PanelHeader>
      
      <List>
        {tournaments.map((t,i) => {
          return <Cell
            key={i}
            before={<Avatar mode="image" src={t.logo} />}
            after={<Icon28ChevronRightOutline/>}
            description={t.city}
            onClick={() => goToTournament(t)}
          >{t.name}</Cell>
        })}
      </List>
    </Panel>
  )
}

export default TournamentsPanel