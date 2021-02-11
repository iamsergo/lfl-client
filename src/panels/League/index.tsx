import React from 'react';

import bridge from '@vkontakte/vk-bridge'
import {
  Avatar,
  Card,
  Cell,
  CellButton,
  Div,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Placeholder,
  Snackbar,
} from '@vkontakte/vkui';
import { Icon16DoneCircle, Icon28ChevronRightOutline,Icon24Copy, Icon24Add, Icon28FavoriteOutline, Icon28UnfavoriteOutline } from '@vkontakte/icons';

import { useDispatch, useSelector } from 'react-redux';
import { goBack, goForward } from '../../store/slices/navigation';
import { RootState } from '../../store/rootReducer';

import { ADD_WIDGET_PANEL, TOURNAMENT_PANEL } from '../../constans';
import PlainHeader from '../../components/Headers/PlainHeader';
import { requestTournament, setActiveTournament } from '../../store/slices/tournament';
import { Tournament } from '../../types/Tournament';
import Actions from '../../components/Actions';

interface LeaguePanelProps
{
  id : string
}

const LeaguePanel : React.FC<LeaguePanelProps> = ({
  id,
}) => {
  const dispatch = useDispatch()
  const {activeLeague} = useSelector((s:RootState) => s.league)
  const {user} = useSelector((s:RootState) => s.user)

  const goToBack = () => {
    dispatch(goBack())
  }

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

  const copyLink = () => {
    bridge.send('VKWebAppCopyText',{text:`https://vk.com/app7746401#league${activeLeague!.id}`})
      .then(_ => openSnackbar('Скопировано'))
      .catch(e=>e)
  }

  const goToAddWidget = () => {
    dispatch(goForward(ADD_WIDGET_PANEL))
  }

  const [openThisLeague,setOpenThisLeague] = React.useState(false)
  React.useEffect(() => {
    const init = async () => {
      try
      {
        const {keys} = await bridge.send('VKWebAppStorageGet',{keys:['favorite']})
        const favorite = keys.find(entrie => entrie.key === 'favorite')
        if(!favorite)
          setOpenThisLeague(false)
        else
          setOpenThisLeague(favorite.value === `league${activeLeague!.id}`)
      }
      catch(err){}
    }

    init()
  },[])

  const toggleOpenThisLeague = async () => {
    try
    {
      await bridge.send('VKWebAppStorageSet',{
        key:'favorite',
        value: openThisLeague ? '' : `league${activeLeague!.id}`
      })

      setOpenThisLeague(!openThisLeague)
    }
    catch(err){}
  }

  return(
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={goToBack} />}
      >Лига</PanelHeader>

      {activeLeague
        ? <>

            <PlainHeader
              href={activeLeague.vkHref}
              hrefText={'Группа'}
              logo={activeLeague.tournaments[0].logo}
              title={activeLeague.title}
            />

            <Div style={{paddingBottom:0}}>
              <Card>
                {activeLeague.tournaments.map((t,i) => {
                  return <Cell
                    key={i}
                    after={<Icon28ChevronRightOutline/>}
                    onClick={() => goToTournament(t)}
                  >{t.name}</Cell>
                })}
              </Card>
            </Div>

            <Actions openSnackbar={openSnackbar} />

            <Div style={{paddingTop:0}}>
              <Card>
                <CellButton
                  style={{color: !openThisLeague ? 'orange' : 'red'}}
                  before={
                    !openThisLeague
                      ? <Icon28FavoriteOutline style={{marginRight:8,color:'orange'}}/>
                      : <Icon28UnfavoriteOutline style={{marginRight:8,color:'red'}}/>
                  }
                  onClick={toggleOpenThisLeague}
                >{
                  !openThisLeague
                    ? 'Открывать сразу эту лигу'
                    : 'Не открывать сразу эту лигу'
                }</CellButton>
                <CellButton
                  before={<Icon24Copy style={{marginRight:8}}/>}
                  onClick={copyLink}
                  description="Прямая ссылка на эту страницу"
                >Скопировать ссылку на лигу</CellButton>

                <CellButton
                  before={<Icon24Add style={{marginRight:8}}/>}
                  onClick={goToAddWidget}
                  description="Для администраторов групп"
                >Добавить виджет в группу</CellButton>
              </Card>
            </Div>
          </>
        : <Placeholder>Ничего не найдено. Попробуйте найти турнир в
          <span
            style={{color:'var(--accent)'}}
            onClick={goToBack}
          > списке</span>
        </Placeholder>
      }

      {snackbar}
    </Panel>
  )
}

export default LeaguePanel