import React from 'react';
import './GameInfoTabs.sass'

import {HorizontalScroll, Tabs, TabsItem} from '@vkontakte/vkui';
import { Icon28GlobeOutline, Icon28AdvertisingOutline, Icon28CalendarOutline } from '@vkontakte/icons';
interface GameInfoTabsProps
{
  date : string | null
  refery : string | null
  place : string | null
}

const GameInfoTabs : React.FC<GameInfoTabsProps> = ({
  date,
  refery,
  place,
}) => {
  return(
    <HorizontalScroll style={{marginBottom:20}}>
      <Tabs mode="buttons">
        {date && 
          <TabsItem selected={true} className="game-info__item">
            <Icon28CalendarOutline/><div>{date}</div>
          </TabsItem>
        }
        {place && 
          <TabsItem selected={true} className="game-info__item">
            <Icon28GlobeOutline/><div>{place}</div>
          </TabsItem>
        }
        {refery && 
          <TabsItem selected={true} className="game-info__item">
            <Icon28AdvertisingOutline/><div>{refery}</div>
          </TabsItem>
        }
      </Tabs>
    </HorizontalScroll>
  )
}

export default GameInfoTabs