import React from 'react';

import bridge from '@vkontakte/vk-bridge'
import {
  Button,
  Div,
  FormItem,
  Gallery,
  Link,
  NativeSelect,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Placeholder,
  Spinner,
} from '@vkontakte/vkui';
import { Icon56CheckCircleOutline } from '@vkontakte/icons';

import { useDispatch, useSelector } from 'react-redux';
import { goBack } from '../../store/slices/navigation';
import { RootState } from '../../store/rootReducer';
import api from '../../api';
import { TournamentInfo } from '../../types/TournamentInfo';

interface AddWidgetPanelProps
{
  id : string
}

const APP_ID = 7746401
const VERSION = '5.126'

const AddWidgetPanel : React.FC<AddWidgetPanelProps> = ({
  id,
}) => {
  const dispatch = useDispatch()
  // const {user} = useSelector((s:RootState) => s.user)
  const user = {id:612381684}
  const {activeLeague} = useSelector((s:RootState) => s.league)

  const goToLeague = () => {
    dispatch(goBack())
  }

  const [step, setStep] = React.useState(0)

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const [activeGroup, setActiveGroup] = React.useState<number|null>(null)
  const [activeTournament, setActiveTournament] = React.useState<number>(+activeLeague!.tournaments[0].id)
  const [groups,setGroups] = React.useState<{id:number,name:string,photo_50:string}[]>([])
  const [accessToken,setAccessToken] = React.useState('')
  const [appInGroup,setAppInGroup] = React.useState(false)
  
  const requestGroups = async () => {
    try
    {
      setLoading(true)
      const {access_token} = await bridge.send('VKWebAppGetAuthToken',{app_id:APP_ID,scope:'groups'})
      const res = await bridge.send('VKWebAppCallAPIMethod', {
        method : 'groups.get', params : {user_id : user!.id,filter:'admin',extended:1,fields:'name',access_token,v:VERSION}
      })
      setLoading(false)

      const groups = res.response.items
      if(groups.length === 0)
      {
        setError('У вас нет администрируемых групп')
        setStep(-1)
      }
      else
      {
        setGroups(groups)
        setActiveGroup(groups[0].id)
        setStep(s=>s+1)
      }
    }
    catch(e)
    {
      console.log('ERROR : ', e, e.error_data)
      setError('')
    }
    finally
    {
      setLoading(false)
    }
  }

  const changeGroup = (e : React.FormEvent<HTMLSelectElement>) => {
    if(accessToken) setAccessToken('')
    setActiveGroup(+e.currentTarget.value)
  }

  const changeTournament = (e : React.FormEvent<HTMLSelectElement>) => {
    setActiveTournament(+e.currentTarget.value)
  }

  const addWidget = async () => {
    setLoading(true)
    try
    {
      const tournament : TournamentInfo = await api.getTournament({
        tournamentId:activeTournament!,
        siteType:activeLeague!.tournaments[0].siteType,
      })

      const createMatch = ({
        date, home, away, score
      } : {
        date : string,
        home : string,
        away : string,
        score : number[]
      }) => {
        return {
          state : date,
          team_a : { name : home },
          team_b : { name : away },
          score : { team_a : score[0], team_b : score[1] }
        }
      }

      const games = tournament.calendar.length !== 0 ? tournament.calendar.slice(0,4) : tournament.results.slice(0,4)
      const matches = JSON.stringify(games.map(game => {
        const score = !game.score ? [0,0] : game.score.split(':').map(s=>+s)
        return createMatch({
          date:`${game.date.replace('.2021','').replace('.2020','').replace(' ','')}, ${game.time}`,
          home:game.homeName,
          away:game.awayName,
          score,
        })
      }) )

      const code = `
            return {
              "title": "Матчи",
              "title_url": "https://vk.com/app7746401#league${activeLeague?.id}",
              "more": "Весь список",
              "more_url": "https://vk.com/app7746401#league${activeLeague?.id}",
              "matches": ${matches}
            };
          `

      await bridge.send('VKWebAppShowCommunityWidgetPreviewBox',{group_id : activeGroup!, type : 'matches', code,})

      await api.addWidget({
        user_id : user!.id,
        group_id : activeGroup!,
        app_id : APP_ID,
        access_token : accessToken,
        v : VERSION,
        league_id : activeLeague!.id,
        tournament_id : activeTournament!,
        site_type : activeLeague!.tournaments[0].siteType
      })
      setStep(s=>s+1)
    }
    catch(e)
    {
      console.log('ERROR : ', e, e.error_data)
      setError('')
    }
    finally
    {
      setLoading(false)
    }
  }

  const requestToken = async () => {
    try
    {
      const {access_token} = await bridge.send("VKWebAppGetCommunityToken", {
        app_id : APP_ID,
        group_id : activeGroup!,
        scope:'app_widget'
      })
      setAccessToken(access_token)
    }
    catch(e)
    {
      console.log('ERROR : ', e, e.error_data)
      setError('')
    }
  }

  const addInGroup = async () => {
    try
    {
      await bridge.send('VKWebAppAddToCommunity')
    }
    catch(e)
    {
      console.log('Error : ', e, e.error_data)
      setError('')
    }
  }



  // React.useEffect(() => {
  //   const app_id = 7746401
  //   const group_id = 202380422
  //   const v = '5.126'
  //   const trying = async () => {
  //     try
  //     {
  //       const {access_token} = await bridge.send("VKWebAppGetCommunityToken", {app_id,group_id,scope:'app_widget'})
        
  //       const createMatch = ({
  //         date, home, away, score
  //       } : {
  //         date : string,
  //         home : string,
  //         away : string,
  //         score : number[]
  //       }) => {
  //         return {
  //           state : date,
  //           team_a : { name : home },
  //           team_b : { name : away },
  //           score : { team_a : score[0], team_b : score[1] }
  //         }
  //       }

  //       const code = `
  //             return {
  //               "title_counter" : 10,
  //               "title": "Name of widget",
  //               "title_url": "https://vk.com/app123456#source=from_title",
  //               "more": "Весь список",
  //               "more_url": "https://vk.com/app123456#source=from_footer",
  //               "matches": ${JSON.stringify([
  //                 createMatch({date:'15.01.21 (пн), 20:45',home:'HOME1',away:'AWAY AWAY AWAY 1',score:[5,3]}),
  //                 createMatch({date:'15 февраля 2021, пн, 20:99',home:'Home sdds fsd2',away:'away2',score:[3,4]})
  //               ])}
  //             };
  //           `

  //       await bridge.send('VKWebAppShowCommunityWidgetPreviewBox',{
  //         group_id, type : 'matches', code,
  //       })

  //       // await bridge.send('VKWebAppCallAPIMethod',{
  //       //   method : 'appWidgets.update',
  //       //   params : {
  //       //     v,
  //       //     access_token,
  //       //     type : 'matches',
  //       //     code,
  //       //   }
  //       // })
  //     }
  //     catch(e)
  //     {
  //       console.log('ERROR : ',e.error_data)
  //     }
  //   }

  //   // trying()
  // },[])

  

  return(
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={goToLeague} />}
      >Виджет</PanelHeader>

      {loading && <Div><Spinner/></Div>}
      {error && <h1>Error :(</h1>}

      {step === 0 && !loading && <>
        <Placeholder
          action={<Button onClick={requestGroups} mode="tertiary">Запросить группы</Button>}
        >
          Необходимо выбрать группу, в которую будет установлен виджет.
          Для получения списка групп понадобится токен доступа.
        </Placeholder>
      </>}

      {step === 1 && <>
        <FormItem top="Выберите группу">
          <NativeSelect
            onChange={changeGroup}
          >
            {groups.map(group => {
              return <option key={group.id} value={group.id}>{group.name}</option>
            })}
          </NativeSelect>
        </FormItem>
        {!accessToken
          ? <Button
              before={'❌'}
              mode="tertiary"
              style={{width:'100%',display:'flex',color:'var(--accent)'}}
              size="l"
              onClick={requestToken}
            >Предоставить токен</Button>
          : <div style={{paddingLeft:12}}>✅ Токен предоставлен</div>
        }
        {accessToken &&
          <Div>
            <Button
              style={{width:'100%'}}
              size="l"
              onClick={() => setStep(s=>s+1)}
            >Далее</Button>
          </Div>
        }
      </>}

      {step === 2 && <>
          <FormItem top="Выберите лигу для отображения">
          <NativeSelect
            onChange={changeTournament}
          >
            {activeLeague!.tournaments.map(t => {
              return <option key={t.id} value={t.id}>{t.name}</option>
            })}
          </NativeSelect>
        </FormItem>
        
        <Button
          before={'⚠️'}
          mode="tertiary"
          style={{width:'100%',display:'flex',color:'var(--accent)'}}
          size="l"
          onClick={addInGroup}
        >Убедитесь, что приложение установлено в сообществе</Button>
        <Div>
          <Button
            style={{width:'100%'}}
            size="l"
            onClick={addWidget}
          >Предпросмотр</Button>
        </Div>
      </>}

      {step === 3 && <>
        <Placeholder
          icon={<Icon56CheckCircleOutline fill="green"/>}
        >
          Виджет установлен <br/><br/>
          ⚠️ <br/>
          В данный момент он доступен только администраторам сообщества.
          Чтобы открыть его для всех, перейдите с компьютера в
          <Link target="_blank" href={`https://vk.com/club${activeGroup}?act=apps`}> управление сообществом {'>'} приложения </Link>
          и установите поле <b>Видимость виджета приложения </b> в значение <b>все пользователи</b>
        </Placeholder>
      </>}
    </Panel>
  )
}

export default AddWidgetPanel