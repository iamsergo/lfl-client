import React from 'react';

import {
  Group, 
  Avatar, 
  Cell, 
  Header, 
  Counter,
} from '@vkontakte/vkui';

import { GameInfo } from '../../types/GameInfo';

interface GamesListProps
{
  games : GameInfo[]
  header ?: string
  onGoToGame ?: (game : GameInfo) => void
}

const GamesList : React.FC<GamesListProps> = ({
  games,
  header,
  onGoToGame,
}) => {
  return(
    <Group header={header && <Header>{header}</Header>}>
      {games.map((game,i) => {
        return <Cell
          disabled={!onGoToGame}
          key={i}
          before={<div style={{display:'flex',marginRight:8,}}>
            <Avatar mode="image" src={game.homeLogo}/>
            <Avatar mode="image" src={game.awayLogo}/>
          </div>}
          after={game.score && <Counter mode="primary" style={{padding:4}}>{game.score}</Counter>}
          description={game.date !== '-' && 
            <div>
              <div>{game.date}, {game.time}</div>
              {game.place !== '-' && <div>{game.place}</div>}
            </div>
          }
          onClick={() => onGoToGame && onGoToGame(game)}
        ><div>{game.homeName}</div><div>{game.awayName}</div></Cell>
      })}
    </Group>
  )
}

export default GamesList