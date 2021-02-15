import React from 'react';
import './Headers.sass'

import {Avatar, Div} from '@vkontakte/vkui';
import { ClubInfo } from '../../types/ClubInfo';

interface Team
{
  logo : string
  href : string
  name : string
}

interface GameHeaderProps
{
  home : Team
  away : Team
  score : string
  onGoToTeam ?: (team : ClubInfo) => void
}

const GameHeader : React.FC<GameHeaderProps> = ({
  home,
  away,
  score,
  onGoToTeam,
}) => {
  // const goToTeam = (team : Team) => onGoToTeam(team as ClubInfo)

  return(
    <Div className="game-header__container">
      <div className="game-header__item"
        // onClick={() => goToTeam(home)}
      >
        <Avatar size={82} mode="image" src={home.logo} />
        <div style={{textAlign:'center'}}>{home.name}</div>
      </div>
      <div className="game-header__item" style={{fontSize:24}}>{score}</div>
      <div className="game-header__item"
        // onClick={() => goToTeam(away)}
      >
        <Avatar size={82} mode="image" src={away.logo} />
        <div style={{textAlign:'center'}}>{away.name}</div>
      </div>
    </Div>
  )
}

export default GameHeader