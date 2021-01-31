import React from 'react';

import {
  Avatar,
  Card,
  Cell, 
  Div, 
  Group, 
  Header, 
  List, 
  Panel, 
  PanelHeader
} from '@vkontakte/vkui';
import { Icon28ChevronRightOutline, Icon28ChevronDownOutline } from '@vkontakte/icons';

import { useDispatch } from 'react-redux';
import { goForward } from '../../store/slices/navigation';
import { setActiveTournament } from '../../store/slices/tournament';

import { TOURNAMENT_PANEL } from '../../constans';

import { CityInfo } from '../../types/CityInfo';
import { Tournament } from '../../types/Tournament';
import { toggleCollapse } from '../../store/slices/tournaments';
import ListHeader from '../../components/ListHeader';

interface TournamentsPanelProps
{
  id : string
  cities : (CityInfo & {collapsed : boolean})[]
}

const TournamentsPanel : React.FC<TournamentsPanelProps> = ({
  id,
  cities,
}) => {
  const dispatch = useDispatch()

  const goToTournament = (t : Tournament) => {
    dispatch(goForward(TOURNAMENT_PANEL))
    dispatch(setActiveTournament(t))
  }

  return(
    <Panel id={id}>
      <PanelHeader separator={false}>Турниры</PanelHeader>
      
      {cities.map((city, i) => {
        return <Div key={i}>
          <Card>
            <Header>{city.title}</Header>
            <List>
              {city.tournaments.map((t,i) => {
                return <Cell
                  key={i}
                  before={<Avatar mode="image" src={t.logo} />}
                  after={<Icon28ChevronRightOutline/>}
                  description={t.city}
                  onClick={() => goToTournament(t)}
                >{t.name}</Cell>
              })}
            </List>
          </Card>
        </Div>
      })}
    </Panel>
  )
}

export default TournamentsPanel