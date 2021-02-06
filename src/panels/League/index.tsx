import React from 'react';

import bridge from '@vkontakte/vk-bridge'
import {
  Avatar,
  Cell,
  CellButton,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Placeholder,
  Snackbar,
} from '@vkontakte/vkui';
import { Icon16DoneCircle, Icon28ChevronRightOutline,Icon24Copy } from '@vkontakte/icons';

import { useDispatch, useSelector } from 'react-redux';
import { goBack, goForward } from '../../store/slices/navigation';
import { RootState } from '../../store/rootReducer';

import { TOURNAMENT_PANEL } from '../../constans';
import PlainHeader from '../../components/Headers/PlainHeader';
import { requestTournament, setActiveTournament } from '../../store/slices/tournament';
import { Tournament } from '../../types/Tournament';

interface LeaguePanelProps
{
  id : string
}

const LeaguePanel : React.FC<LeaguePanelProps> = ({
  id,
}) => {
  const dispatch = useDispatch()
  const {activeLeague} = useSelector((s:RootState) => s.league)

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
            {activeLeague.tournaments.map((t,i) => {
              return <Cell
                key={i}
                after={<Icon28ChevronRightOutline/>}
                onClick={() => goToTournament(t)}
              >{t.name}</Cell>
            })}
            <CellButton
              centered
              before={<Icon24Copy/>}
              onClick={copyLink}
            >Сслка на лигу</CellButton>
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