import React from 'react';

import {
  Group, 
  Avatar,
  Cell, 
  Header,
} from '@vkontakte/vkui';
import { Icon28EditOutline } from '@vkontakte/icons';

import { GameInfo } from '../../types/GameInfo';
import Score from '../Score';

interface GamesListProps
{
  games : GameInfo[]
  header ?: string
  teamHref ?: string
  editable ?: boolean
  onGoToGame ?: (game : GameInfo) => void
}

const GamesList : React.FC<GamesListProps> = ({
  games,
  header,
  teamHref,
  editable = false,
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
          disabled={!onGoToGame || (game.date === '-' && !game.score) || (editable && !!game.score)}
          // disabled={true}
          key={i}
          before={<div style={{display:'flex',marginRight:8,}}>
            <Avatar mode="image" src={game.homeLogo}/>
            <Avatar mode="image" src={game.awayLogo}/>
          </div>}
          after={
            editable && game.date !== '-' && game.time && !game.score
              ? <Icon28EditOutline/>
              : game.score && <Score background={background}>{game.score}</Score> 
          }
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