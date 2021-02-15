import React from 'react';

import { Button, Div, FormItem, ModalPage, ModalPageHeader, ModalRoot, Slider, Spinner } from '@vkontakte/vkui';

import { EDIT_GAME_MODAL } from '../constans';
import { GameInfo } from '../types/GameInfo';
import GameHeader from '../components/Headers/GameHeader';
import { useSelector } from 'react-redux';
import { requestEditScore, setActiveModal } from '../store/slices/modal';
import { RootState } from '../store/rootReducer';
import { setEditedGame } from '../store/slices/tournament';
import { useAppDispatch } from '../store/store';

interface GameEditModalProps
{

}

const GameEditModal : React.FC<GameEditModalProps> = () => {
  const dispatch = useAppDispatch()

  const {user} = useSelector((s:RootState) => s.user)
  const {activeTournament} = useSelector((s:RootState) => s.tournament)
  const {activeGame : game, activeModal, loading} = useSelector((s:RootState) => s.modal)

  const [homeScore, setHomeScore] = React.useState(0)
  const [awayScore, setAwayScore] = React.useState(0)

  const closeModal = () => {
    dispatch(setActiveModal(null))
  }

  const saveScore = () => {
    dispatch(requestEditScore({
      userId : user!.id,
      tournamentId : activeTournament!.tournamentId,
      matchHref : game!.matchHref,
      score : `${homeScore}:${awayScore}`,
    })).then(_ => {
      dispatch(setEditedGame({matchHref : game!.matchHref, score : `${homeScore}:${awayScore}`}))
    })
  }

  return(
    <ModalRoot
      activeModal={activeModal}
      onClose={closeModal}
    >
      <ModalPage
        id={EDIT_GAME_MODAL}
        header={<ModalPageHeader>Редактирование</ModalPageHeader>}
      >
        {game &&
          <GameHeader
            home={{
              name : game.homeName,
              href : game.homeHref,
              logo : game.homeLogo,
            }}
            away={{
              name : game.awayName,
              href : game.awayHref,
              logo : game.awayLogo,
            }}
            score={`${homeScore}:${awayScore}`}
          />
        }

        <Div style={{display:'flex'}}>
          <FormItem style={{flex:1}}>
            <Slider
              disabled={loading}
              step={1}
              min={0}
              max={20}
              value={homeScore}
              onChange={s => setHomeScore(+s)}
            />
          </FormItem>
          <FormItem style={{flex:1}}>
            <Slider
              disabled={loading}
              step={1}
              min={0}
              max={20}
              value={awayScore}
              onChange={s => setAwayScore(+s)}
            />
          </FormItem>
        </Div>
        <Div>
          <Button
            disabled={loading}
            style={{width:'100%'}}
            size="l"
            onClick={saveScore}
            after={loading ? <Spinner /> : null}
          >Сохранить</Button>
        </Div>

      </ModalPage>
    </ModalRoot>
  )
}

export default GameEditModal