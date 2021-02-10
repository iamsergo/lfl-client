import React from 'react';

import {
  Group, 
  Avatar, 
  Cell, 
  Header, 
  Counter,
} from '@vkontakte/vkui';

import { GameInfo } from '../../types/GameInfo';
import Score from '../Score';

interface GamesListProps
{
  games : GameInfo[]
  header ?: string
  teamHref ?: string
  onGoToGame ?: (game : GameInfo) => void
}

const GamesList : React.FC<GamesListProps> = ({
  games,
  header,
  teamHref,
  onGoToGame,
}) => {
  return(
    <Group
      header={header && <Header>{header}</Header>}
    >
      {games.map((game,i) => {
        let background = ''
        if(teamHref)
        {
          const colors = {
            win:'var(--button_commerce_background)',
            draw:'orange',
            lose:'var(--button_secondary_destructive_foreground)'
          }
          const [home, away] = game.score.split(':').map(s=>+s)

          if(home > away)
            background = teamHref === game.homeHref ? colors.win : colors.lose
          else if(home < away)
            background = teamHref === game.homeHref ? colors.lose : colors.win
          else
            background = colors.draw
        }

        return <Cell
          disabled={!onGoToGame || (game.date === '-' && !game.score)}
          // disabled={true}
          key={i}
          before={<div style={{display:'flex',marginRight:8,}}>
            <Avatar mode="image" src={game.homeLogo}/>
            <Avatar mode="image" src={game.awayLogo}/>
          </div>}
          after={game.score && <Score background={background}>{game.score}</Score>}
          description={game.date && game.date !== '-' && 
            <div>
              <div>{game.date}, {game.time}</div>
              {game.place !== '-' && <div>{game.place}</div>}
            </div>
          }
          onClick={() => onGoToGame && onGoToGame(game)}
        ><div><div>{game.homeName}</div><div>{game.awayName}</div></div></Cell>
      })}
    </Group>
  )
}

export default GamesList