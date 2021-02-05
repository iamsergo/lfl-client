import React from 'react';

import bridge from '@vkontakte/vk-bridge'
import {
  Avatar,
  Button,
  Card,
  Cell,
  Div,
  Header,
  List,
  Panel,
  PanelHeader,
  Snackbar,
  usePlatform,
} from '@vkontakte/vkui';
import { 
  Icon28ChevronRightOutline, 
  Icon28ChevronDownOutline,
  Icon28FavoriteCircleFillYellow,
  Icon28AddCircleFillBlue,
  Icon28ReplyCircleFillGreen,
  Icon28Users3Outline,
  Icon16DoneCircle,
  Icon28HomeOutline
} from '@vkontakte/icons';

import { useDispatch } from 'react-redux';
import { goForward } from '../../store/slices/navigation';
import { requestTournament, setActiveTournament } from '../../store/slices/tournament';

import { TOURNAMENT_PANEL } from '../../constans';

import { CityInfo } from '../../types/CityInfo';
import { Tournament } from '../../types/Tournament';
import { toggleCollapse } from '../../store/slices/tournaments';

interface TournamentsPanelProps
{
  id : string
  cities : (CityInfo & {collapsed : boolean})[]
}

const GROUP_ID = 202380422
const GROUP_HREF = `https://vk.com/club${GROUP_ID}`

const TournamentsPanel : React.FC<TournamentsPanelProps> = ({
  id,
  cities,
}) => {
  const platform = usePlatform()
  const dispatch = useDispatch()

  const goToTournament = (t : Tournament) => {
    dispatch(goForward(TOURNAMENT_PANEL))
    dispatch(setActiveTournament(t))
    dispatch(requestTournament({tournamentId : +t.id, siteType : t.siteType }))
  }

  const [snackbar, setSnackbar] = React.useState<React.ReactElement | null>(null)
  const openSnackbar = (text : string) => {
    setSnackbar(
      <Snackbar
        before={
          <Avatar size={24} style={{backgroundColor:'var(--accent)'}}>
            <Icon16DoneCircle fill="#fff" width={14} height={14} />
          </Avatar>
        }
        onClose={() => setSnackbar(null)}
      >{text}</Snackbar>
    )
  }

  const addToFavourite = () => {
    bridge.send('VKWebAppAddToFavorites')
      .then(_=>openSnackbar('Успешно добавлено !'))
      .catch(err=>err)
  }

  const joinToGroup = () => {
    bridge.send('VKWebAppJoinGroup',{group_id:GROUP_ID})
      .then(_=>openSnackbar('Вы вступили. Спасибо!'))
      .catch(err=>err)
  }

  const goToGroup = () => {
    let a = document.createElement('a')
    a.href = GROUP_HREF
    a.click()
    a.remove()
  }

  const share = () => {
    bridge.send('VKWebAppShare')
      .then(res=>res)
      .catch(err=>err)
  }

  const addToHomeScreen = () => {
    bridge.send('VKWebAppAddToHomeScreen')
      .then(_=>openSnackbar('Успешно добавлено !'))
      .catch(err=>err)
  }

  return(
    <Panel id={id}>
      <PanelHeader separator={false}>Главная</PanelHeader>
      
      <Header>Информация</Header>
      <Div>
        <Card>
          <Div>
            <div style={{display:'flex'}}>
              <Button
                style={{marginBottom:8,width:'100%',display:'flex',marginRight:8}}
                size="l"
                before={<Icon28Users3Outline/>}
                onClick={goToGroup}
              >Группа</Button>
              <Button
                style={{marginBottom:8,display:'flex',justifyContent:'center',alignItems:'center'}}
                size="l"
                before={<Icon28AddCircleFillBlue/>}
                onClick={joinToGroup}
              />
            </div>
            <Button
              style={{marginBottom:8,width:'100%',display:'flex',}}
              size="l"
              before={<Icon28FavoriteCircleFillYellow/>}
              onClick={addToFavourite}
            >Добавить в избранное</Button>
            <Button
              style={{marginBottom:8,width:'100%',display:'flex',}}
              size="l"
              before={<Icon28ReplyCircleFillGreen/>}
              onClick={share}
            >Поделиться</Button>
            {platform === 'android' &&
              <Button
                style={{marginBottom:0,width:'100%',display:'flex',}}
                size="l"
                onClick={addToHomeScreen}
                before={<Icon28HomeOutline/>}
              >На дом. экран</Button>
            }
          </Div>
        </Card>
      </Div>

      <Header>Турниры</Header>
      {cities.map((city, i) => {
        return <Div key={i} style={{paddingBottom: i===cities.length-1 ? 12 : 0}}>
          <Card>
            <div
              onClick={() => dispatch(toggleCollapse(i))}
              style={{display:'flex',padding:8}}
            >
              <div style={{display:'flex',flex:1,alignItems:'center',}}>
                <Avatar mode="image" size={32} src={city.tournaments[0].logo}/>
                &nbsp;&nbsp;<div style={{flex:1}}>{city.title}</div>
              </div>
              <Icon28ChevronDownOutline
                style={{color:'var(--accent)',transform : `rotate(${city.collapsed ? '0deg' : '180deg'})`}}
              />
            </div>
            {!city.collapsed &&
              <List>
                {city.tournaments.map((t,i) => {
                  return <Cell
                    key={i}
                    after={<Icon28ChevronRightOutline/>}
                    onClick={() => goToTournament(t)}
                  >{t.name}</Cell>
                })}
              </List>
            }
          </Card>
        </Div>
      })}

      {snackbar}
    </Panel>
  )
}

export default TournamentsPanel